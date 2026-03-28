# Outbox Publisher Demo (PostgreSQL → Kafka)

**GitHub repository name:** `spring-boot-postgres-kafka-outbox-publisher`  
**Description:** Transactional Outbox implementation (DB → Kafka) for Spring Boot 3.5.9 / Java 21 with PostgreSQL + Flyway, cluster-safe publishing, retries/backoff, admin diagnostics, and Testcontainers integration tests.

## What this project implements

**Transactional Outbox pattern**:

1. API call writes **business data** (`orders`) **and** an **outbox row** (`outbox_messages`) in the **same DB transaction**.
2. A background publisher claims eligible outbox rows and publishes them to Kafka.
3. On success → marks row as `SENT`.
4. On failure → marks row as `RETRY` with exponential backoff (full jitter) and keeps it in DB.
5. Admin endpoint shows “stuck” rows.
6. Cluster-safe: multiple app instances can run the publisher concurrently without double-publishing the same DB row.

### Cluster safety (no double publishing)
Row claiming uses PostgreSQL:

- `SELECT ... FOR UPDATE SKIP LOCKED` inside a transaction
- followed by an `UPDATE ... RETURNING` that marks rows `LOCKED` with `locked_by` + `lock_until`

This ensures that **two instances cannot claim the same outbox row** at the same time.

> Note: This is **at-least-once** delivery. A crash **after** Kafka ack but **before** DB is updated to `SENT`
> can still lead to re-send. Consumers should de-duplicate using the `outboxId` header if needed.

## Tech stack

- Java 21
- Spring Boot 3.5.9
- PostgreSQL + Flyway
- Spring Data JPA (business table)
- Spring JDBC (outbox with `SKIP LOCKED`)
- Spring for Apache Kafka
- Tests: Spring Boot Test + Testcontainers (Postgres + Kafka)

## Run locally

### 1) Start PostgreSQL + Kafka

```bash
docker compose up -d
```

### 2) Start the application

Set (or keep defaults from `application.yml`):

- PostgreSQL: `jdbc:postgresql://localhost:5432/outbox_demo` user/pass `outbox/outbox`
- Kafka: `localhost:9092`

Run the app with Gradle in your environment:

```bash
./gradlew bootRun
```

## API endpoints

### Create Order
`POST /api/orders`

Body:
```json
{
  "customerEmail": "john.doe@example.com",
  "totalAmount": 123.45
}
```

### Get Order
`GET /api/orders/{id}`

### Admin: stuck outbox rows
`GET /api/admin/outbox/stuck`

Optional:
`GET /api/admin/outbox/stuck?olderThan=PT2M`

## Postman

Import:

- `postman/Outbox Publisher Demo.postman_collection.json`
- `postman/Outbox Publisher Demo - Local.postman_environment.json`

Then run **Create Order** and observe:

- `outbox_messages` row is created immediately
- publisher publishes to Kafka and marks it `SENT`
- if publishing fails, row becomes `RETRY` and stays in DB

## Tests

Integration tests use Testcontainers:

- PostgreSQL
- Kafka

Run:

```bash
./gradlew test
```

Key tests:

- `OrderOutboxIT`: business + outbox in one transaction, then publish to Kafka
- `MultiInstanceNoDuplicatePublishingIT`: two publishers concurrently, no duplicates
- `KafkaDownRecoveryIT`: simulated Kafka outage (publisher throws once), then recovery

## DB schema

Created by Flyway: `src/main/resources/db/migration/V1__init.sql`

Main tables:

- `orders`
- `outbox_messages`

Indexes support efficient scanning by `(status, available_at, created_at)` and stale-lock reaping.

## Production notes

If you use this in production, also consider:

- consumer-side de-duplication by `outboxId`
- better observability: metrics for backlog, retries, lag
- DLQ strategy for `DEAD` rows (manual replay / repair)
- schema versioning for event payloads

---

## 📜 License

MIT

---

## Contact

**Dimitry Ivaniuta** — [dzmitry.ivaniuta.services@gmail.com](mailto:dzmitry.ivaniuta.services@gmail.com) — [GitHub](https://github.com/DimitryIvaniuta)

