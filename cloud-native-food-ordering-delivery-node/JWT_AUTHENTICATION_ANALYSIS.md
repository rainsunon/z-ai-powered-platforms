# JWT Authentication & Inter-Service Communication Analysis

## Overview

This food delivery system uses JWT (JSON Web Tokens) for authentication across all microservices. However, there are **two different verification patterns** being used, which creates inconsistency and potential security issues.

---

## 1. JWT Token Generation

### Location: `auth-service`

#### Token Generation Method
File: [auth/model/User.js](auth/model/User.js#L137-L156)

```javascript
// Generate JWT for authentication (Access Token)
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "jwt-secret-key-develop-only",
    {
      expiresIn: "1d",  // 24 hours
    }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key-develop-only",
    {
      expiresIn: "7d",  // 7 days
    }
  );
};
```

#### Token Payload Structure
**Access Token:**
```json
{
  "id": "user_mongodb_id",
  "role": "customer|restaurant|delivery|admin",
  "iat": 1708034400,
  "exp": 1708120800
}
```

**Refresh Token:**
```json
{
  "id": "user_mongodb_id",
  "iat": 1708034400,
  "exp": 1708639200
}
```

#### Usage in Registration/Login
File: [auth/controller/authController.js](auth/controller/authController.js#L1-L80)

```javascript
const register = async (req, res) => {
  // ... user creation logic ...
  
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  
  user.refreshToken = refreshToken;
  await user.save();
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  
  res.status(201).json({
    success: true,
    token,         // Access token
    refreshToken,  // Refresh token
    user: userResponse
  });
};
```

---

## 2. JWT Token Verification (Two Different Patterns)

### ⚠️ Pattern 1: Local Verification (Shared Secret)

**Used by:** 
- `restaurant-service`

**How it works:**
- Service verifies JWT locally using the same `JWT_SECRET` shared across all services
- No network call to auth-service
- Faster but less secure

**Implementation:**
File: [restaurant/middleware/authMiddleware.js](restaurant/middleware/authMiddleware.js)

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied!" });

  try {
    // LOCAL VERIFICATION - Uses shared JWT_SECRET
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.owner = decoded.id; // Attach owner ID to request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token!" });
  }
};
```

**Pros:**
- ✅ Fast (no network latency)
- ✅ Works even if auth-service is down
- ✅ Reduced load on auth-service

**Cons:**
- ❌ Cannot detect revoked tokens
- ❌ Cannot validate user status (active/suspended)
- ❌ Cannot detect deleted users
- ❌ Shared secret must be synchronized across all services

---

### ✅ Pattern 2: Remote Verification (Auth Service API)

**Used by:**
- `admin-service`
- `order-service`
- `payment-service`
- `notification-service`

**How it works:**
- Service calls auth-service's `/api/auth/validate-token` endpoint
- Auth-service verifies token AND checks user status in database
- More secure but slower

**Implementation:**
File: [admin-service/middlewares/authMiddleware.js](admin-service/middlewares/authMiddleware.js)

```javascript
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Not authorized to access this route",
      });
    }

    const token = authHeader.split(" ")[1];

    // REMOTE VERIFICATION - Calls auth-service
    try {
      const response = await axios.get(
        `${global.gConfig.auth_url}/api/auth/validate-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      req.user = response.data.user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Authentication failed: " + error.message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
```

**Auth Service Validation Endpoint:**
File: [auth/controller/authController.js](auth/controller/authController.js#L390-L440)

```javascript
const validateToken = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify JWT signature
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret-key-develop-only"
    );

    // Check if user exists in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check user status (active, suspended, etc.)
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `User account is ${user.status}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
```

**Pros:**
- ✅ Can detect revoked tokens
- ✅ Validates user status (active/suspended/banned)
- ✅ Validates user still exists in database
- ✅ Centralized authentication logic
- ✅ Can implement token blacklist

**Cons:**
- ❌ Network latency (adds 10-50ms per request)
- ❌ Single point of failure (if auth-service is down, all services fail)
- ❌ Increased load on auth-service
- ❌ Requires auth-service to be always available

---

### 🔄 Pattern 3: Hybrid Approach (Both Local + Remote)

**Used by:**
- `food-delivery-server`

**Implementation:**
File: [food-delivery-server/middleware/auth.js](food-delivery-server/middleware/auth.js)

```javascript
const protect = async (req, res, next) => {
  // ... extract token ...

  try {
    // STEP 1: Verify token locally using shared JWT_SECRET
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET
    );

    // STEP 2: Optionally validate with auth-service (double verification)
    const authResponse = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!authResponse.data.success) {
      throw new Error('Invalid token');
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token expired or invalid' 
    });
  }
};
```

**Pros:**
- ✅ Fast local verification first (JWT signature check)
- ✅ Remote verification ensures user status is current
- ✅ Best security

**Cons:**
- ❌ Slowest approach (two verification steps)
- ❌ Still fails if auth-service is down

---

## 3. Inter-Service Communication Flow

### Client → Service Request Flow

```
┌─────────────┐
│   Client    │
│  (Web/App)  │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       ▼
┌─────────────────────┐
│   Auth Service      │
│  (Port 5001)        │
│                     │
│  - Validates creds  │
│  - Generates JWT    │
└──────┬──────────────┘
       │
       │ 2. Returns: { token, user }
       ▼
