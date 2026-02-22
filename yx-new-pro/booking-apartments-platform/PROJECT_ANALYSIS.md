# Project Analysis: booking-apartments-platform

> Generated: 2026-02-17

---

## 1. Overview

`booking-apartments-platform` is a **production-grade, single-service Spring Boot 3.x / Java 21** application that implements a concurrency-safe apartment booking system. It is designed as a reference implementation showcasing several key distributed-systems patterns:

- **Hard double-booking prevention** via PostgreSQL GiST exclusion constraints
- **Transactional Outbox** for reliable Kafka event publishing
- **Redis-backed rate limiting** and idempotency
- **JWT (RS256) authentication** with rotating refresh tokens and full token revocation
- **Read-side caching** for the hot availability-search path

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5.10 |
| Build | Gradle (Kotlin-style version catalog) |
| Database | PostgreSQL 17 (via JPA / Hibernate + Flyway migrations) |
| Cache / State | Redis 7 |
| Messaging | Apache Kafka 4.1 (KRaft mode, no ZooKeeper) |
| Security | Spring Security + OAuth2 Resource Server (RS256 JWT) |
| Observability | Micrometer + Spring Actuator (health, metrics, Prometheus) |
| Testing | JUnit 5 + Testcontainers (Postgres, Redis, Kafka) + Awaitility |
| Containerization | Docker Compose (local dev) |

---

## 3. Project Structure

```
booking-apartments-platform/
├── src/
│   ├── main/
│   │   ├── java/com/xrs/booking/
│   │   │   ├── BookingApartmentsApplication.java   # Entry point
│   │   │   ├── api/                                # REST controllers + DTOs + exception handler
│   │   │   ├── auth/                               # Auth sub-module (API, domain, repo, service, security)
│   │   │   ├── config/                             # App-wide config (Cache, Kafka topics, CorrelationId filter)
│   │   │   ├── domain/                             # Core domain entities (Apartment, Booking, BookingStatus)
│   │   │   ├── kafka/                              # Kafka consumer (BookingEventsConsumer)
│   │   │   ├── outbox/                             # Transactional Outbox (OutboxMessage, OutboxPublisher, OutboxRepository)
│   │   │   ├── ratelimit/                          # Rate limiting filter + config
│   │   │   ├── repo/                               # JPA repositories (ApartmentRepository, BookingRepository)
│   │   │   ├── security/                           # AuthenticatedUser, SecurityUtils
│   │   │   └── service/                            # Application services (BookingService, AvailabilityService, etc.)
│   │   └── resources/
│   │       ├── application.yml                     # Main configuration
│   │       ├── application-test.yml                # Test overrides
│   │       └── db/migration/                       # Flyway SQL migrations (V1–V6)
│   └── test/
│       └── java/com/xrs/booking/
│           ├── AbstractIntegrationTest.java
│           ├── AvailabilityCachingIT.java
│           ├── AvailabilitySearchIT.java
│           ├── BookingConcurrencyIT.java
│           ├── IdempotencyIT.java
│           ├── OutboxPublishingIT.java
│           ├── RateLimitingIT.java
│           └── TestAuth.java
├── postman/                                        # Postman collection + environment
├── docker-compose.yml                              # Local infra (Postgres, Redis, Kafka)
├── build.gradle                                    # Gradle build
└── gradle/                                         # Gradle wrapper + version catalog
```

---

## 4. Domain Model

### 4.1 Entities

#### `Apartment`
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | String (200) | Apartment name |
| `city` | String (120) | City (indexed lower-case) |
| `capacity` | int | Number of guests |
| `createdAt` | Instant | Creation timestamp |

#### `Booking`
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `apartmentId` | UUID | FK → apartments |
| `userId` | UUID | Owner (authenticated user) |
| `startDate` | LocalDate | Check-in (inclusive) |
| `endDate` | LocalDate | Check-out (exclusive) |
| `status` | `BookingStatus` | HOLD / CONFIRMED / CANCELLED / EXPIRED |
| `expiresAt` | Instant | Non-null only for HOLD status |
| `createdAt` | Instant | |
| `updatedAt` | Instant | |

