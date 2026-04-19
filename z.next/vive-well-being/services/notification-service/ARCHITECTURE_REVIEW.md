# VIVE Notification Service — Principal Architecture Review

> **Reviewer:** Principal Architect  
> **Date:** 2026-04-12 (Post-Remediation Review #2)  
> **Scope:** Full codebase audit — `services/notification-service` + `packages/notificationDB`  
> **Stack:** Node.js · Hono · TypeScript · PostgreSQL · RabbitMQ · Redis · Drizzle ORM · Pino · Zod  
> **Verdict:** Significant progress from initial review. Core topology is sound. Several **critical** issues remain before production readiness.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Critical Issues — Must Fix Before Production](#3-critical-issues)
4. [High-Priority Issues](#4-high-priority-issues)
5. [Medium-Priority Issues](#5-medium-priority-issues)
6. [Low-Priority / Future Work](#6-low-priority--future-work)
7. [Security Assessment](#7-security-assessment)
8. [Reliability & Fault Tolerance](#8-reliability--fault-tolerance)
9. [Data Model Review](#9-data-model-review)
10. [Observability Assessment](#10-observability-assessment)
11. [Performance & Scalability](#11-performance--scalability)
12. [Operational Readiness Checklist](#12-operational-readiness-checklist)
13. [What Was Fixed Well](#13-what-was-fixed-well)
14. [Prioritized Action Plan](#14-prioritized-action-plan)

---

## 1. Executive Summary

The service follows a clean **producer/worker** separation with RabbitMQ as the message broker, Redis for rate limiting, and PostgreSQL via Drizzle ORM for persistence. Structured logging (pino), API key authentication, HTTP rate limiting, graceful shutdown, and a proper retry/DLQ topology are now in place.

Compared to the prior review, **11 issues have been resolved** including the retry TTL bug, partial delivery tracking, rate-limit loop cap, API auth, structured logging, and DB indexes. However, this deeper analysis identifies **4 critical**, **6 high**, and **8 medium** issues that must still be addressed — most notably **duplicate notifications on retry**, **consumer crash on malformed messages**, **no RabbitMQ connection recovery**, and an **API key timing attack**.

| # | Severity | Issue |
|---|----------|-------|
| C1 | CRITICAL | **Duplicate notifications on retry** — successful channels re-fire on partial failure retry |
| C2 | CRITICAL | **Malformed message crashes consumer** — `JSON.parse` outside try-catch; unacked message stalls prefetch |
| C3 | CRITICAL | **No RabbitMQ connection recovery** — dropped connection permanently disables the worker |
| C4 | CRITICAL | **API key timing attack** — string comparison leaks key length via timing side-channel |

---

## 2. Architecture Overview

```
                     ┌──────────────────────┐
  Clients ──────────▶│  Producer (Hono API) │
  POST /api/v1/events│  :3001               │
                     │  ┌─ CORS             │
                     │  ├─ API Key Auth     │
                     │  ├─ HTTP Rate Limit  │
                     │  └─ Zod Validation   │
                     └──────────┬───────────┘
                                │ publish
                                ▼
                     ┌──────────────────────┐
                     │   RabbitMQ           │
                     │   events_exchange    │
                     │        │             │
                     │   notifications_queue│
                     │        │             │
                     │   retry_queue ◄──┐   │
                     │        │         │   │
                     │   DLQ            │   │
                     └──────────┬───────┘   │
                                │ consume   │
                                ▼           │
                     ┌──────────────────────┐
                     │   Worker             │
                     │   :3002 (health)     │
                     │                      │
                     │  ┌─ Idempotency      │
                     │  ├─ User Prefs       │
                     │  ├─ Rate Limit ──────┘ (bounce back to retry)
                     │  ├─ EMAIL handler    │
                     │  ├─ SMS handler      │
                     │  └─ PUSH handler     │
                     └──────────┬───────────┘
                                │
                     ┌──────────▼───────────┐
                     │   PostgreSQL         │
                     │   events             │
                     │   notifications      │
                     │   user_preferences   │
                     └──────────────────────┘
                                │
                     ┌──────────▼───────────┐
                     │   Redis              │
                     │   rate:notif:{user}   │
                     │   rate:http:{caller}  │
                     └──────────────────────┘
```

### Component Inventory

| Component | Location | Role |
|---|---|---|
| **Producer API** | `src/producer/` | Hono HTTP server; validates, persists, publishes events |
| **Worker** | `src/worker/` | RabbitMQ consumer; processes events through handler pipeline |
| **RabbitMQ Client** | `src/rabbitmq/client.ts` | Connection, exchange/queue topology, publish helper |
| **Rate Limiter (worker)** | `src/worker/rate-limiter.ts` | Redis sorted-set sliding window (per user, 5/min) |
| **Rate Limiter (HTTP)** | `src/middleware/http-rate-limit.ts` | Redis sliding window (per API key, 100/min) |
| **API Key Auth** | `src/middleware/api-key.ts` | `x-api-key` header validation |
| **Handlers** | `src/worker/handlers/` | Channel-specific dispatch (EMAIL, SMS, PUSH) |
| **DB Client** | `src/db.ts` | Thin wrapper over shared `@vive/notification-db` |
| **Shared Schema** | `packages/notificationDB/` | Drizzle schema + connection factory (pool: 20) |
| **Config** | `src/config/env.ts` | Zod-parsed environment variables |
| **Logger** | `src/lib/logger.ts` | Pino structured logger with pretty-print in dev |

---

## 3. Critical Issues

### C1: Duplicate Notifications on Partial Failure Retry

**File:** `src/worker/consumer.ts` lines 117–155  
**Impact:** Users receive duplicate emails/SMS/push on retry

When one channel (e.g., SMS) fails but another (e.g., EMAIL) succeeds, the event is retried with `hasFailure = true`. On retry, ALL channels fire again — including EMAIL, which already succeeded. The user receives duplicate emails.

**Evidence:**
```typescript
// On retry, the consumer loads user preferences and dispatches to ALL channels
const channels: Array<"EMAIL" | "SMS" | "PUSH"> = [];
if (!prefs || prefs.emailEnabled) channels.push("EMAIL");
// ... dispatches to every channel without checking which already succeeded
```

The `notifications` table records per-channel `SENT` status, but the consumer never queries it before dispatching.

**Fix:** Before dispatching to a channel, query the `notifications` table for an existing `SENT` record for `(event_id, channel)`. Skip channels that already succeeded:

```typescript
import { and } from "drizzle-orm";

const [alreadySent] = await db
  .select({ id: notifications.id })
  .from(notifications)
  .where(
    and(
      eq(notifications.eventId, raw.event_id),
      eq(notifications.channel, ch),
      eq(notifications.status, "SENT")
    )
  )
  .limit(1);

if (alreadySent) {
  log.info({ channel: ch }, "Already delivered, skipping");
  continue;
}
```

Add a composite index: `(event_id, channel, status)` for this query.

**Severity:** CRITICAL — data integrity / user experience

---

### C2: Malformed Message Crashes Consumer via Unhandled Exception

**File:** `src/worker/consumer.ts` lines 37–41  
**Impact:** Permanent consumer stall after 10 poison messages (prefetch slots exhausted)

`JSON.parse()` and header reads occur **outside** the try-catch block:

```typescript
export async function processMessage(msg: ConsumeMessage): Promise<void> {
  const channel = getChannel();
  const raw: EventMessage = JSON.parse(msg.content.toString()); // ← OUTSIDE try-catch
  const retryCount = ...;  // ← if headers are malformed, this also throws
```

If a message contains invalid JSON, `JSON.parse` throws, the exception propagates unhandled, the message is never acked/nacked, and it permanently consumes one of the 10 prefetch slots. After 10 poison messages, the consumer halts entirely.

Additionally, the worker's `channel.consume` callback is async but amqplib does **not** await consumer callbacks — the promise rejection is silently lost:

```typescript
await channel.consume(QUEUE, async (msg) => {
  if (!msg) return;
  await processMessage(msg); // rejected promise is never caught
});
```

**Fix:**
1. Wrap the **entire** `processMessage` body in try-catch, including `JSON.parse`
2. For unparseable messages, `nack(msg, false, false)` — reject without requeue, routes to DLQ
3. Add `.catch()` on the consumer callback promise

**Severity:** CRITICAL — service availability (silent permanent stall)

---

### C3: No RabbitMQ Connection Recovery

**File:** `src/rabbitmq/client.ts`  
**Impact:** Worker permanently stops processing after any connection interruption

The RabbitMQ client establishes one connection and one channel with no reconnection logic. amqplib does **not** auto-reconnect. A transient network failure, RabbitMQ restart, or failover event permanently disables the consumer.

No event handlers are registered:
```typescript
// Missing:
connection.on("error", (err) => { /* reconnect */ });
connection.on("close", () => { /* reconnect */ });
channel.on("error", (err) => { /* recreate */ });
```

**Fix (recommended):** Replace raw `amqplib` with `amqp-connection-manager` — handles reconnection, channel recreation, and buffering publishes during outages. Alternatively, implement exponential-backoff reconnection manually.

**Severity:** CRITICAL — service availability in production

---

### C4: API Key Comparison Vulnerable to Timing Attack

**File:** `src/middleware/api-key.ts` line 14  
**Impact:** API key can be extracted character-by-character by measuring response latency

```typescript
if (!apiKey || apiKey !== env.API_KEY) {
```

JavaScript's `!==` operator short-circuits on the first differing byte. An attacker can determine the correct key incrementally by measuring response time differences.

**Fix:**
```typescript
import { timingSafeEqual } from "node:crypto";

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Usage:
if (!apiKey || !safeCompare(apiKey, env.API_KEY)) { ... }
```

**Severity:** CRITICAL — authentication bypass vector

---

## 4. High-Priority Issues

### H1: Rate Limiter Race Condition (Both Worker + HTTP)

**Files:** `src/worker/rate-limiter.ts`, `src/middleware/http-rate-limit.ts`

Both rate limiters use 3–4 separate Redis commands (ZREMRANGEBYSCORE → ZCARD → ZADD → EXPIRE) that are **not atomic**. Under concurrent load, multiple requests can pass the ZCARD check before any ZADD executes, exceeding the configured limit.

**Fix:** Use a Lua script for atomicity:
```lua
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local count = redis.call('ZCARD', key)
if count >= limit then return 0 end
redis.call('ZADD', key, now, now .. '-' .. math.random())
redis.call('EXPIRE', key, math.ceil(window / 1000))
return 1
```

### H2: No Graceful Shutdown Timeout / Force-Exit

**Files:** `src/producer/index.ts`, `src/worker/index.ts`

Both shutdown handlers await external disconnects (RabbitMQ, Redis) without a deadline. If any disconnect hangs, the process never exits, blocking deployment rollouts.

**Fix:** Add a force-exit after 15 seconds:
```typescript
setTimeout(() => {
  logger.error("Forced exit — shutdown exceeded deadline");
  process.exit(1);
}, 15_000).unref();
```

### H3: No `unhandledRejection` / `uncaughtException` Handlers

**Files:** `src/worker/index.ts`, `src/producer/index.ts`

Neither process registers handlers. An unhandled promise rejection (e.g., from C2 above) will silently drop errors. Critical for the consumer where amqplib doesn't await async callbacks.

### H4: `publishToExchange` Ignores Backpressure

**File:** `src/rabbitmq/client.ts` line 53–60

`channel.publish()` returns `false` when the write buffer is full. The return value is discarded. Under high publish throughput, subsequent publishes may be silently dropped. Should listen for `drain` events.

### H5: events Table Missing `user_id` Column

**File:** `packages/notificationDB/src/schema.ts`

The `user_id` is embedded inside the JSONB `payload` column via `{ ...body.payload, user_id: body.user_id }` in routes.ts. Cannot efficiently query events by user; inconsistent with the `notifications` table which has a proper `userId` column. Add `userId: varchar("user_id")` to events with an index.

### H6: SMTP Has No Timeout Configuration

**File:** `src/worker/handlers/email.ts`

Nodemailer has no `connectionTimeout`, `greetingTimeout`, or `socketTimeout` configured. A slow SMTP server will block the worker thread indefinitely, eventually exhausting all prefetch slots.

**Fix:** Add `connectionTimeout: 10_000`, `greetingTimeout: 10_000`, `socketTimeout: 30_000`.

---

## 5. Medium-Priority Issues

### M1: Producer Idempotency Check Has TOCTOU Race

**File:** `src/producer/routes.ts` lines 34–44

The idempotency check queries then inserts in two separate operations. Two concurrent requests with the same `event_id` can both pass the SELECT. The UNIQUE constraint will reject one, but the unhandled Postgres error returns 500 instead of 409.

**Fix:** Use `INSERT ... ON CONFLICT (event_id) DO NOTHING` + check returning rows, or catch the unique constraint violation and return 409.

### M2: Two Separate Redis Clients for Same Server

**Files:** `src/middleware/http-rate-limit.ts`, `src/worker/rate-limiter.ts`

Each module creates its own `new Redis(env.REDIS_URL)` instance — wasting connections and making shutdown coordination harder. Should share a single client via `src/lib/redis.ts`.

### M3: .env.example Missing Variables

**File:** `.env.example`

Missing: `API_KEY`, `HTTP_RATE_LIMIT_PER_MINUTE`, `MAX_RETRIES`, `RATE_LIMIT_PER_MINUTE`, `WORKER_HEALTH_PORT`. A developer cloning the repo will get a Zod validation error on startup because `API_KEY` has `min(1)`.

### M4: No Docker Compose Service Health Checks

**File:** `docker-compose.yml`

No `healthcheck` blocks for postgres, rabbitmq, or redis. Dependent services may connect before dependencies are ready.

### M5: No Message Validation in Consumer

**File:** `src/worker/consumer.ts`

After JSON.parse succeeds, the message is cast to `EventMessage` with no runtime validation. A structurally invalid message (e.g., missing `user_id`) will throw at an unpredictable point downstream.

**Fix:** Add a Zod schema for `EventMessage` and validate incoming messages. Reject invalid messages to DLQ immediately.

### M6: Dockerfile Lacks Build Stage and Runs as Root

**File:** `Dockerfile`

The Dockerfile assumes pre-built `dist/` folders exist. No build stage. Also runs as root — a container escape would grant root privileges. Should use multi-stage build with a non-root user.

### M7: No Testing Infrastructure

No test files, no test runner, no CI pipeline. Any change could introduce regressions undetected.

### M8: No Dead Letter Queue Consumer / Alerting

The DLQ exists but nothing reads from it. No alerting when messages are dead-lettered. In production, failures accumulate silently.

---

## 6. Low-Priority / Future Work

| # | Issue | Description |
|---|-------|-------------|
| L1 | No HTML email support | Only `text:` is used in nodemailer; many notifications need rich HTML |
| L2 | SMS/Push stubs log warnings but don't throw | If a user has `smsEnabled: true`, the stub succeeds silently — message recorded as SENT but never delivered |
| L3 | No circuit breaker for handlers | If SMTP is down, every message retries and fails; circuit breaker would fast-fail after N consecutive failures |
| L4 | Single API key for all clients | No per-service keys; cannot revoke access for one client without rotating the shared key |
| L5 | No database migration on startup | Service assumes schema exists; should auto-migrate or fail fast with a clear error |
| L6 | No OpenTelemetry / distributed tracing | Can't trace a request from producer → RabbitMQ → worker → handler |
| L7 | No Prometheus metrics endpoint | No visibility into queue depth, handler latency, error rates |
| L8 | No `.dockerignore` file | Docker context may include node_modules, .git, etc. |
| L9 | Redis is single-instance | No Sentinel/Cluster configuration for HA |
| L10 | `events.max_retries` column unused | Schema has it but code reads from `env.MAX_RETRIES` — dead column |
| L11 | `notifications.status` has unused `PENDING` value | Notifications are inserted directly as `SENT` or `FAILED` |

---

## 7. Security Assessment

| Area | Status | Notes |
|------|--------|-------|
| Authentication | ⚠️ Implemented, vulnerable | API key auth present; timing attack (C4) |
| Authorization | ❌ None | Any valid API key can perform any action |
| HTTP Rate Limiting | ✅ Good | Sliding-window per-caller with proper headers |
| Worker Rate Limiting | ✅ Good | Per-user sliding window with bounce cap |
| Input Validation | ✅ Good | Zod schemas on API input; missing on consumer side (M5) |
| Secrets Management | ⚠️ Acceptable for dev | Env vars with non-default placeholder passwords |
| Transport Security | ⚠️ Comments only | `.env.example` mentions `amqps://`/`rediss://` but no enforcement |
| Container Security | ❌ Runs as root | No non-root user in Dockerfile (M6) |
| Dependency Auditing | ❌ None | No `npm audit` in CI, no Dependabot/Renovate |
| SQL Injection | ✅ Safe | Drizzle ORM uses parameterized queries |
| Log Injection | ✅ Safe | Pino auto-escapes structured fields |

**Security Score: 5/10** — Up from 4/10. Auth and rate limiting now exist but remain bypassable (C4) with no authorization layer.

---

## 8. Reliability & Fault Tolerance

| Scenario | Handled? | Notes |
|----------|----------|-------|
| RabbitMQ restart | ❌ | No reconnection logic (C3) |
| Redis outage | ❌ | Rate limiter throws, no fallback (service crashes) |
| PostgreSQL outage | ❌ | Drizzle throws, no retry or circuit breaker |
| Malformed message | ❌ | Crashes consumer silently (C2) |
| Partial channel delivery | ⚠️ | Retries exist but re-send successful channels (C1) |
| Duplicate event submission | ⚠️ | DB unique constraint catches race, but returns 500 not 409 (M1) |
| SMTP timeout | ❌ | No timeout configured (H6) |
| Worker OOM | ❌ | No memory limits in Docker or Node flags |
| Graceful shutdown | ⚠️ | Exists; can hang forever without force-exit (H2) |
| Poison messages | ❌ | JSON.parse outside try-catch (C2) |
| Connection drop mid-publish | ❌ | No retry on publish failure |

**Reliability Score: 4/10** — Happy path works well. Most failure scenarios are unhandled.

---

## 9. Data Model Review

### 9.1 Current Schema

```
events
├── id (uuid, PK)
├── event_id (varchar, UNIQUE) ← idempotency key
├── event_type (varchar)
├── payload (jsonb) ← user_id buried here (H5)
├── status (enum: PENDING|PROCESSED|FAILED|RETRYING)
├── retry_count (int)
├── max_retries (int) ← unused by application code (L10)
├── error_message (text)
├── created_at, updated_at
├── INDEX(status) ✅
└── INDEX(created_at) ✅

notifications
├── id (uuid, PK)
├── event_id (varchar) ← not FK, no referential integrity
├── user_id (varchar)
├── channel (enum: EMAIL|SMS|PUSH)
├── status (enum: PENDING|SENT|FAILED) ← PENDING never used (L11)
├── recipient, subject, body
├── error_message, sent_at, failed_at
├── created_at, updated_at ✅ (added in remediation)
├── INDEX(event_id) ✅
└── INDEX(user_id) ✅

user_preferences
├── id (uuid, PK)
├── user_id (varchar, UNIQUE)
├── email_enabled, sms_enabled, push_enabled
├── email_address, phone_number, push_token
└── created_at, updated_at
```

### 9.2 Missing Indexes

| Table | Column(s) | Justification |
|-------|-----------|---------------|
| `notifications` | `(event_id, channel, status)` | C1 fix — skip already-sent channels on retry |
| `notifications` | `status` | Query failed notifications for retry/alerting dashboards |
| `events` | `user_id` (after adding column) | Query events by user |
| `events` | `updated_at` | Time-range monitoring queries |

### 9.3 Data Model Issues

1. **No foreign key** from `notifications.event_id` → `events.event_id`: orphaned notification records can exist
2. **`events.max_retries`** column exists but is never read — dead column
3. **`notifications.status = 'PENDING'`** defined in enum but never used — notifications are inserted as SENT or FAILED
4. **No `SKIPPED` status** — when a channel is disabled or has no recipient, there's no record
5. **`user_id` buried in payload JSONB** — not queryable without column extraction (H5)

---

## 10. Observability Assessment

| Capability | Status | Details |
|------------|--------|---------|
| Structured Logging | ✅ Implemented | Pino with JSON in prod, pretty-print in dev |
| Log Levels | ✅ Configurable | Via `LOG_LEVEL` env var |
| Child Loggers | ✅ Used | `logger.child({ eventId, userId })` for correlation |
| Request Logging | ❌ Missing | No HTTP request/response logging middleware |
| Metrics | ❌ None | No Prometheus/StatsD/OTEL metrics |
| Distributed Tracing | ❌ None | No OpenTelemetry or trace ID propagation |
| Health Checks | ✅ Both processes | Producer `:3001/health`, Worker `:3002` |
| Health Check Depth | ❌ Shallow | Endpoints don't verify DB/RabbitMQ/Redis connectivity |
| DLQ Monitoring | ❌ None | No consumer, no alerting |
| Error Tracking | ❌ None | No Sentry/Honeybadger/Datadog integration |

**Observability Score: 4/10** — Up from 3/10. Structured logging and health checks are good. Everything else absent.

---

## 11. Performance & Scalability

### 11.1 Current Configuration

| Component | Setting | Notes |
|-----------|---------|-------|
| Worker prefetch | 10 | Good — allows concurrent processing |
| HTTP rate limit | 100/min per API key | Reasonable default |
| User rate limit | 5/min per user | Low — may need tuning |
| DB connection pool | max: 20 | Set explicitly ✅ |
| Redis connections | 2 instances | Should be 1 shared (M2) |

### 11.2 Throughput Estimate (Single Worker)

- With prefetch(10) and average 200ms handler latency: **~50 messages/sec**
- Bottleneck: Sequential DB queries per message (idempotency + prefs + per-channel insert) = 4–8 queries/message
- DB pool of 20 at ~0.5ms per query → **~2,500 queries/sec → ~400 msg/sec ceiling**
- SMTP is the real bottleneck — each email requires a TCP round-trip

### 11.3 Horizontal Scaling

| Component | Scalable? | Mechanism |
|-----------|----------|-----------|
| Producer | ✅ Yes | Stateless — just add replicas behind load balancer |
| Worker | ✅ Yes | RabbitMQ competing consumers distribute messages |
| PostgreSQL | ⚠️ Vertically | Read replicas for prefs lookup, write primary for events |
| Redis | ⚠️ Single | Sentinel/Cluster needed for HA |
| RabbitMQ | ⚠️ Single | Mirrors/quorum queues needed beyond ~10K msg/sec |

---

## 12. Operational Readiness Checklist

| Item | Status | Priority |
|------|--------|----------|
| Critical bugs fixed (C1–C4) | ❌ | P0 |
| API authentication | ✅ Implemented | — |
| HTTP rate limiting | ✅ Implemented | — |
| Connection recovery (RabbitMQ) | ❌ | P0 |
| Graceful shutdown with timeout | ⚠️ No timeout | P0 |
| Structured logging | ✅ Implemented | — |
| Health checks (both processes) | ✅ Implemented | — |
| Deep health checks (verify deps) | ❌ | P1 |
| DB indexes | ✅ Core indexes added | — |
| Composite index for C1 fix | ❌ | P0 |
| Non-root Docker container | ❌ | P1 |
| Multi-stage Docker build | ❌ | P1 |
| Unit tests | ❌ | P1 |
| Integration tests | ❌ | P1 |
| CI/CD pipeline | ❌ | P1 |
| Load testing | ❌ | P1 |
| Metrics endpoint | ❌ | P2 |
| Distributed tracing | ❌ | P2 |
| DLQ consumer + alerting | ❌ | P2 |
| Runbook / incident docs | ❌ | P2 |
| Database backup strategy | ❌ | P2 |
| Secret rotation mechanism | ❌ | P3 |

---

## 13. What Was Fixed Well

Credit where due — the following issues from the prior review were properly remediated:

| Issue | Fix Quality | Notes |
|-------|------------|-------|
| Retry queue TTL bug | ✅ Excellent | Removed queue-level `x-message-ttl`; per-message expiration works correctly |
| Partial delivery tracking | ✅ Good | Per-channel try/catch with `hasFailure` flag; needs duplicate-skip (C1) |
| Rate-limit infinite loop | ✅ Good | Capped at `MAX_RATE_LIMIT_BOUNCES = 10` with DLQ routing |
| API key authentication | ✅ Implemented | Needs timing-safe comparison (C4) |
| HTTP rate limiting | ✅ Good | Sliding window with proper headers (Retry-After, X-RateLimit-*) |
| Structured logging | ✅ Excellent | Pino with child loggers, configurable level, JSON in prod |
| Worker health check | ✅ Good | Separate HTTP server on port 3002 |
| DB indexes | ✅ Good | Added on events.status, events.created_at, notifications.event_id, notifications.user_id |
| DB connection pool | ✅ Good | Explicitly set `max: 20` |
| Graceful shutdown | ✅ Good | Consumer cancellation + wait for in-flight; needs timeout (H2) |
| prefetch increase | ✅ Correct | 1 → 10 |
| Non-default credentials | ✅ Good | Env-variable-driven with `change_me_in_production` defaults |
| notifications.updated_at | ✅ Good | Column added |

---

## 14. Prioritized Action Plan

### P0 — Must Fix Before Any Deployment

| # | Action | Effort | Files |
|---|--------|--------|-------|
| 1 | Skip already-sent channels on retry (C1) + add composite index | S | `consumer.ts`, `schema.ts` |
| 2 | Wrap JSON.parse in try-catch, nack malformed messages (C2) | S | `consumer.ts`, `worker/index.ts` |
| 3 | Add RabbitMQ connection recovery via `amqp-connection-manager` (C3) | M | `rabbitmq/client.ts`, `package.json` |
| 4 | Use `crypto.timingSafeEqual` for API key (C4) | XS | `middleware/api-key.ts` |
| 5 | Add shutdown force-exit timeout (H2) | XS | `producer/index.ts`, `worker/index.ts` |
| 6 | Add `unhandledRejection`/`uncaughtException` handlers (H3) | XS | `producer/index.ts`, `worker/index.ts` |

### P1 — Before Production Traffic

| # | Action | Effort | Files |
|---|--------|--------|-------|
| 7 | Atomic Redis rate limiting via Lua script (H1) | S | `rate-limiter.ts`, `http-rate-limit.ts` |
| 8 | Add `userId` column to events table (H5) | S | `schema.ts`, `routes.ts` |
| 9 | Add SMTP timeouts (H6) | XS | `handlers/email.ts` |
| 10 | Handle `publish()` backpressure (H4) | S | `rabbitmq/client.ts` |
| 11 | Fix .env.example with all variables (M3) | XS | `.env.example` |
| 12 | Add Zod validation for consumer messages (M5) | S | `consumer.ts` |
| 13 | Multi-stage Dockerfile + non-root user (M6) | M | `Dockerfile` |
| 14 | Deep health checks (verify DB/RabbitMQ/Redis) | S | `producer/index.ts`, `worker/index.ts` |
| 15 | Shared Redis client (M2) | S | New `lib/redis.ts` |

### P2 — Before Scaling

| # | Action | Effort | Files |
|---|--------|--------|-------|
| 16 | Fix producer idempotency TOCTOU race (M1) | S | `routes.ts` |
| 17 | Docker Compose health checks (M4) | S | `docker-compose.yml` |
| 18 | Unit + integration test suite (M7) | L | New `__tests__/` |
| 19 | DLQ consumer with alerting (M8) | M | New `worker/dlq-consumer.ts` |
| 20 | Prometheus metrics endpoint (L7) | M | New `lib/metrics.ts` |
| 21 | HTTP request/response logging middleware | S | `producer/index.ts` |

### P3 — Future

| # | Action | Effort |
|---|--------|--------|
| 22 | OpenTelemetry tracing | L |
| 23 | Circuit breaker for handlers | M |
| 24 | Per-service API keys | M |
| 25 | HTML email support | S |
| 26 | SMS/Push provider integration | M |
| 27 | Auto-migration on startup | S |
| 28 | Blue/green deployment | L |

---

**Effort key:** XS = <1hr, S = 1–4hrs, M = 4–16hrs, L = 16+hrs

**Bottom line:** The architecture is fundamentally sound and the prior remediation addressed many issues effectively. However, **C1–C4 are blockers** — duplicate delivery, consumer crashes, connection loss, and authentication bypass cannot ship to production. The P0 items represent roughly **2–3 days** of focused engineering. After those are resolved, the service is suitable for **staging deployment** with low-to-moderate traffic while P1 items are addressed in parallel.
