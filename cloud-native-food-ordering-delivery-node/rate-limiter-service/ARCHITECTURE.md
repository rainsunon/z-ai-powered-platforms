# Rate Limiter Service Architecture

## Overview
The Rate Limiter Service is a distributed microservice implementing the Token Bucket algorithm to protect backend services from abuse and ensure fair resource allocation.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway / Istio                       │
│                    (Entry Point for all requests)                 │
└────────────┬───────────────────────────┬────────────────────────┘
             │                           │
             │                           │
    ┌────────▼────────┐         ┌───────▼────────┐
    │  Rate Limiter   │         │  Other Services │
    │    Service      │         │  (Auth, Order,  │
    │   (Check API)   │         │   Restaurant)   │
    └────────┬────────┘         └─────────────────┘
             │
             │
    ┌────────▼────────────────────────────────┐
    │                                          │
    │   ┌──────────┐         ┌─────────────┐ │
    │   │  Redis   │         │  PostgreSQL │ │
    │   │ (State)  │         │   (Rules)   │ │
    │   └──────────┘         └─────────────┘ │
    │                                          │
    └──────────────────────────────────────────┘
```

## Communication Flow

### 1. Request Flow (API Gateway Integration)
```
Client → API Gateway → Rate Limiter Service → [Allow/Deny] → Target Service
         (Middleware)    (POST /check)
```

**Steps:**
1. Client makes request to API Gateway
2. API Gateway middleware extracts identifier (userId, IP, API key)
3. Synchronous call to Rate Limiter: `POST /api/rate-limiter/check`
4. Rate Limiter checks Redis, updates token bucket atomically
5. Returns `200 OK` (allowed) or `429 Too Many Requests` (denied)
6. If allowed, Gateway forwards to target service
7. Headers returned: `X-RateLimit-Remaining`, `Retry-After`

### 2. Rule Management Flow
```
Admin → Management UI → Rate Limiter API → PostgreSQL
                         (POST /rules)
```

**Endpoints:**
- `POST /api/rate-limiter/rules` - Create/Update rule
- `GET /api/rate-limiter/rules` - List all rules
- `DELETE /api/rate-limiter/rules/:key` - Delete rule

### 3. Token Bucket Algorithm (Lua Script in Redis)

```lua
1. Get current tokens and last_refill from Redis
2. Calculate elapsed time since last refill
3. Refill tokens: min(capacity, current + elapsed * rate)
4. Check if tokens >= requested
5. If yes: Deduct tokens, update Redis, return allowed
6. If no: Return denied with retry_after
```

**Key:** `rl:{identifier}` (e.g., `rl:user:123`, `rl:ip:192.168.1.1`)
**Fields:**
- `tokens`: Current token count
- `last_refill`: Unix timestamp of last refill

## Service Communication Patterns

### Microservice Integration Options

#### Option 1: API Gateway Middleware (Recommended)
```typescript
// In API Gateway (e.g., Express middleware)
app.use(async (req, res, next) => {
  const key = extractKey(req); // user:123, ip:x.x.x.x
  
  const response = await fetch('http://rate-limiter-service:3000/api/rate-limiter/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, cost: 1 })
  });
  
  if (response.status === 429) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  // Set headers
  res.set('X-RateLimit-Remaining', response.headers.get('X-RateLimit-Remaining'));
  next();
});
```

#### Option 2: Istio EnvoyFilter (Service Mesh)
```yaml
# Rate limiting at the mesh layer using External Authorization
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: rate-limit-policy
spec:
  selector:
    matchLabels:
      app: auth-service
  action: CUSTOM
  provider:
    name: rate-limiter
  rules:
  - to:
    - operation:
        paths: ["/api/*"]
```

#### Option 3: Service-Level Client
```typescript
// In each service that needs rate limiting
import { RateLimiterClient } from '@shared/rate-limiter-client';

const limiter = new RateLimiterClient('http://rate-limiter-service:3000');

app.post('/api/orders', async (req, res) => {
  const userId = req.user.id;
  
  const allowed = await limiter.checkLimit(`user:${userId}`);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  // Process order...
});
```

## Rule Configuration Examples

### Per-User Limits
```json
{
  "key": "user:123",
  "type": "TOKEN_BUCKET",
  "points": 1000,
  "duration": 3600
}
// 1000 requests per hour for user 123
```

### Per-IP Limits
```json
{
  "key": "ip:192.168.1.1",
  "type": "TOKEN_BUCKET",
  "points": 100,
  "duration": 60
}
// 100 requests per minute for this IP
```

### Global Default
```json
{
  "key": "global_default",
  "type": "TOKEN_BUCKET",
  "points": 100,
  "duration": 60
}
// Fallback: 100 requests per minute
```

### Endpoint-Specific Limits
```json
{
  "key": "endpoint:/api/search",
  "type": "TOKEN_BUCKET",
  "points": 10,
  "duration": 60
}
// 10 requests per minute to search endpoint
```

## High Availability & Scaling

### Horizontal Scaling
- **Stateless Service**: Multiple replicas can run in parallel
- **Shared State**: All instances share Redis (single source of truth)
- **No Coordination**: Lua scripts ensure atomicity without inter-service communication

### Redis Scaling Strategy
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Redis Shard 1│     │ Redis Shard 2│     │ Redis Shard 3│
│ (users A-H)  │     │ (users I-P)  │     │ (users Q-Z)  │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                    ▲                    ▲
       └────────────────────┴────────────────────┘
              Consistent Hashing by Key
```

**Using Redis Cluster:**
- Auto-sharding across 16,384 hash slots
- Master-Replica failover
- Handle 1M+ req/sec

### Failure Modes

#### Redis Unavailable
**Fail-Closed (Recommended for Production):**
```typescript
if (redisError) {
  return res.status(503).json({ error: 'Service temporarily unavailable' });
}
```

**Fail-Open (Development Only):**
```typescript
if (redisError) {
  console.error('Redis down, allowing request');
  return next(); // Allow all requests
}
```

#### Database Unavailable
- Service uses cached rules (in-memory cache, TTL 60s)
- Falls back to hardcoded global default
- Gracefully degrades

## Monitoring & Observability

### Key Metrics
- **Request Rate**: req/sec per service, per user, per IP
- **Rejection Rate**: Number of 429 responses
- **Latency**: p50, p95, p99 for rate limit checks
- **Redis Performance**: Operations/sec, memory usage
- **Cache Hit Rate**: Rule cache effectiveness

### Health Endpoints
- `GET /health` - Liveness probe (always returns 200)
- `GET /ready` - Readiness probe (checks Redis + DB connectivity)

## Security Considerations

1. **DoS Protection**: Rate limiting itself prevents abuse
2. **Key Validation**: Sanitize identifiers to prevent injection
3. **Admin API**: Secure `/rules` endpoints (require authentication)
4. **Redis Security**: Use AUTH, encrypt connections in production
5. **Audit Logging**: Log rule changes and rate limit violations

## Performance Characteristics

- **Latency**: < 5ms per check (Redis + Lua script)
- **Throughput**: 10,000+ checks/sec per replica
- **Memory**: ~256MB per replica (rules cache + overhead)
- **Redis Memory**: ~1KB per active user bucket

## Future Enhancements

1. **Distributed Rate Limiting**: Multi-region Redis with CRDTs
2. **Dynamic Rate Adjustment**: ML-based anomaly detection
3. **Client-Side Hints**: Return `X-RateLimit-Reset` header
4. **Batch Checks**: Check multiple keys in one request
5. **Webhooks**: Alert on rate limit violations
6. **Rule Templates**: Predefined limits for common scenarios
