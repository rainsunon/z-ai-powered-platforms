# JWT Inter-Service Communication - Quick Reference

## 📋 Current State Summary

### Token Generation
**Service:** `auth-service` (Port 5001)  
**Endpoint:** `POST /api/auth/login` or `POST /api/auth/register`

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "status": "active"
  }
}
```

**Token Structure:**
```javascript
// Access Token (expires in 1 day)
{
  id: "user_mongodb_id",
  role: "customer|restaurant|delivery|admin",
  iat: 1708034400,  // Issued at
  exp: 1708120800   // Expires at
}
```

---

## 🔐 Current Verification Patterns by Service

| Service | Port | Verification Method | Issues |
|---------|------|---------------------|--------|
| **auth-service** | 5001 | Generates & validates tokens | ✅ Central authority |
| **restaurant-service** | 5002 | ⚠️ **Local only** (jwt.verify with shared secret) | ❌ No revocation<br/>❌ No status check |
| **order-service** | 5003 | ✅ Remote (calls auth-service) | ✅ Full validation |
| **payment-service** | 5005 | ✅ Remote (calls auth-service) | ✅ Full validation |
| **admin-service** | 5006 | ✅ Remote (calls auth-service) | ✅ Full validation |
| **notification-service** | 5004 | ✅ Remote (calls auth-service) | ✅ Full validation |
| **food-delivery-server** | 5000 | 🔄 Hybrid (local + remote) | ✅ Best security |

---

## 📨 How Services Communicate

### Pattern: Service A → Service B

```javascript
// Example: Order Service calls Notification Service

// In Order Service (after order creation)
const response = await axios.post(
  'http://notification-service:5004/api/notifications/send',
  {
    userId: req.user.id,
    orderId: newOrder.id,
    type: 'order_placed'
  },
  {
    headers: {
      // IMPORTANT: Forward the original user's token
      'Authorization': req.headers.authorization  // Bearer <user_token>
    }
  }
);
```

**Key Points:**
1. Services **forward the client's JWT token** in the Authorization header
2. Receiving service validates the token (local or remote)
3. Token contains user identity and role
4. Each service can enforce its own authorization rules

---

## 🔄 Complete Request Flow

```
1. Client Login
   ├─> POST /api/auth/login {email, password}
   └─> Receives: {token, refreshToken, user}

2. Client Stores Token
   └─> localStorage.setItem('token', token)

3. Client Makes Request
   ├─> GET /api/orders
   └─> Headers: {Authorization: 'Bearer ' + token}

4. Order Service Receives Request
   ├─> protect() middleware extracts token
   ├─> Calls: GET auth-service/api/auth/validate-token
   └─> Sets: req.user = validatedUser

5. Order Service Processes Request
   ├─> Creates order in database
   └─> Calls Notification Service (forwards token)

6. Notification Service Validates Token
   ├─> protect() middleware extracts token
   ├─> Calls: GET auth-service/api/auth/validate-token
   └─> Sets: req.user = validatedUser

7. Notification Service Sends Email
   └─> Returns to Order Service

8. Order Service Returns Response
   └─> Client receives {order: {...}}
