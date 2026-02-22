# Adaptive Rate Limiter + Bot Defense - Project Analysis

## Executive Summary

The **adaptive-rate-limiter-bot-defense** is a production-grade Spring Boot microservice designed to protect login endpoints and public APIs from bot attacks and abuse. It implements a sophisticated multi-layered defense system combining rate limiting, risk scoring, adaptive throttling, and step-up authentication triggers.

**Key Characteristics:**
- Fail-open design to prevent blocking legitimate users during infrastructure issues
- Low false positive rate through conservative risk scoring
- Multi-dimensional rate limiting (IP, user, tenant) using Redis token buckets
- Event-driven architecture with Kafka for step-up actions
- Comprehensive observability with metrics and structured logging

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HTTP Request Flow                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   CorrelationIdFilter         │
                    │   (Adds correlation ID)       │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   AdaptiveRateLimitFilter     │
                    │   - Route Group Matcher       │
                    │   - IP Allowlist Check        │
                    │   - ProxyAwareIpResolver      │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   AdaptiveRateLimiterService  │
                    │   - RiskScoringService        │
                    │   - TokenBucketRedisClient    │
                    │   - BotDefenseEventPublisher  │
                    └───────────────┬───────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
           ┌─────────┐        ┌─────────┐        ┌─────────┐
           │  ALLOW  │        │  LIMIT  │        │ STEP-UP │
           └────┬────┘        └────┬────┘        └────┬────┘
                │                  │                   │
                │                  │                   ▼
                │                  │          ┌────────────────┐
                │                  │          │  Kafka Topic   │
                │                  │          │  bot-defense   │
                │                  │          │  -actions      │
                │                  │          └────────┬───────┘
                │                  │                   │
                │                  │                   ▼
                │                  │          ┌────────────────┐
                │                  │          │ StepUp Event   │
                │                  │          │ Listener       │
                │                  │          │ - Dedupe       │
                │                  │          │ - CAPTCHA      │
                │                  │          │   Provider     │
                │                  │          └────────┬───────┘
                │                  │                   │
                │                  │                   ▼
                │                  │          ┌────────────────┐
                │                  │          │ Security Action│
                │                  │          │ Request Topic  │
                │                  │          └────────────────┘
                │                  │
                ▼                  ▼
           ┌─────────┐        ┌─────────┐
           │  200    │        │  429    │
           │  OK     │        │  Too    │
           │         │        │  Many   │
           └─────────┘        └─────────┘
