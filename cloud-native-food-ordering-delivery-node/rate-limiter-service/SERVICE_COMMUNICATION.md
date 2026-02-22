# Service Communication Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Clients                                     │
│                    (Mobile Apps, Web Browsers)                           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      API Gateway / Istio Ingress                         │
│                    (Rate Limiting Middleware)                            │
└───┬────────────┬──────────┬──────────┬──────────┬────────────┬──────────┘
    │            │          │          │          │            │
    │            │          │          │          │            │
    ▼            ▼          ▼          ▼          ▼            ▼
┌───────┐  ┌──────────┐ ┌──────┐ ┌──────────┐ ┌────────┐ ┌────────────┐
│ Auth  │  │Restaurant│ │Order │ │ Payment  │ │ Admin  │ │Notification│
│Service│  │ Service  │ │Service│ │ Service  │ │Service │ │  Service   │
└───┬───┘  └────┬─────┘ └───┬──┘ └─────┬────┘ └───┬────┘ └─────┬──────┘
    │           │           │          │          │            │
    │           │           │          │          │            │
    └───────────┴───────────┴──────────┴──────────┴────────────┘
                             │                    │
                             │                    ▼
                             │              ┌──────────┐
                             │              │  Kafka   │
                             │              │ (Events) │
                             │              └──────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
            ┌─────────────┐   ┌──────────────┐
            │  Rate       │   │  Food        │
            │  Limiter    │   │  Delivery    │
            │  Service    │   │  Server      │
            └──────┬──────┘   └──────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌────────┐         ┌──────────┐
    │ Redis  │         │PostgreSQL│
    │(State) │         │ (Rules)  │
    └────────┘         └──────────┘
         │
         └─────────────────────────┐
                                   │
                    ┌──────────────┴──────────┐
                    ▼                         ▼
              ┌──────────┐              ┌──────────┐
              │ MongoDB  │              │ MongoDB  │
              │ (Auth)   │              │ (Orders) │
              └──────────┘              └──────────┘
```

## Data Flow: Request with Rate Limiting

```
┌────────┐     ┌────────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐
│ Client │────▶│ API Gateway│────▶│   Rate   │────▶│  Target  │────▶│Response│
│        │     │(Middleware)│     │ Limiter  │     │ Service  │     │        │
└────────┘     └────────────┘     └──────────┘     └──────────┘     └────────┘
                    │                   │
                    │                   ▼
                    │              ┌────────┐
                    │              │ Redis  │
                    │              │Check & │
                    │              │ Update │
                    │              └────────┘
                    │
                    ▼ (if 429)
               ┌─────────┐
               │ Reject  │
               │with 429 │
               └─────────┘

Sequence:
1. Client → API Gateway
2. Gateway extracts key (userId/IP/apiKey)
3. Gateway → Rate Limiter: POST /check {key, cost}
4. Rate Limiter → Redis: Lua script (atomic check + update)
5. Redis returns: {allowed: true/false, remaining, retryAfter}
6. If allowed:
   - Gateway → Target Service
   - Target Service → Response
7. If denied (429):
   - Gateway returns 429 with Retry-After header
```

## Integration Pattern: Middleware Example

```typescript
// API Gateway Middleware
import axios from 'axios';

const RATE_LIMITER_URL = 'http://rate-limiter-service.food-delivery.svc.cluster.local:3000';

export const rateLimitMiddleware = async (req, res, next) => {
  // Extract identifier (priority: userId > apiKey > IP)
  const userId = req.user?.id;
  const apiKey = req.headers['x-api-key'];
  const ip = req.ip;
  
  const key = userId ? `user:${userId}` 
            : apiKey ? `apikey:${apiKey}` 
            : `ip:${ip}`;
  
  try {
    const response = await axios.post(
      `${RATE_LIMITER_URL}/api/rate-limiter/check`,
      { key, cost: 1 },
      { timeout: 2000 } // 2s timeout
    );
    
    // Set rate limit headers
    res.set('X-RateLimit-Remaining', 
            response.headers['x-ratelimit-remaining']);
    
    next(); // Allow request
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      res.set('X-RateLimit-Remaining', '0');
      res.set('Retry-After', error.response.headers['retry-after']);
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: error.response.data.retryAfterMs 
      });
    }
    
    // Rate limiter service down - fail-closed (reject) or fail-open (allow)
    console.error('Rate limiter unavailable:', error.message);
    
    // OPTION A: Fail-closed (recommended for production)
    return res.status(503).json({ error: 'Service temporarily unavailable' });
    
    // OPTION B: Fail-open (allow traffic, risk abuse)
    // next();
  }
};