**Date semantics**: `[startDate, endDate)` — booking `[Feb 01, Feb 05)` and `[Feb 05, Feb 07)` do **not** overlap.

#### `BookingStatus` (enum)
`HOLD` → `CONFIRMED` | `CANCELLED` | `EXPIRED`

### 4.2 Auth Entities
- **`UserAccount`** — email, bcrypt password hash, enabled flag, email-verified flag, roles
- **`Role`** — `USER` or `ADMIN`
- **`RefreshTokenFamily`** — groups refresh tokens per device session
- **`RefreshToken`** — rotating, stored as SHA-256 hash
- **`EmailVerificationToken`** — one-time token, hashed

---

## 5. Key Architectural Patterns

### 5.1 Concurrency-Safe Double-Booking Prevention

The core correctness guarantee is enforced at the **database level**, not in application code:

```sql
-- V1__init.sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Generated column: daterange('[)') makes endDate exclusive
stay daterange GENERATED ALWAYS AS (daterange(start_date, end_date, '[)')) STORED

-- GiST exclusion constraint: concurrent overlapping inserts fail with SQLSTATE 23P01
ALTER TABLE bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    apartment_id WITH =,
    stay WITH &&
  )
  WHERE (status <> 'CANCELLED' AND status <> 'EXPIRED');
```

When two concurrent requests try to hold overlapping dates, only one INSERT succeeds. The other receives a `DataIntegrityViolationException` with SQLSTATE `23P01`, which `BookingService` maps to **HTTP 409 Conflict**.

### 5.2 Transactional Outbox Pattern

Kafka events are **never published inside a DB transaction**. Instead:

1. The business write (booking insert/update) and an outbox row are saved **atomically** in the same DB transaction.
2. A scheduled `OutboxPublisher` polls `outbox` rows where `published_at IS NULL` every 500ms (configurable).
3. It publishes each message to the appropriate Kafka topic (keyed by `aggregateId` for ordering), then marks the row as published.
4. On failure, the publisher stops the batch to preserve ordering and retries on the next poll cycle.

**Kafka topics:**
- `booking-events` — booking lifecycle events (BookingHeld, BookingConfirmed, BookingCancelled, BookingHoldsExpired)
- `auth-events` — email verification events

### 5.3 Redis-Backed Idempotency

`POST /api/bookings/hold` accepts an optional `Idempotency-Key` header. The key is scoped per user (`idemp:hold:{userId}:{key}`) to prevent cross-user collisions.

Flow:
1. If the key is new → `SET NX` with `IN_PROGRESS` (30s TTL) to claim it.
2. If `IN_PROGRESS` → return 409 (concurrent duplicate request).
3. If key maps to a UUID → return the original booking (idempotent replay).
4. After successful save → overwrite with the booking UUID (24h TTL).
5. On failure → release the `IN_PROGRESS` lock.

### 5.4 Redis Rate Limiting

A `RateLimitingFilter` (servlet filter) applies per-client rate limiting using Redis `INCR` + `EXPIRE`:

- **Client identity**: JWT subject (`u:{userId}`) > `X-Client-Id` header > remote IP
- **Default**: 200 requests / 60-second sliding window for all `/api/**` paths
- **Response**: HTTP 429 with `Retry-After` header
- Actuator endpoints (`/actuator/**`) are exempt

Configuration:
```yaml
app:
  rate-limit:
    enabled: true
    max-requests: 200
    window-seconds: 60
    path-prefixes: ["/api"]
```

### 5.5 Availability Search with Redis Caching

`GET /api/availability/search` is the hottest read path. It is:
- Backed by an efficient `NOT EXISTS` overlap query with a GiST index on `(lower(city), capacity)`
- Cached in Redis for a short TTL (30s) using Spring Cache (`@Cacheable`)
- Cache is invalidated (via Spring `ApplicationEvent`) after any booking write (hold/confirm/cancel/expiry)