```

---

## Core Components

### 1. Request Processing Pipeline

#### [`CorrelationIdFilter`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/web/CorrelationIdFilter.java)
- Adds correlation ID to MDC for traceability across the request lifecycle
- Enables distributed tracing and log correlation

#### [`AdaptiveRateLimitFilter`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/web/AdaptiveRateLimitFilter.java)
- **Main enforcement filter** for HTTP requests
- Matches requests to route groups (login, public APIs)
- Checks IP allowlist for exemptions
- Resolves client IP with proxy awareness
- Delegates to [`AdaptiveRateLimiterService`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/service/AdaptiveRateLimiterService.java) for decision making
- Returns appropriate HTTP responses:
  - `200 OK` - Request allowed
  - `403 Forbidden` - Step-up required (CAPTCHA)
  - `429 Too Many Requests` - Rate limited

#### [`ProxyAwareIpResolver`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/net/ProxyAwareIpResolver.java)
- Extracts real client IP from proxy headers
- Supports multiple header formats:
  - RFC 7239 `Forwarded` header
  - `X-Forwarded-For` chain (peels trusted proxies)
  - `X-Real-IP`
- Uses configurable trusted proxy CIDR blocks

#### [`IpAllowlist`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/web/IpAllowlist.java)
- IP allowlist for exempting trusted sources
- CIDR-based matching for flexible network ranges

---

### 2. Rate Limiting Engine

#### [`AdaptiveRateLimiterService`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/service/AdaptiveRateLimiterService.java)
**Central enforcement logic** that orchestrates:
- Risk scoring
- Three token buckets (IP, user, tenant)
- Step-up triggers for high-risk login attempts
- Decision persistence

**Key Features:**
- Fail-open design: allows requests if Redis is unavailable
- Multi-dimensional rate limiting (AND logic across buckets)
- Adaptive capacity/refill based on risk tier
- Metrics tracking via Micrometer

#### [`TokenBucketRedisClient`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/redis/TokenBucketRedisClient.java)
- Redis-backed token bucket implementation
- Uses atomic Lua script for thread-safe operations
- Returns: `allowed`, `remainingTokens`, `retryAfterMillis`
- Fail-open behavior on Redis errors

**Lua Script** ([`token_bucket.lua`](adaptive-rate-limiter-bot-defense/src/main/resources/redis/token_bucket.lua)):
- Calculates token refill based on elapsed time
- Enforces capacity limits
- Computes retry-after time for rate-limited requests
- Auto-expires idle buckets (1 hour TTL)

---

### 3. Risk Assessment

#### [`RiskScoringService`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/risk/RiskScoringService.java)
**Simple, explainable risk scoring** with conservative weights:

**Risk Signals:**
1. **Request Rate** (coarse signal):
   - >300 RPM: +70 points
   - >100 RPM: +30 points

2. **User Agent Analysis**:
   - Missing/blank UA: +15 points
   - Scripted UA (curl, python-requests, httpclient, bot): +20 points

3. **Login Failures** (for login route only):
   - >10 failures: +80 points
   - >3 failures: +40 points

**Risk Tiers:**
- **NORMAL** (0-29): Full capacity
- **MEDIUM** (30-59): 50% capacity/refill
- **HIGH** (60+): 20% capacity/refill

#### [`RiskSignalStore`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/risk/RiskSignalStore.java)
- Stores and aggregates risk signals in Redis
- Lightweight counters with TTLs
- Tracks:
  - Login failures per tenant/user/IP
  - Per-IP request rates

---

### 4. Event-Driven Step-Up Actions

#### [`BotDefenseEventPublisher`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/kafka/BotDefenseEventPublisher.java)
- Publishes step-up events to Kafka
- Keyed by IP for ordering
- Events include: correlation ID, route group, tenant/user IDs, IP, risk score, action, reason

#### [`StepUpEventListener`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/consumer/StepUpEventListener.java)
**Kafka consumer pipeline:**
1. **Deduplication**: Uses Redis SETNX with TTL to prevent duplicate processing
2. **CAPTCHA Trigger**: Calls external CAPTCHA provider with retry/backoff
3. **Success**: Publishes security action request to another topic
4. **Failure**: Publishes to DLQ for manual inspection

#### [`CaptchaProviderClient`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/consumer/CaptchaProviderClient.java)
- HTTP client for CAPTCHA provider
- Uses Resilience4j for:
  - Retry (max 4 attempts, 200ms backoff)
  - Timeout (configurable, default 2s)
- Fail-fast on persistent failures

---

### 5. Configuration

#### [`BotDefenseProperties`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/config/BotDefenseProperties.java)
**Comprehensive configuration structure:**

```yaml
botdefense:
  allowlist:
    ipCidrs: ["127.0.0.1/32"]  # Exempted IPs
  
  routeGroups:  # Protected endpoint groups
    - name: login
      paths: ["/api/auth/login"]
      methods: ["POST"]
    - name: public
      paths: ["/api/public/**"]
      methods: ["GET", "POST"]
  
  limits:  # Base token bucket settings
    ip:
      capacity: 60
      refillPerSecond: 1.0
    user:
      capacity: 30
      refillPerSecond: 0.5
    tenant:
      capacity: 300
      refillPerSecond: 5.0
  
  risk:  # Risk thresholds and factors
    tightenMediumAt: 30
    tightenHighAt: 60
    stepUpAt: 80
    factors:
      medium: 0.5
      high: 0.2
  
  signals:  # Signal windows
    loginFailureWindowSeconds: 600
    requestRateWindowSeconds: 60
  
  consumer:  # Kafka consumer settings
    inputTopic: captcha-stepup-events
    securityActionTopic: security-action-requests
    dlqTopic: captcha-stepup-dlq
    captchaProviderBaseUrl: http://localhost:8082
    captchaRequestTimeoutMs: 2000
    dedupeTtlSeconds: 86400