┌─────────────┐
│   Client    │
│ Stores token│
└──────┬──────┘
       │
       │ 3. GET /api/orders (with Bearer token)
       ▼
┌────────────────────────┐
│   Order Service        │
│   (Port 5003)          │
│                        │
│  protect() middleware  │
└────────┬───────────────┘
         │
         │ 4. Validate token
         │    (calls auth-service)
         ▼
    ┌─────────────────────┐
    │   Auth Service      │
    │  /validate-token    │
    │                     │
    │  - Verify JWT       │
    │  - Check user DB    │
    │  - Check status     │
    └──────┬──────────────┘
           │
           │ 5. Returns: { success: true, user: {...} }
           ▼
    ┌────────────────────────┐
    │   Order Service        │
    │   Proceeds with request│
    │   req.user = {...}     │
    └────────────────────────┘
```

### Service → Service Communication

```
┌─────────────────────┐
│  Order Service      │
│  Creates new order  │
└──────┬──────────────┘
       │
       │ 1. POST /api/notifications/send
       │    Headers: { Authorization: "Bearer <user_token>" }
       ▼
┌──────────────────────────┐
│  Notification Service    │
│  (Port 5004)             │
│                          │
│  protect() middleware    │
└──────┬───────────────────┘
       │
       │ 2. Validate token with auth-service
       ▼
┌─────────────────────┐
│   Auth Service      │
│  /validate-token    │
└──────┬──────────────┘
       │
       │ 3. Token valid
       ▼
┌──────────────────────────┐
│  Notification Service    │
│  Sends notification      │
└──────────────────────────┘
```

**Key Points:**
- Services forward the **client's JWT token** in inter-service calls
- Each service validates the token independently
- Token contains user identity and role
- Role-based authorization is enforced at each service

---

## 4. Configuration & Secrets

### Kubernetes Secrets
File: [kubernetes/secrets.yaml](kubernetes/secrets.yaml)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: food-delivery
type: Opaque
data:
  # Base64 encoded: "your_jwt_secret"
  JWT_SECRET: eW91cl9qd3Rfc2VjcmV0
  JWT_REFRESH_SECRET: eW91cl9yZWZyZXNoX3NlY3JldA==
```

### Service Configuration
All services must have the **same JWT_SECRET** for local verification to work:

File: [kubernetes/auth-service.yaml](kubernetes/auth-service.yaml#L29-L40)
```yaml
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: JWT_SECRET
  - name: JWT_EXPIRE
    value: "1d"
  - name: JWT_REFRESH_SECRET
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: JWT_REFRESH_SECRET
```

**Same configuration replicated in:**
- `admin-service.yaml`
- `order-service.yaml`
- `payment-service.yaml`
- `notification-service.yaml`
- `restaurant-service.yaml`
- `food-delivery-server.yaml`

---

## 5. Security Issues & Recommendations

### 🚨 Critical Issues

#### Issue #1: Inconsistent Verification Patterns
**Problem:**
- Restaurant service uses local verification only
- Other services use remote verification
- No standardization

**Impact:**
- Restaurant service cannot detect:
  - Revoked tokens
  - Suspended users
  - Deleted users

**Recommendation:**
```javascript
// Standardize on remote verification for all services
// OR implement a hybrid approach with local caching

// Option 1: Remote verification (recommended)
const protect = async (req, res, next) => {
  const token = extractToken(req);
  
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 }
    );
    
    req.user = response.data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Option 2: Hybrid with caching (best performance + security)
const protect = async (req, res, next) => {
  const token = extractToken(req);
  
  try {
    // Step 1: Verify JWT signature locally (fast)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 2: Check cache for user status
    const cachedUser = await redis.get(`user:${decoded.id}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }
    
    // Step 3: Validate with auth service (cache miss)
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 2000 }
    );
    
    // Cache user for 5 minutes
    await redis.setex(`user:${decoded.id}`, 300, JSON.stringify(response.data.user));
    
    req.user = response.data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
```

---

#### Issue #2: No Token Revocation/Blacklist
**Problem:**
- Tokens remain valid until they expire (24 hours)
- No way to immediately revoke a token
- If user logs out or gets banned, their token still works

**Recommendation:**
Implement token blacklist in auth-service using Redis:

```javascript
// auth/utils/tokenBlacklist.js
import { redis } from '../config/redis.js';

