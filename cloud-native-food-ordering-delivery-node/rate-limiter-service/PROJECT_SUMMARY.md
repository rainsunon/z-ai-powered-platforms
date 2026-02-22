# Rate Limiter Service

## Overview
The Rate Limiter Service is a distributed microservice that implements the Token Bucket algorithm to protect backend services from abuse, ensure fair resource allocation, and prevent DoS attacks. It provides centralized rate limiting for the entire food delivery platform.

## Tech Stack
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Express.js
- **State Store**: Redis (Token buckets)
- **Configuration Store**: PostgreSQL (Rate limit rules)
- **ORM**: Drizzle ORM
- **Algorithm**: Token Bucket with Lua scripting

## Key Features
- **Token Bucket Algorithm**: Handles burst traffic gracefully while enforcing sustained rate limits
- **Atomic Operations**: Lua scripts in Redis prevent race conditions in distributed environment
- **Configurable Rules**: Dynamic rule management via REST API (create, update, delete)
- **Multiple Identifiers**: Support for User ID, IP address, and API key-based limiting
- **In-Memory Caching**: Rules cached for 60s to reduce database load
- **High Availability**: Stateless design enables horizontal scaling
- **Graceful Degradation**: Falls back to default rules when database unavailable
- **Health Checks**: Liveness and readiness probes for Kubernetes
- **Production Ready**: Dockerfile, Kubernetes manifests, Istio integration

## Architecture

### Token Bucket Implementation
```
Bucket Capacity: N tokens
Refill Rate: R tokens/second
Cost per request: C tokens (default 1)

Algorithm (in Redis Lua):
1. Fetch current tokens and last_refill timestamp
2. Calculate elapsed time since last refill
3. Refill: tokens = min(capacity, current + elapsed * rate)
4. Check: if tokens >= cost, allow and deduct
5. Else: deny and return retry_after time
```

### Data Flow
```
Request → API Gateway 
       → Rate Limiter Service (POST /check)
       → Redis (Lua script - atomic check + update)
       → Response (200 OK or 429 Too Many Requests)
```

### Storage
- **Redis**: Stores token bucket state (`rl:{key}` → {tokens, last_refill})
- **PostgreSQL**: Stores rate limit rules (key, type, points, duration)
- **Memory**: Caches rules (60s TTL) to minimize DB queries

## API Endpoints

### Check Rate Limit
**POST** `/api/rate-limiter/check`
```json
{
  "key": "user:123",  // Identifier
  "cost": 1           // Tokens to consume
}
```
Response: `200 OK` (allowed) or `429 Too Many Requests` (denied)

### Create/Update Rule
**POST** `/api/rate-limiter/rules`
```json
{
  "key": "user:123",
  "type": "TOKEN_BUCKET",
  "points": 100,      // Bucket capacity
  "duration": 60      // Per N seconds
}
```

### List Rules
**GET** `/api/rate-limiter/rules`

### Delete Rule
**DELETE** `/api/rate-limiter/rules/:key`

## Integration Patterns

### Pattern 1: API Gateway Middleware (Recommended)
```typescript
// Centralized rate limiting at gateway
app.use(async (req, res, next) => {
  const response = await fetch('http://rate-limiter-service:3000/api/rate-limiter/check', {
    method: 'POST',
    body: JSON.stringify({ key: extractKey(req), cost: 1 })
  });
  
  if (response.status === 429) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
});
```

### Pattern 2: Istio Service Mesh
- Transparent rate limiting at mesh layer
- No application code changes required
- mTLS, circuit breaking, retries included

### Pattern 3: Service-Level Client
- Each service imports rate limiter client
- Fine-grained control per endpoint

## Deployment

### Docker Compose (Local Development)
```bash
docker-compose up --build
```

### Kubernetes
```bash
kubectl apply -f kubernetes/rate-limiter-service.yaml
kubectl apply -f kubernetes/redis-service.yaml
```

### Istio (Production)
```bash
# Enable Istio injection
kubectl label namespace food-delivery istio-injection=enabled

# Deploy with Istio
kubectl apply -f kubernetes/rate-limiter-service.yaml
kubectl apply -f istio/virtual-service.yaml
kubectl apply -f istio/destination-rule.yaml
kubectl apply -f istio/security.yaml
```

## Scaling & Performance

### Horizontal Scaling
- **Min Replicas**: 3
- **Max Replicas**: 10 (HPA based on CPU 70%, Memory 80%)
- **Stateless Design**: All state in Redis, no inter-service coordination

### Performance Metrics
- **Latency**: < 5ms (p95)
- **Throughput**: 10,000+ checks/sec per replica
- **Memory**: ~256MB per replica
- **Redis Memory**: ~1KB per active user bucket

### Redis Scaling
- **Current**: Single Redis instance (5Gi storage)
- **Production**: Redis Cluster (3 master + 3 replica, 1M+ ops/sec)

## High Availability

### Failure Modes
- **Redis Down**: Fail-closed (return 503) to prevent abuse
- **PostgreSQL Down**: Use cached rules (60s TTL), fall back to hardcoded default
- **Pod Crash**: Kubernetes restarts, traffic routes to healthy pods

### Kubernetes Features
- **PodDisruptionBudget**: Minimum 2 pods available during updates
- **HorizontalPodAutoscaler**: Auto-scale based on CPU/memory
- **Readiness Probe**: Checks Redis + DB before accepting traffic
- **Liveness Probe**: Restarts unhealthy pods

### Istio Features (Optional)
- **mTLS**: Encrypted service-to-service communication
- **Circuit Breaking**: Isolate failing pods (5 consecutive errors)
- **Retries**: Automatic retry on transient failures (3 attempts)
- **Authorization**: Only whitelisted services can call rate limiter

## Monitoring & Observability

### Key Metrics
- Request rate (req/sec)
- Rejection rate (429 responses)
- Latency (p50, p95, p99)
- Redis operations/sec
- Cache hit rate (rule cache)

### Health Endpoints
- `GET /health` - Liveness probe (always returns 200)
- `GET /ready` - Readiness probe (checks Redis + PostgreSQL)

### Istio Observability
- **Jaeger**: Distributed tracing
- **Kiali**: Service graph visualization
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards

## Use Cases

### Per-User Limits
- Prevent individual users from abusing API
- Different tiers: free (100 req/hr), premium (1000 req/hr)

### Per-IP Limits
- Protect against DDoS from single IP
- Rate limit anonymous/unauthenticated users

### Endpoint-Specific Limits
- Expensive operations (search, AI) have lower limits
- Fast operations (read profile) have higher limits

### Global Limits
- Prevent system overload
- Circuit breaker for backend services

## Security Considerations
- **Key Validation**: Sanitize identifiers to prevent injection
- **Admin API**: Secure rule management endpoints (requires authentication)
- **Redis Auth**: Enable Redis AUTH in production
- **mTLS**: Encrypt all service-to-service traffic (Istio)
- **Audit Logging**: Log rule changes and rate limit violations

## Documentation
- [README.md](./README.md) - Quick start guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [SERVICE_COMMUNICATION.md](./SERVICE_COMMUNICATION.md) - Integration patterns
- [ISTIO.md](./ISTIO.md) - Istio deployment guide
- [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) - Issues fixed and improvements

## Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema to PostgreSQL
- `npm run db:studio` - Open Drizzle Studio (DB GUI)