```

---

### 6. Data Persistence

#### [`RateLimitDecisionEntity`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/persistence/RateLimitDecisionEntity.java)
- JPA entity for persisting rate limit decisions
- Stores: tenant ID, user ID, IP, route group, method, path, risk score, risk tier, decision details, correlation ID
- Only denials and step-up actions are persisted (optimization)

#### Database Schema ([`V1__create_rate_limit_decisions.sql`](adaptive-rate-limiter-bot-defense/src/main/resources/db/migration/V1__create_rate_limit_decisions.sql))
```sql
CREATE TABLE rate_limit_decisions (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    tenant_id VARCHAR(255),
    user_id VARCHAR(255),
    ip VARCHAR(255) NOT NULL,
    route_group VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    path VARCHAR(1000) NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_tier VARCHAR(20) NOT NULL,
    allowed BOOLEAN NOT NULL,
    remaining_tokens INTEGER NOT NULL,
    retry_after_millis BIGINT,
    step_up_required BOOLEAN NOT NULL,
    step_up_action VARCHAR(255),
    reason VARCHAR(255),
    correlation_id VARCHAR(255)
);
```

---

### 7. API Endpoints

#### [`AuthController`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/api/AuthController.java)
**Demo login endpoint** for testing bot defense:
- `POST /api/auth/login`
- Demo rule: password must equal "password"
- Records login failures on authentication failure
- Clears failures on successful login

#### [`PublicApiController`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/api/PublicApiController.java)
**Public API endpoints** for testing:
- `GET /api/public/ping`
- `POST /api/public/echo`

#### [`AuditController`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/api/AuditController.java)
**Admin endpoint** for forensics:
- `GET /api/admin/rate-limit-denials`
- Returns paginated list of rate limit denials and step-up actions

---

## Technology Stack

### Core Framework
- **Java 21** (optional toolchain, not enforced)
- **Spring Boot 3.5.10**
- **Spring Web** - REST API
- **Spring Data JPA** - Database access
- **Spring Data Redis** - Redis integration
- **Spring Kafka** - Event streaming
- **Spring Security** - Security framework
- **Spring Validation** - Input validation
- **Spring Actuator** - Health checks and metrics

### Infrastructure
- **Redis 7** - Token buckets and risk signals
- **Kafka 3.7 (KRaft mode)** - Event streaming
- **PostgreSQL 16** - Audit trail persistence
- **Flyway** - Database migrations

### Libraries
- **Lombok** - Reduce boilerplate
- **Resilience4j** - Retry and timeout policies
- **Logstash Logback Encoder** - Structured JSON logging
- **Micrometer** - Metrics collection
- **Testcontainers** - Integration testing with real containers

### Build Tools
- **Gradle 8.x** - Build automation
- **Gradle Wrapper** - Consistent builds across environments

---

## Design Patterns & Principles

### 1. Fail-Open Design
- Requests are allowed if Redis is unavailable
- Prevents blocking legitimate users during infrastructure issues
- Trade-off: Reduced protection during outages

### 2. Multi-Dimensional Rate Limiting
- Three independent token buckets: IP, user, tenant
- AND logic: request blocked if ANY bucket is exhausted
- Robust against distributed bot attacks

### 3. Adaptive Throttling
- Risk score determines effective capacity/refill rate
- High-risk traffic gets progressively throttled
- Gradual escalation (NORMAL → MEDIUM → HIGH)

### 4. Event-Driven Architecture
- Decouples rate limiting from step-up actions
- Asynchronous CAPTCHA triggering
- DLQ for failed events

### 5. Idempotency
- Redis-based event deduplication
- Prevents duplicate step-up triggers
- TTL-based cleanup

### 6. Observability
- Correlation ID tracing
- Micrometer metrics (decisions, CAPTCHA triggers)
- Structured JSON logging
- HTTP response headers (X-Risk-Score, X-Risk-Tier, X-RateLimit-Remaining)

---

## Configuration Guide

### Application Configuration ([`application.yml`](adaptive-rate-limiter-bot-defense/src/main/resources/application.yml))

#### Database
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/botdefense
    username: botdefense
    password: botdefense
```

#### Redis
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

#### Kafka
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
```

#### Bot Defense Settings
See the comprehensive configuration structure in the [`BotDefenseProperties`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/config/BotDefenseProperties.java) section above.

---

## Testing Strategy

### Integration Tests
- Uses **Testcontainers** for real Kafka and Redis instances
- No embedded/in-memory substitutes for infrastructure components
- Ensures production-like behavior

### Test Coverage
- [`AdaptiveRateLimiterIT`](adaptive-rate-limiter-bot-defense/src/test/java/com/xrs/gateway/botdefense/AdaptiveRateLimiterIT.java) - End-to-end rate limiting
- [`StepUpPipelineTest`](adaptive-rate-limiter-bot-defense/src/test/java/com/xrs/gateway/botdefense/consumer/StepUpPipelineTest.java) - Kafka event processing
- [`CidrBlockTest`](adaptive-rate-limiter-bot-defense/src/test/java/com/xrs/gateway/botdefense/net/CidrBlockTest.java) - CIDR matching
- [`ProxyAwareIpResolverTest`](adaptive-rate-limiter-bot-defense/src/test/java/com/xrs/gateway/botdefense/net/ProxyAwareIpResolverTest.java) - IP resolution

### Running Tests
```bash
./gradlew test
```

---

## Deployment

### Local Development
```bash
# Start infrastructure
docker compose up -d

