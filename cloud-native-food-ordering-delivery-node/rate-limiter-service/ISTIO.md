# Istio Integration Guide

This document explains how to deploy the Rate Limiter Service with Istio service mesh.

## Why Istio?

Istio provides:
- **Service Discovery**: Automatic load balancing across replicas
- **Traffic Management**: Advanced routing, retries, circuit breaking
- **Security**: mTLS between services, authorization policies
- **Observability**: Distributed tracing, metrics, logs
- **Resilience**: Automatic retries, timeouts, fault injection

## Prerequisites

1. **Install Istio**: Follow [Istio installation guide](https://istio.io/latest/docs/setup/getting-started/)
   ```bash
   istioctl install --set profile=demo -y
   ```

2. **Enable Istio Injection** in namespace:
   ```bash
   kubectl label namespace food-delivery istio-injection=enabled
   ```

## Deployment with Istio

### 1. Deploy Rate Limiter Service

```bash
kubectl apply -f kubernetes/rate-limiter-service.yaml
kubectl apply -f kubernetes/redis-service.yaml
```

Istio sidecar (Envoy proxy) is automatically injected into pods.

### 2. Create VirtualService (Traffic Routing)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: rate-limiter-vs
  namespace: food-delivery
spec:
  hosts:
  - rate-limiter-service
  http:
  - match:
    - uri:
        prefix: "/api/rate-limiter"
    route:
    - destination:
        host: rate-limiter-service
        port:
          number: 3000
        subset: v1
      weight: 100
    timeout: 5s
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: 5xx,reset,connect-failure,refused-stream
```

### 3. Create DestinationRule (Load Balancing & Circuit Breaking)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: rate-limiter-dr
  namespace: food-delivery
spec:
  host: rate-limiter-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    loadBalancer:
      consistentHash:
        httpHeaderName: "X-User-ID"  # Sticky sessions by user
    outlierDetection:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 40
  subsets:
  - name: v1
    labels:
      version: v1
```

### 4. Gateway for External Access (Optional)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: rate-limiter-gateway
  namespace: food-delivery
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "rate-limiter.example.com"
---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: rate-limiter-external-vs
  namespace: food-delivery
spec:
  hosts:
  - "rate-limiter.example.com"
  gateways:
  - rate-limiter-gateway
  http:
  - match:
    - uri:
        prefix: "/api/rate-limiter"
    route:
    - destination:
        host: rate-limiter-service
        port:
          number: 3000
```

## Integration Patterns with Istio

### Pattern 1: External Authorization Filter (Envoy Extension)

Use Istio's External Authorization to centralize rate limiting at the mesh layer.

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: rate-limit-authz
  namespace: food-delivery
spec:
  selector:
    matchLabels:
      app: auth-service  # Apply to auth service
  action: CUSTOM
  provider:
    name: rate-limiter-ext-authz
  rules:
  - to:
    - operation:
        paths: ["/api/*"]
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: istio-custom-bootstrap
  namespace: istio-system
data:
  custom_bootstrap.yaml: |
    static_resources:
      clusters:
      - name: rate_limiter_cluster
        type: STRICT_DNS
        connect_timeout: 1s
        lb_policy: ROUND_ROBIN
        load_assignment:
          cluster_name: rate_limiter_cluster
          endpoints:
          - lb_endpoints:
            - endpoint:
                address:
                  socket_address:
                    address: rate-limiter-service.food-delivery.svc.cluster.local
                    port_value: 3000
```

**Note**: This requires custom Envoy filter configuration. For simplicity, we recommend Pattern 2 or 3.

### Pattern 2: Application-Level Middleware (Recommended)

Integrate at application level in API Gateway or each service:

```typescript
// In API Gateway or service
import axios from 'axios';

const rateLimiterMiddleware = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const key = userId ? `user:${userId}` : `ip:${req.ip}`;
  
  try {
    const response = await axios.post(
      'http://rate-limiter-service.food-delivery.svc.cluster.local:3000/api/rate-limiter/check',
      { key, cost: 1 },
      { timeout: 2000 }
    );
    
    res.set('X-RateLimit-Remaining', response.headers['x-ratelimit-remaining']);
    next();
  } catch (error) {
    if (error.response?.status === 429) {
      res.set('Retry-After', error.response.headers['retry-after']);
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    // Fail-open on service error (optional, or fail-closed)
    console.error('Rate limiter unavailable:', error.message);
    next();
  }
};

app.use('/api/*', rateLimiterMiddleware);
```

### Pattern 3: Istio EnvoyFilter + Lua Script

Use Istio's EnvoyFilter to inject Lua script that calls rate limiter:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: rate-limiter-lua-filter
  namespace: food-delivery
spec:
  workloadSelector:
    labels:
      app: auth-service
  configPatches:
  - applyTo: HTTP_FILTER
    match:
      context: SIDECAR_INBOUND
      listener:
        filterChain:
          filter:
            name: "envoy.filters.network.http_connection_manager"
            subFilter:
              name: "envoy.filters.http.router"
    patch:
      operation: INSERT_BEFORE
      value:
        name: envoy.lua
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua
          inline_code: |
            function envoy_on_request(request_handle)
              local user_id = request_handle:headers():get("x-user-id")
              local key = "user:" .. (user_id or request_handle:connection():remoteAddress())
              
              local headers, body = request_handle:httpCall(
                "rate_limiter_cluster",
                {
                  [":method"] = "POST",
                  [":path"] = "/api/rate-limiter/check",
                  [":authority"] = "rate-limiter-service",
                  ["content-type"] = "application/json"
                },
                string.format('{"key": "%s", "cost": 1}', key),
                2000
              )
              
              if headers[":status"] == "429" then
                request_handle:respond(
                  {[":status"] = "429"},
                  "Rate limit exceeded"
                )
              end
            end
```

## Service Mesh Benefits for Rate Limiter

### 1. Automatic mTLS
All service-to-service communication is encrypted:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: food-delivery
spec:
  mtls:
    mode: STRICT  # Enforce mTLS
```

### 2. Authorization Policies
Control who can call the rate limiter:

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: rate-limiter-authz
  namespace: food-delivery
spec:
  selector:
    matchLabels:
      app: rate-limiter-service
  rules:
  - from:
    - source:
        principals:
        - "cluster.local/ns/food-delivery/sa/api-gateway"
        - "cluster.local/ns/food-delivery/sa/auth-service"
        - "cluster.local/ns/food-delivery/sa/order-service"
    to:
    - operation:
        methods: ["POST"]
        paths: ["/api/rate-limiter/check"]
```

### 3. Observability with Kiali

Visualize service dependencies and traffic flow:

```bash
istioctl dashboard kiali
```

### 4. Distributed Tracing with Jaeger

```bash
istioctl dashboard jaeger
```

Add trace propagation in rate limiter:

```typescript
import { trace, context, propagation } from '@opentelemetry/api';

app.use((req, res, next) => {
  // Extract trace context from incoming headers
  const carrier = propagation.extract(context.active(), req.headers);
  
  // Start span
  const span = trace.getTracer('rate-limiter').startSpan('check_rate_limit', {
    attributes: {
      'http.method': req.method,
      'http.url': req.url
    }
  });
  
  req.span = span;
  next();
});
```

### 5. Circuit Breaking

Automatic circuit breaking for Redis or database failures:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: redis-dr
  namespace: food-delivery
spec:
  host: redis-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
    outlierDetection:
      consecutiveErrors: 5
      interval: 10s
      baseEjectionTime: 30s
```

## Deployment Steps

```bash
# 1. Label namespace for Istio injection
kubectl label namespace food-delivery istio-injection=enabled

# 2. Deploy services
kubectl apply -f kubernetes/rate-limiter-service.yaml
kubectl apply -f kubernetes/redis-service.yaml

# 3. Apply Istio configurations
kubectl apply -f istio/virtual-service.yaml
kubectl apply -f istio/destination-rule.yaml
kubectl apply -f istio/gateway.yaml

# 4. Verify deployment
kubectl get pods -n food-delivery
kubectl get vs,dr,gw -n food-delivery

# 5. Test
kubectl exec -it <api-gateway-pod> -n food-delivery -- \
  curl -X POST http://rate-limiter-service:3000/api/rate-limiter/check \
  -H "Content-Type: application/json" \
  -d '{"key": "user:123", "cost": 1}'
```

## Monitoring with Istio

### Grafana Dashboards

```bash
istioctl dashboard grafana
```

Key dashboards:
- **Istio Service Dashboard**: Request rate, latency, error rate
- **Istio Mesh Dashboard**: Overall mesh health
- **Istio Performance Dashboard**: Resource usage

### Prometheus Metrics

```bash
istioctl dashboard prometheus
```

Query examples:
```promql
# Request rate to rate limiter
rate(istio_requests_total{destination_service="rate-limiter-service.food-delivery.svc.cluster.local"}[1m])

# 429 error rate
rate(istio_requests_total{destination_service="rate-limiter-service.food-delivery.svc.cluster.local",response_code="429"}[1m])

# p95 latency
histogram_quantile(0.95, rate(istio_request_duration_milliseconds_bucket{destination_service="rate-limiter-service.food-delivery.svc.cluster.local"}[1m]))
```

## Best Practices

1. **Use ReadinessProbe**: Ensure `/ready` endpoint checks Redis/DB connectivity
2. **Set Timeouts**: Configure aggressive timeouts (1-2s) to fail fast
3. **Circuit Breaking**: Enable outlier detection to isolate failing pods
4. **Resource Limits**: Set appropriate CPU/memory limits
5. **Horizontal Scaling**: Use HPA to scale based on request rate
6. **Monitoring**: Set up alerts for high error rate or latency
7. **mTLS**: Enable strict mTLS for security
8. **Rate Limiting Rules**: Store in ConfigMap for easy updates without redeployment

## Troubleshooting

### Check Istio Sidecar Injection
```bash
kubectl get pods -n food-delivery -o jsonpath='{.items[*].spec.containers[*].name}'
# Should see: rate-limiter-service, istio-proxy
```

### View Envoy Configuration
```bash
istioctl proxy-config cluster <pod-name> -n food-delivery
istioctl proxy-config route <pod-name> -n food-delivery
```

### Debug with Envoy Admin
```bash
kubectl port-forward <pod-name> -n food-delivery 15000:15000
# Visit http://localhost:15000
```

### Check mTLS Status
```bash
istioctl authn tls-check <pod-name> -n food-delivery
```