export const blacklistToken = async (token, expiresIn) => {
  // Store token hash in Redis with TTL matching token expiration
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await redis.setex(`blacklist:${tokenHash}`, expiresIn, '1');
};

export const isTokenBlacklisted = async (token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const result = await redis.get(`blacklist:${tokenHash}`);
  return result === '1';
};

// Update validateToken endpoint
const validateToken = async (req, res) => {
  // ... existing verification ...
  
  // Check if token is blacklisted
  if (await isTokenBlacklisted(token)) {
    return res.status(401).json({
      success: false,
      message: "Token has been revoked",
    });
  }
  
  // ... continue validation ...
};

// Logout endpoint
const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
  
  await blacklistToken(token, expiresIn);
  
  res.json({ success: true, message: "Logged out successfully" });
};
```

---

#### Issue #3: Token Payload is Too Small
**Problem:**
- Token only contains `{ id, role }`
- Every request requires database lookup to get user details
- Wastes database queries

**Recommendation:**
Include more user data in JWT payload (balance between size and performance):

```javascript
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      email: this.email,        // Add
      name: this.name,          // Add
      status: this.status,      // Add
      permissions: this.permissions || []  // Add (if applicable)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
```

**Trade-off:**
- ✅ Reduces database queries
- ✅ Faster request processing
- ❌ Larger token size (acceptable for 100-200 bytes more)
- ❌ User data can be stale until token expires

---

#### Issue #4: No Token Refresh Mechanism in Services
**Problem:**
- Refresh tokens are generated but not properly used
- No automatic token refresh on expiration
- Poor user experience (forced logout after 24 hours)

**Recommendation:**
Implement token refresh endpoint and client-side auto-refresh:

```javascript
// auth/controller/authController.js
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    
    // Find user and validate stored refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    
    // Generate new access token
    const newAccessToken = user.generateAuthToken();
    
    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
```

---

#### Issue #5: No Rate Limiting on Token Validation
**Problem:**
- No rate limiting on `/api/auth/validate-token` endpoint
- Can be abused (DDoS attack vector)
- Auth service can be overwhelmed

**Recommendation:**
Integrate with the newly created rate-limiter-service:

```javascript
// auth/routes/authRoutes.js
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware.js';

router.get(
  '/validate-token', 
  rateLimitMiddleware({ key: 'auth:validate-token', points: 100, duration: 60 }),
  validateToken
);

// auth/middlewares/rateLimitMiddleware.js
import axios from 'axios';

export const rateLimitMiddleware = (options) => {
  return async (req, res, next) => {
    const key = `${options.key}:${req.ip}`;
    
    try {
      await axios.post('http://rate-limiter-service:3000/api/rate-limiter/check', {
        key,
        cost: 1
      });
      next();
    } catch (error) {
      if (error.response?.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }
      // Fail-open: allow request if rate limiter is down
      next();
    }
  };
};
```

---

#### Issue #6: No Monitoring/Logging
**Problem:**
- No tracking of token validation success/failure
- No alerting on suspicious activity
- Cannot detect brute force attacks

**Recommendation:**
Add structured logging and metrics:

```javascript
// auth/utils/logger.js
import winston from 'winston';

export const authLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.File({ filename: 'auth-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'auth-combined.log' }),
  ],
});

// In validateToken
authLogger.info('Token validation attempt', {
  userId: decoded.id,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  success: true
});

// On failure
authLogger.warn('Token validation failed', {
  token: token.substring(0, 20) + '...',
  ip: req.ip,
  reason: error.message
});
```

---

## 6. Best Practices Summary

### ✅ Do's

1. **Use Remote Verification for Critical Operations**
   - Payment processing
   - Admin actions
   - User data updates

2. **Use Hybrid Approach with Caching**
   - Read-only operations
   - High-traffic endpoints
   - Balance security and performance

3. **Implement Token Blacklist**
   - Logout functionality
   - Account suspension
   - Security incidents

4. **Short Token Expiration**
   - Access token: 15 minutes - 1 hour
   - Refresh token: 7-30 days
   - Force re-authentication when needed

5. **Monitor Token Usage**
   - Track validation failures
   - Alert on suspicious patterns
   - Log authentication events

### ❌ Don'ts

1. **Don't Use Only Local Verification**
   - Cannot revoke tokens
   - Cannot detect user status changes

2. **Don't Store Sensitive Data in JWT**
   - No passwords
   - No API keys
   - No credit card numbers

3. **Don't Trust Client-Side Token Validation**
   - Always verify on server
   - Never rely on client checks

4. **Don't Share Secrets in Code**
   - Use environment variables
   - Use secret management (Kubernetes Secrets, AWS Secrets Manager)

5. **Don't Ignore Token Expiration**
   - Implement proper refresh mechanism
   - Handle 401 errors gracefully

---

## 7. Recommended Architecture (Future State)

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Login
       ▼
┌─────────────────────┐
│   Auth Service      │
│  - JWT generation   │
│  - Token validation │
│  - Token blacklist  │
└──────┬──────────────┘
       │
       │ 2. Token + Refresh Token
       ▼
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 3. API Request (Bearer token)
       ▼
┌────────────────────────────────────┐
│   API Gateway / Istio              │
│  - Rate limiting                   │
│  - JWT validation (local)          │
│  - Request routing                 │
└────────┬───────────────────────────┘
         │
         │ 4. Validated request
         ▼
    ┌──────────────────────┐
    │  Business Service    │
    │  (Order/Payment/etc) │
    │                      │
    │  Optional: Re-verify │
    │  for critical ops    │
    └──────────────────────┘

    ┌────────────────────┐
    │  Redis Cache       │
    │  - User status     │
    │  - Token blacklist │
    │  - TTL: 5 min      │
    └────────────────────┘
```