# Run application
./gradlew bootRun
```

### Docker Compose Services
- **PostgreSQL 16** - Port 5432
- **Redis 7** - Port 6379
- **Kafka 3.7 (KRaft)** - Port 9092

### Application Ports
- **HTTP API**: 8080
- **Actuator**: 8080 (endpoints: `/actuator/health`, `/actuator/metrics`, `/actuator/prometheus`)

---

## Key Features Summary

| Feature | Description |
|---------|-------------|
| **Token Bucket Rate Limiting** | Atomic Redis Lua script for thread-safe token consumption |
| **Multi-Dimensional Limits** | IP, user, and tenant-level rate limits |
| **Adaptive Throttling** | Risk-based capacity adjustment (NORMAL/MEDIUM/HIGH) |
| **Risk Scoring** | Conservative signals (request rate, UA, login failures) |
| **Step-Up Actions** | CAPTCHA trigger for high-risk login attempts |
| **Event-Driven** | Kafka-based asynchronous step-up processing |
| **Fail-Open** | Allows requests if Redis is unavailable |
| **Proxy Awareness** | Extracts real client IP from proxy headers |
| **IP Allowlist** | CIDR-based exemption for trusted sources |
| **Audit Trail** | PostgreSQL persistence of denials and step-ups |
| **Observability** | Metrics, structured logs, correlation tracing |
| **Idempotency** | Redis-based event deduplication |
| **Resilience** | Retry, timeout, and DLQ for external services |

---

## Security Considerations

1. **Fail-Open Trade-off**: Reduced protection during Redis outages
2. **Conservative Risk Scoring**: Low false positives but may miss sophisticated bots
3. **CAPTCHA Provider**: External dependency for step-up actions
4. **IP Spoofing**: Proxy headers can be spoofed if not properly secured
5. **Rate Limit Bypass**: Distributed attacks across multiple IPs/users

---

## Future Enhancements

1. **Machine Learning**: Advanced bot detection using ML models
2. **Behavioral Analysis**: User behavior patterns and anomaly detection
3. **Dynamic Limits**: Automatic adjustment based on traffic patterns
4. **Multi-Region Deployment**: Global rate limiting with Redis Cluster
5. **Advanced CAPTCHA**: Integration with multiple CAPTCHA providers
6. **Webhook Notifications**: Real-time alerts for security events
7. **Dashboard**: Admin UI for monitoring and configuration
8. **API Rate Limit Plans**: Tenant-specific rate limit tiers

---

## References

- **Main Application**: [`BotDefenseApplication.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/BotDefenseApplication.java)
- **Core Service**: [`AdaptiveRateLimiterService.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/service/AdaptiveRateLimiterService.java)
- **Rate Limit Filter**: [`AdaptiveRateLimitFilter.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/web/AdaptiveRateLimitFilter.java)
- **Risk Scoring**: [`RiskScoringService.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/risk/RiskScoringService.java)
- **Token Bucket**: [`TokenBucketRedisClient.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/redis/TokenBucketRedisClient.java)
- **Configuration**: [`BotDefenseProperties.java`](adaptive-rate-limiter-bot-defense/src/main/java/com/xrs/gateway/botdefense/config/BotDefenseProperties.java)
- **Lua Script**: [`token_bucket.lua`](adaptive-rate-limiter-bot-defense/src/main/resources/redis/token_bucket.lua)
- **Build Configuration**: [`build.gradle`](adaptive-rate-limiter-bot-defense/build.gradle)
- **Application Config**: [`application.yml`](adaptive-rate-limiter-bot-defense/src/main/resources/application.yml)
- **Docker Compose**: [`docker-compose.yml`](adaptive-rate-limiter-bot-defense/docker-compose.yml)

---

**Document Version:** 1.0  
**Last Updated:** 2025-02-18  
**Project Version:** 0.1.0
