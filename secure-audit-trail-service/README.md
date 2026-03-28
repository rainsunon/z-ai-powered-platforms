# Secure Audit Trail Service (tamper-evident)

Immutable, append-only audit records for compliance, with **tamper detection** via a **hash chain** (HMAC-SHA256).

## Key ideas

- **Append-only** Postgres table (`audit_records`)
- **Immutability enforced** at DB layer (trigger rejects `UPDATE` / `DELETE`)
- **Tamper-evident chain** per tenant:
  - each record stores `prevHash`
  - `hash = HMAC(key, canonical(payload + prevHash))`
- **Auditor APIs**:
  - read/search records
  - verify chain integrity
  - export CSV (export is aborted if verification fails)

## Tech stack

- Java 21
- Spring Boot 3.5.10 (MVC)
- Postgres + Flyway
- Redis (Spring Cache) *(disabled in tests via `spring.cache.type=simple`)*
- Optional Kafka publishing of appended records (`audit.kafka.enabled=true`)

---

## Run locally

### 1) Start dependencies

```bash
docker compose up -d postgres redis
```

(Optional Kafka)

```bash
docker compose up -d kafka
```

### 2) Configure HMAC key

**Do not use defaults in production.**

`src/main/resources/application.yml` contains:

```yaml
audit:
  hmac:
    activeKeyId: key1
    keys:
      key1: "CHANGE_ME_IN_PROD"
```

Override via environment variables or external config (recommended).

### 3) Start app

```bash
./gradlew bootRun
# or: gradle bootRun (if you don't use wrapper)
```

App runs on: `http://localhost:8080`

---

## Auth

For demo simplicity this service uses **HTTP Basic**.

- Writer: `writer / writer-pass` (role `AUDIT_WRITER`) → can append
- Auditor: `auditor / auditor-pass` (role `AUDITOR`) → can read/verify/export

Change these in `application.yml` under `audit.security.*`.

---

## API

### Append (writer)

`POST /api/audit/records`

Body:

```json
{
  "tenantId": "tenant-demo",
  "actor": "user@example.com",
  "action": "ORDER_CREATED",
  "resourceType": "ORDER",
  "resourceId": "order-123",
  "correlationId": "corr-123",
  "data": { "amount": 10, "currency": "PLN" }
}
```

### Read (auditor)

`GET /api/audit/records/{id}`

### Search (auditor)

`GET /api/audit/records?tenantId=tenant-demo&page=0&size=50&actor=alice&action=ORDER_CREATED`

### Verify chain (auditor)

`GET /api/audit/verify?tenantId=tenant-demo&fromId=&toId=`

Returns `{ ok: true }` if all hashes match and `prevHash` links are consistent.

### Export CSV (auditor)

`GET /api/audit/export?tenantId=tenant-demo&fromId=&toId=`

- Streams a CSV
- Runs verification first; if verification fails, export is aborted and response includes a comment line with details.

---

## Postman

Import:

- `postman/Secure-Audit-Trail-Service.postman_collection.json`

---

## Tests

Integration tests use **Testcontainers** with Postgres:

```bash
./gradlew test
```

---

## Production hardening notes

- Store HMAC keys outside the DB (KMS/KeyVault/Secret Manager), and rotate keys via `keyId`.
- Consider exporting to WORM storage (S3 Object Lock, Azure Immutable Blob, etc.) for stronger compliance guarantees.
- Consider issuing a signed "checkpoint" periodically to an external system to further reduce risk of privileged DB tampering.