**Key Improvements:**
1. API Gateway handles primary JWT validation (reduces load on services)
2. Redis caching for user status (reduces database queries)
3. Token blacklist in Redis (enables instant revocation)
4. Critical operations re-verify with auth-service
5. Rate limiting at gateway level

---

## 8. Migration Plan

### Phase 1: Standardize Verification (Week 1)
- ✅ Update restaurant-service to use remote verification
- ✅ Implement consistent error handling across all services
- ✅ Add timeout configuration (2 seconds) for auth-service calls

### Phase 2: Add Token Blacklist (Week 2)
- ✅ Deploy Redis for token blacklist
- ✅ Implement blacklist functions in auth-service
- ✅ Add logout endpoint
- ✅ Update validateToken to check blacklist

### Phase 3: Implement Caching (Week 3)
- ✅ Deploy Redis for user caching
- ✅ Update all services to use hybrid verification
- ✅ Set cache TTL to 5 minutes
- ✅ Implement cache invalidation on user updates

### Phase 4: Add Rate Limiting (Week 4)
- ✅ Integrate rate-limiter-service
- ✅ Add rate limiting to /validate-token endpoint
- ✅ Add rate limiting to login/register endpoints
- ✅ Configure rate limits per endpoint

### Phase 5: Monitoring & Logging (Week 5)
- ✅ Add structured logging to all auth operations
- ✅ Set up Prometheus metrics
- ✅ Configure alerts for authentication failures
- ✅ Dashboard for token validation metrics

---

## 9. Code Examples

### Example: Updated Restaurant Service Middleware

```javascript
// restaurant/middleware/authMiddleware.js
import axios from "axios";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied - No token" });
    }

    const tokenValue = token.replace("Bearer ", "");

    // Step 1: Verify JWT signature locally (fast check)
    let decoded;
    try {
      decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(403).json({ message: "Invalid token signature" });
    }

    // Step 2: Check cache for user status
    const cacheKey = `user:${decoded.id}:status`;
    const cachedStatus = await redis.get(cacheKey);
    
    if (cachedStatus) {
      const userStatus = JSON.parse(cachedStatus);
      if (userStatus.status !== 'active') {
        return res.status(403).json({ message: `Account is ${userStatus.status}` });
      }
      req.owner = decoded.id;
      req.user = userStatus;
      return next();
    }

    // Step 3: Validate with auth service (cache miss)
    try {
      const response = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
        {
          headers: { Authorization: token },
          timeout: 2000 // 2 second timeout
        }
      );

      if (response.data.success) {
        // Cache user status for 5 minutes
        await redis.setex(
          cacheKey,
          300,
          JSON.stringify(response.data.user)
        );

        req.owner = decoded.id;
        req.user = response.data.user;
        next();
      } else {
        return res.status(403).json({ message: "Token validation failed" });
      }
    } catch (error) {
      console.error("Auth service validation error:", error.message);
      
      // Fail-closed: reject request if auth service is unreachable
      return res.status(503).json({ 
        message: "Authentication service temporarily unavailable" 
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
```

---

## Conclusion

The current JWT authentication system works but has several security and consistency issues:

1. ⚠️ **Inconsistent verification patterns** across services
2. ⚠️ **No token revocation mechanism**  
3. ⚠️ **No rate limiting on validation endpoints**
4. ⚠️ **No monitoring/alerting**
5. ⚠️ **No caching** (performance issue)

**Recommended Priority:**
1. **HIGH:** Standardize verification (remote + caching)
2. **HIGH:** Implement token blacklist
3. **MEDIUM:** Add rate limiting (integrate with rate-limiter-service)
4. **MEDIUM:** Implement monitoring/logging
5. **LOW:** Expand JWT payload

This will significantly improve security, performance, and maintainability of the authentication system.