---

## 6. Authentication & Security

### 6.1 JWT (RS256) Access Tokens
- Issued by `JwtService` using RSA private key (`classpath:keys/jwt-private.pem`)
- Validated by Spring Security OAuth2 Resource Server using RSA public key
- Claims: `sub` (userId UUID), `email`, `roles` (list), `jti` (JWT ID for revocation)
- TTL: 15 minutes (configurable)

### 6.2 Rotating Refresh Tokens
- Multi-device: each device gets its own `RefreshTokenFamily`
- Tokens stored as SHA-256 hashes in `refresh_tokens` table
- On refresh: old token is revoked, new token issued (rotation)
- TTL: 30 days (configurable)

### 6.3 Token Revocation
- **Single logout**: JTI blacklisted in Redis until access token expiry
- **Logout-all**: per-user `valid_after` timestamp stored in Redis; all tokens issued before it are rejected
- `RevokedTokenFilter` runs after `BearerTokenAuthenticationFilter` to enforce revocation

### 6.4 Account Lockout
- `LoginAttemptService` tracks failed login attempts per email in Redis
- Default: 5 failures in 15 minutes → account locked for 15 minutes

### 6.5 Authorization Rules
| Endpoint | Required Role |
|---|---|
| `POST /api/apartments/**` | ADMIN |
| `PUT/PATCH/DELETE /api/apartments/**` | ADMIN |
| `GET /api/apartments/**` | Public |
| `GET /api/availability/**` | Public |
| `/api/bookings/**` | Authenticated (owner-or-admin for individual booking access) |
| `/api/auth/**` | Public |
| `/actuator/**` | Public |

### 6.6 Email Verification
- On registration, a verification token is issued and published via Outbox to `auth-events`
- Token stored as SHA-256 hash with 24h TTL
- `GET /api/auth/verify?token=...` marks user as verified

---

## 7. REST API

### Booking Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/apartments` | ADMIN | Create apartment |
| `GET` | `/api/apartments/{id}` | Public | Get apartment |
| `GET` | `/api/apartments/{id}/availability` | Public | Check availability for date range |
| `GET` | `/api/availability/search` | Public | Search available apartments (city, capacity, dates, paged) |
| `POST` | `/api/bookings/hold` | Authenticated | Create a 15-min hold (concurrency-safe, idempotent) |
| `POST` | `/api/bookings/{id}/confirm` | Owner/Admin | Confirm a hold |
| `POST` | `/api/bookings/{id}/cancel` | Owner/Admin | Cancel a booking |
| `GET` | `/api/bookings/{id}` | Owner/Admin | Get booking details |

### Auth Endpoints
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register (unverified) |
| `GET` | `/api/auth/verify?token=...` | Verify email |
| `POST` | `/api/auth/login` | Login → access + refresh tokens |
| `POST` | `/api/auth/refresh` | Rotate refresh token |
| `POST` | `/api/auth/logout` | Logout current session |
| `POST` | `/api/auth/logout-all` | Logout all sessions |
| `GET` | `/api/auth/sessions` | List active sessions |
| `POST` | `/api/auth/sessions/{id}/revoke` | Revoke a specific session |

---

## 8. Database Migrations (Flyway)

| Version | Description |
|---|---|
| V1 | Core schema: `apartments`, `bookings` (with GiST exclusion), `outbox` |
| V2 | Availability indexes: `lower(city)`, `capacity` |
| V3 | Auth schema: `users`, `roles`, `user_roles`, `refresh_token_families`, `refresh_tokens`, `email_verification_tokens`; adds `topic` column to `outbox` |
| V4 | Seed data: admin + 2 user accounts, roles |
| V5 | Migrate `bookings.user_id` from `varchar` to `uuid` |
| V6 | Fix token hash columns to `varchar` (was `char(64)`) |

---

## 9. Configuration Reference

