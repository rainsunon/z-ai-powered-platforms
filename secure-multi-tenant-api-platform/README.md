# Secure Multi-tenant API Platform (Tenant Isolation)

Production-grade reference implementation for strict tenant isolation.

## GitHub repository

- **Repo name:** `secure-multi-tenant-api-platform`
- **Description:** Spring Boot 3.5 (Java 21) API platform enforcing tenant isolation with JWT `tenantId` claim, PostgreSQL Row-Level Security (RLS) to eliminate “missing tenant filter” mistakes, and tenant-aware Redis cache keys.

## Key design decisions (why this prevents cross-tenant leaks)

1. **Tenant context from JWT**
   - Every `/api/**` request requires a Bearer JWT.
   - The token must contain a `tenantId` claim.

2. **Database-enforced isolation with PostgreSQL RLS**
   - Tables include `tenant_id`.
   - Row Level Security policies filter by `current_setting('app.tenant_id')::uuid`.
   - The app sets the setting once per JDBC transaction via a tenant-aware DataSource wrapper
     (runs `select set_config('app.tenant_id', '<tenantUuid>', true)` when Spring begins the transaction).
   - If a developer forgets to add a `WHERE tenant_id = ?`, **PostgreSQL still blocks cross-tenant reads/updates**.

3. **Tenant-aware caching keys**
   - Redis cache keys are constructed as: `tenant:{tenantId}:user:{userId}`.

## Tech stack

- Java 21
- Spring Boot 3.5.10
- PostgreSQL + Flyway
- Redis (Spring Cache)
- Kafka (KRaft-compatible; events contain tenant header)
- Gradle (no `io.spring.dependency-management` plugin)

## Running locally

### 1) Start infrastructure

```bash
cd docker
docker compose up -d
```

Services:
- Postgres: `localhost:5432` (db/user/pass: `tenantdb`/`tenant`/`tenant`)
- Redis: `localhost:6379`
- Kafka (KRaft): `localhost:9092`

### 2) Run the app

You need a local Gradle installation (Gradle 8.10+ recommended):

```bash
gradle test
gradle bootRun
```

App starts on `http://localhost:8080`.

### 3) Use Postman

Import:
- `postman/collection.json`
- `postman/environment.local.json`

The environment contains two sample tenants and matching JWTs (RS256/JWKS) aligned with `app.security.jwt.jwks.keys` in `application.yml` (public RSA keys).

## API

- `POST /api/users` – create user (current tenant)
- `GET /api/users/{id}` – read user (current tenant)
- `GET /api/users` – list users (current tenant)
- `DELETE /api/users/{id}` – delete user (current tenant)

### Observability

Every response includes `X-Correlation-Id` (echoed from the request or generated). The same value is
added to RFC7807 ProblemDetail responses as `correlationId`.

## Tests (tenant isolation proof)

Integration tests use Testcontainers for PostgreSQL and Redis, and Embedded Kafka.

- `TenantIsolationIT`
  - Creates a user in Tenant A.
  - Verifies Tenant B cannot read it (404 due to RLS).
  - Verifies list is isolated.
  - Verifies Redis key format: `tenant:{tenantId}:user:{userId}`.

- `MissingTenantClaimIT`
  - Verifies a JWT without `tenantId` is rejected with an RFC7807 Problem Detail (400).

## Notes for production hardening

- Use JWKS / asymmetric JWT keys with rotation (instead of RS256/JWKS JWKS key set (RSA public keys)).
- Add database migrations for all tenant-scoped tables with RLS enabled + `FORCE ROW LEVEL SECURITY`.
- Consider adding an automated Flyway verification test that asserts RLS is enabled on all tenant tables.