// Apply to specific routes
app.use('/api/*', rateLimitMiddleware);
```

## Service Dependencies

```
┌──────────────────────────────────────────────────────────────┐
│                    Rate Limiter Service                       │
├──────────────────────────────────────────────────────────────┤
│ Dependencies:                                                 │
│  • Redis (CRITICAL) - Token bucket state                     │
│  • PostgreSQL (Important) - Rule configuration               │
│                                                               │
│ Dependent Services:                                           │
│  • API Gateway (calls before routing)                        │
│  • Auth Service (optional, for login rate limiting)          │
│  • Order Service (optional, for order creation limits)       │
│  • Payment Service (optional, for payment request limits)    │
│  • Admin Service (for rule management)                       │
└──────────────────────────────────────────────────────────────┘
```

## Kubernetes Service Discovery

```
┌────────────────────────────────────────────────────────────┐
│                  Kubernetes DNS                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Service Name: rate-limiter-service                        │
│  Namespace: food-delivery                                  │
│                                                             │
│  Internal FQDN:                                            │
│  rate-limiter-service.food-delivery.svc.cluster.local     │
│                                                             │
│  Short Names (within namespace):                           │
│  • rate-limiter-service                                    │
│  • rate-limiter-service.food-delivery                     │
│                                                             │
│  Port: 3000 (ClusterIP)                                    │
│                                                             │
│  Endpoints: 3 pods (via selector: app=rate-limiter-service)│
│   ├─ rate-limiter-service-7d9f8b-abc123 (10.244.1.5:3000) │
│   ├─ rate-limiter-service-7d9f8b-def456 (10.244.2.8:3000) │
│   └─ rate-limiter-service-7d9f8b-ghi789 (10.244.3.2:3000) │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Istio Service Mesh (Optional)

```
┌─────────────────────────────────────────────────────────────────┐
│                       Istio Service Mesh                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Traffic Flow: Client → Envoy Sidecar → Rate Limiter            │
│                                                                  │
│  Features:                                                       │
│  ✓ mTLS between services (automatic encryption)                 │
│  ✓ Circuit breaking (fail fast on errors)                       │
│  ✓ Retries (3 attempts, 2s timeout)                            │
│  ✓ Load balancing (consistent hash by User-ID)                 │
│  ✓ Authorization (only allowed services can call)               │
│  ✓ Observability (Jaeger traces, Kiali graphs)                 │
│                                                                  │
│  Configuration:                                                  │
│  • VirtualService: Routing rules, retries, timeouts            │
│  • DestinationRule: Load balancing, circuit breaking            │
│  • Gateway: External access (optional)                          │
│  • AuthorizationPolicy: mTLS + service-level authz             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Request Flow with Istio:

Client → Ingress Gateway (Envoy) 
       → API Gateway Pod (Envoy Sidecar) 
       → Rate Limiter Pod (Envoy Sidecar)
       → Rate Limiter Container
       → Redis
       
All ↔ connections are mTLS encrypted
```

## Scaling Strategy

```
┌──────────────────────────────────────────────────────────────┐
│              Horizontal Pod Autoscaler (HPA)                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Min Replicas: 3                                             │
│  Max Replicas: 10                                            │
│                                                               │
│  Scale Up When:                                              │
│   • CPU > 70%                                                │
│   • Memory > 80%                                             │
│                                                               │
│  Scale Down When:                                            │
│   • CPU < 50% for 5 minutes                                  │
│   • Memory < 60% for 5 minutes                               │
│                                                               │
│  Current: 3 pods @ 250m CPU, 256Mi memory each              │
│  Peak: 10 pods @ 500m CPU, 512Mi memory each                │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Redis Scaling                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Current: Single Redis instance (5Gi storage)                │
│                                                               │
│  For Production:                                             │
│   • Redis Cluster (3 master + 3 replica)                    │
│   • Sharding by key hash                                     │
│   • Automatic failover                                       │
│   • Capacity: 1M+ ops/sec                                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Latency (p50) | < 3ms | Redis + Lua script |
| Latency (p95) | < 5ms | Including network overhead |
| Latency (p99) | < 10ms | With DB query cache miss |
| Throughput | 10k+ req/sec | Per replica |
| Max Throughput | 100k+ req/sec | 10 replicas |
| Memory per replica | ~256MB | Including Node.js runtime |
| Redis memory | ~1KB per user | Active buckets only |
| Cache hit rate | >95% | Rule cache (60s TTL) |

## Failure Scenarios

| Scenario | Behavior | Recovery |
|----------|----------|----------|
| Redis down | 503 Service Unavailable (fail-closed) | Redis failover (30s) |
| PostgreSQL down | Uses cached rules (60s) | DB reconnection |
| Rate Limiter pod crash | Requests route to other pods | K8s restarts pod |
| Network partition | Service mesh retries | Auto-recovery |
| Redis memory full | LRU eviction (oldest buckets) | Monitor alerts |

## Monitoring Queries

```promql
# Request rate
rate(http_requests_total{service="rate-limiter"}[1m])

# Error rate
rate(http_requests_total{service="rate-limiter",status=~"5.."}[1m])

# 429 rate (rate limited requests)
rate(http_requests_total{service="rate-limiter",status="429"}[1m])

# Latency p95
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket{service="rate-limiter"}[1m])
)

# Redis operations
rate(redis_commands_total[1m])

# Cache hit rate
rate(rate_limiter_cache_hits_total[1m]) / 
  rate(rate_limiter_cache_requests_total[1m])
```
