# Adaptive Rate Limiter + Bot Defense (Redis + Kafka)

Production-grade reference implementation for protecting **login** and **public APIs** from bot traffic.

## What it does

- **Base limits per IP, user, tenant** implemented as Redis **token buckets** (atomic Lua script).
- **Risk scoring** based on conservative signals (request rate, UA, repeated login failures).
- **Adaptive tightening**: medium/high risk decreases effective capacity/refill to slow down bots.
- **Step-up trigger**: on very high risk login attempts, request is blocked and a **Kafka event** is published (e.g. CAPTCHA required).
- **Forensics**: denials/step-up actions persisted to Postgres via Flyway-migrated table.
- **Observability**: Micrometer counters + structured JSON logs with correlation id.

## Tech

- Java 21, Spring Boot 3.5.10
- Redis 7 (limits + signals)
- Kafka (KRaft) for bot-defense events
- PostgreSQL + Flyway for denial records
- Tests: Spring Boot Test + Testcontainers (Kafka + Redis)

## Run locally

```bash
# start Postgres + Redis + Kafka (KRaft)
docker compose up -d

# run the app (from IDE) or:
./gradlew bootRun
```

App defaults:
- `http://localhost:8080`
- Postgres: `jdbc:postgresql://localhost:5432/botdefense`
- Redis: `localhost:6379`
- Kafka: `localhost:9092`

> Note: The repository uses Gradle. If you don’t have Gradle installed, add a Gradle wrapper (`gradle wrapper`) from a local Gradle installation.

## Testing

This project deliberately avoids embedded/in-memory substitutes for infrastructure components.
Integration tests use **Testcontainers** to run real **Kafka** and **Redis**.

Requirements:
* Docker (Docker Desktop on Windows/macOS or Docker Engine on Linux)

Run:
```bash
./gradlew test
```

## Endpoints

### Public API (protected)
- `GET /api/public/ping`
- `POST /api/public/echo`

Example:
```bash
curl -i -H "X-Tenant-Id: t1" -H "X-User-Id: u1" http://localhost:8080/api/public/ping
```

### Login (protected)
- `POST /api/auth/login`

Demo rule: password must equal `password`.

```bash
curl -i \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: t1" \
  -d '{"username":"alice","password":"wrong"}' \
  http://localhost:8080/api/auth/login
```

After repeated failures, the risk score increases and the service will respond with:
- `403` + `X-Step-Up-Required: true`
- `X-Step-Up-Action: CAPTCHA_REQUIRED`
- Kafka event published to topic `bot-defense-actions` (configurable)

### Denials / audit
- `GET /api/admin/rate-limit-denials`

## Configuration

See `application.yml`:

- `botdefense.limits.*` base bucket settings
- `botdefense.risk.*` thresholds and factors
- `botdefense.routeGroups` protected endpoints grouped into profiles
- `botdefense.allowlist.ipCidrs` CIDRs exempt from enforcement

## Design notes

- **Fail-open** on Redis/script errors to avoid blocking legitimate users on infrastructure issues.
- **Low false positives** by using conservative weights and only using step-up on extreme risk for login.
- Token buckets are applied as **AND** across dimensions (IP, user, tenant), which is robust against distributed bots.

## Postman

Import the collection from `postman/bot-defense.postman_collection.json`.