```yaml
# application.yml key settings
server:
  port: 8080
  shutdown: graceful

spring:
  datasource:
    hikari:
      maximum-pool-size: 20       # DB_POOL_MAX
      minimum-idle: 5             # DB_POOL_MIN_IDLE
      connection-timeout: 2000ms  # DB_POOL_CONN_TIMEOUT_MS

booking:
  holds:
    default-minutes: 15           # Hold expiry duration
  outbox:
    poll:
      fixed-delay-ms: 500         # Outbox polling interval
      batch-size: 100             # Messages per poll cycle
  idempotency:
    ttl-hours: 24                 # Idempotency key TTL in Redis

app:
  rate-limit:
    enabled: true
    max-requests: 200
    window-seconds: 60
    path-prefixes: ["/api"]

auth:
  access-token-ttl-minutes: 15
  refresh-token-ttl-days: 30
  verification-token-ttl-hours: 24
  lockout-max-failures: 5
  lockout-window-seconds: 900
  lockout-duration-seconds: 900
```

---

## 10. Infrastructure (Docker Compose)

| Service | Image | Port (host:container) |
|---|---|---|
| PostgreSQL | `postgres:17.7-alpine` | `5456:5432` |
| Redis | `redis:7` | `6385:6379` |
| Kafka | `apache/kafka:4.1.1` (KRaft) | `9099:9099` (external) |

Kafka runs in **KRaft mode** (no ZooKeeper), with 6 partitions and auto-topic creation enabled.

---

## 11. Testing Strategy

All integration tests extend `AbstractIntegrationTest` which spins up real infrastructure via **Testcontainers**:

| Test Class | What it covers |
|---|---|
| `BookingConcurrencyIT` | Concurrent hold requests → only one succeeds (exclusion constraint) |
| `IdempotencyIT` | Same `Idempotency-Key` returns original booking on replay |
| `OutboxPublishingIT` | Outbox rows are published to Kafka and marked as published |
| `AvailabilitySearchIT` | Search returns correct apartments for given city/capacity/dates |
| `AvailabilityCachingIT` | Redis cache is populated and invalidated on booking changes |
| `RateLimitingIT` | Requests exceeding limit receive HTTP 429 |
| `TestAuth` | Auth helper utilities for integration tests |

Run all tests:
```bash
./gradlew test
```

---

## 12. Running Locally

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Run the application
./gradlew bootRun

# App:      http://localhost:8080
# Actuator: http://localhost:8080/actuator
```

**Seeded accounts** (from Flyway V4):
| Email | Password | Role |
|---|---|---|
| `admin@local.test` | `AdminPassword123!` | ADMIN |
| `user1@local.test` | `UserPassword123!` | USER |
| `user2@local.test` | `UserPassword123!` | USER |

Import the Postman collection from `postman/BookingApartments.postman_collection.json` with the `postman/BookingApartments.local.postman_environment.json` environment for a ready-to-use API client.

---

## 13. Design Highlights & Production Considerations

| Concern | Approach |
|---|---|
| **Double-booking** | PostgreSQL GiST exclusion constraint — DB-level, not app-level locks |
| **Short transactions** | Write path = 1 booking insert + 1 outbox insert; no remote calls inside TX |
| **p95/p99 latency** | HikariCP tuned, Redis caching on hot read path, rate limiting to shed load |
| **Event reliability** | Transactional Outbox — no lost events even if Kafka is temporarily unavailable |
| **Idempotency** | Redis-backed per-user key with `SET NX` locking to handle concurrent duplicates |
| **Security** | RS256 JWT, rotating refresh tokens, JTI revocation, account lockout, bcrypt(12) |
| **Observability** | Correlation ID propagated via MDC + response header; Micrometer metrics exposed |
| **Graceful shutdown** | `server.shutdown: graceful` — in-flight requests complete before shutdown |
| **Schema management** | Flyway with `ddl-auto: validate` — no surprise schema changes at runtime |