```

---

## 🛡️ Middleware Examples

### 1. Local Verification (Fast but Limited)

```javascript
// restaurant-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    // Verify JWT signature locally
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
```

**Advantages:**
- ⚡ Very fast (no network call)
- 🔄 Works even if auth-service is down

**Disadvantages:**
- ❌ Cannot detect revoked tokens
- ❌ Cannot check if user is suspended/deleted
- ❌ Stale data until token expires

---

### 2. Remote Verification (Secure)

```javascript
// order-service/middleware/auth.js
import axios from "axios";

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Call auth service to validate token
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000  // 2 second timeout
      }
    );

    if (response.data.success) {
      req.user = response.data.user;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    // Fail-closed: reject if auth service is down
    return res.status(503).json({ 
      message: "Authentication service unavailable" 
    });
  }
};
```

**Advantages:**
- ✅ Always validates against latest user data
- ✅ Detects suspended/deleted users
- ✅ Can detect revoked tokens (if blacklist implemented)

**Disadvantages:**
- 🐌 Slower (adds 10-50ms latency)
- 💥 Single point of failure (auth-service dependency)

---

### 3. Hybrid with Caching (Recommended)

```javascript
// Recommended approach for all services
import axios from "axios";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // STEP 1: Verify JWT signature locally (fast)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // STEP 2: Check Redis cache for user status
    const cacheKey = `user:${decoded.id}:status`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      // Cache hit - use cached user data
      const user = JSON.parse(cached);
      if (user.status !== 'active') {
        return res.status(403).json({ message: `Account ${user.status}` });
      }
      req.user = user;
      return next();
    }
    
    // STEP 3: Cache miss - validate with auth service
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 2000
      }
    );
    
    if (response.data.success) {
      // Cache user data for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(response.data.user));
      req.user = response.data.user;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
```

**Advantages:**
- ⚡ Fast (cache hit rate ~95%)
- ✅ Validates user status
- 📉 Reduces auth-service load by 95%
- 🔄 Graceful degradation

**Disadvantages:**
- 🏗️ Requires Redis setup
- 🕐 Up to 5 minutes of stale data

---

## 🔑 Environment Variables

All services need these environment variables:

```bash
# Shared JWT Secret (MUST be the same across all services)
JWT_SECRET=your-super-secret-key-min-32-chars

# For auth-service only
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRE=1d

# Auth service URL (for remote verification)
AUTH_SERVICE_URL=http://auth-service:5001
# or in Kubernetes:
AUTH_SERVICE_URL=http://auth-service.food-delivery.svc.cluster.local:5001

# Redis (for caching pattern)
REDIS_URL=redis://redis:6379
```

---

## 📦 Kubernetes Configuration

### Secrets

```yaml
# kubernetes/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: food-delivery
type: Opaque
data:
  # echo -n 'your-actual-secret' | base64
  JWT_SECRET: eW91ci1zdXBlci1zZWNyZXQta2V5LW1pbi0zMi1jaGFycw==
  JWT_REFRESH_SECRET: eW91ci1yZWZyZXNoLXNlY3JldC1rZXktbWluLTMyLWNoYXJz
```

### Service Deployment Example

```yaml
# kubernetes/order-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  template:
    spec:
      containers:
      - name: order-service
        image: order-service:latest
        env:
          # JWT Secret from Kubernetes Secret
          - name: JWT_SECRET
            valueFrom:
              secretKeyRef:
                name: app-secrets
                key: JWT_SECRET
          
          # Auth service URL (Kubernetes DNS)
          - name: AUTH_SERVICE_URL
            value: "http://auth-service.food-delivery.svc.cluster.local:5001"
          
          # Redis URL
          - name: REDIS_URL
            value: "redis://redis-service.food-delivery.svc.cluster.local:6379"
```

---

## 🧪 Testing JWT Authentication

### 1. Get Token

```bash
# Login to get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {...}
# }
```

### 2. Use Token in Requests

```bash
# Save token to variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Make authenticated request
curl -X GET http://localhost:5003/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Validate Token

```bash
# Check if token is valid
curl -X GET http://localhost:5001/api/auth/validate-token \
  -H "Authorization: Bearer $TOKEN"

# Response:
# {
#   "success": true,
#   "user": {
#     "id": "65abc123...",
#     "email": "user@example.com",
#     "role": "customer",
#     "status": "active"
#   }
# }
```

### 4. Refresh Token

```bash
REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"

# Response:
# {
#   "success": true,
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # New access token
# }
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid token" error across all services

**Cause:** JWT_SECRET mismatch between services

**Solution:**
```bash
# Verify all services have the same JWT_SECRET
kubectl get secret app-secrets -n food-delivery -o jsonpath='{.data.JWT_SECRET}' | base64 -d

# Update secret if needed
kubectl create secret generic app-secrets \
  --from-literal=JWT_SECRET=your-new-secret \
  --namespace=food-delivery \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart all services
kubectl rollout restart deployment -n food-delivery
```

### Issue 2: Service-to-service calls fail with 401

**Cause:** Not forwarding Authorization header

**Solution:**
```javascript
// ❌ Wrong - not forwarding token
await axios.post('http://notification-service/api/send', data);

// ✅ Correct - forward Authorization header
await axios.post('http://notification-service/api/send', data, {
  headers: {
    'Authorization': req.headers.authorization  // Forward token
  }
});
```

### Issue 3: Auth service overwhelmed with validation requests

**Cause:** All services doing remote verification on every request

**Solution:** Implement caching pattern (see Hybrid approach above)

**Impact:**
- Before: 1000 req/sec → 1000 auth validations
- After (95% cache hit): 1000 req/sec → 50 auth validations

### Issue 4: Cannot revoke tokens immediately

**Cause:** No token blacklist mechanism

**Solution:** Implement Redis-based blacklist (see [JWT_AUTHENTICATION_ANALYSIS.md](JWT_AUTHENTICATION_ANALYSIS.md#issue-2-no-token-revocationblacklist))

---

## 📊 Performance Comparison

| Verification Method | Latency | Auth Service Load | User Status Accuracy |
|---------------------|---------|-------------------|----------------------|
| **Local Only** | ~1ms | 0% | ❌ Stale (up to 24h) |
| **Remote Only** | ~20-50ms | 100% | ✅ Real-time |
| **Hybrid (No Cache)** | ~25-55ms | 100% | ✅ Real-time |
| **Hybrid (95% Cache Hit)** | ~2-5ms | 5% | ⚠️ 5-min stale |

**Recommendation:** Hybrid with caching (best balance)

---

## 🎯 Action Items

### Immediate (Week 1)
1. ✅ Standardize all services to use remote or hybrid verification
2. ✅ Fix restaurant-service to use remote verification
3. ✅ Ensure all services have correct JWT_SECRET in Kubernetes

### Short-term (Week 2-3)
4. ✅ Deploy Redis for caching
5. ✅ Implement hybrid verification with caching in all services
6. ✅ Add token blacklist support in auth-service

### Medium-term (Week 4-6)
7. ✅ Integrate rate-limiter-service for /validate-token endpoint
8. ✅ Add monitoring/logging for authentication events
9. ✅ Implement token refresh mechanism in clients

### Long-term (Month 2+)
10. ✅ Deploy API Gateway (Kong/Istio) for centralized JWT validation
11. ✅ Implement mTLS for service-to-service communication
12. ✅ Add distributed tracing (Jaeger) for auth flows

---

## 📚 Related Documentation

- [JWT_AUTHENTICATION_ANALYSIS.md](JWT_AUTHENTICATION_ANALYSIS.md) - Detailed analysis of current implementation
- [JWT_FLOW_DIAGRAMS.md](JWT_FLOW_DIAGRAMS.md) - Visual flow diagrams
- [auth/README.md](auth/README.md) - Auth service API documentation
- [rate-limiter-service/ARCHITECTURE.md](rate-limiter-service/ARCHITECTURE.md) - Rate limiter integration

---

## 🔗 Quick Links

| Service | Repository Path | Documentation |
|---------|----------------|---------------|
| Auth Service | `/auth` | [README](auth/README.md) |
| Order Service | `/order` | [README](order/README.md) |
| Restaurant Service | `/restaurant` | [README](restaurant/README.md) |
| Payment Service | `/payment-service` | - |
| Admin Service | `/admin-service` | - |
| Notification Service | `/notification-service` | - |

---

**Last Updated:** February 15, 2026  
**Maintainer:** System Architecture Team
