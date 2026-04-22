# Migration: Fastify → Hono.js

**Date:** April 20, 2026  
**Scope:** All backend microservices (`apps/*`) and shared server infrastructure (`packages/`)

---

## Why We Migrated

### 1. Web-Standard Request/Response Model

Fastify uses its own proprietary `FastifyRequest`/`FastifyReply` abstraction. Hono is built on the **WHATWG Fetch API** (`Request`/`Response`), the same standard used by browsers, Deno, Bun, Cloudflare Workers, and Node.js 18+. This means:

- No proprietary abstractions to learn or maintain
- Handlers are portable across runtimes without modification
- Type safety is derived from web standards, not a framework-specific type system

### 2. Runtime Portability

Fastify is Node.js-only. Hono runs natively on:

| Runtime    | Fastify | Hono |
|------------|---------|------|
| Node.js.   | ✅ -----| ✅ --|
| Bun      --| ⚠️ Partial| ✅ |
| Deno       | ❌      | ✅ |
| Cloudflare | ❌      | ✅ |
| AWS Lambda | ⚠️ Adapter needed | ✅ |
| Vercel Edge | ❌ | ✅ |

This gives us the option to deploy individual services to edge runtimes (e.g. Cloudflare Workers for the API Gateway) without rewriting handlers.

### 3. Performance

Hono's router (`RegExpRouter` / `SmartRouter`) benchmarks consistently faster than Fastify's `find-my-way` on both cold-start and throughput metrics, particularly at edge where startup time is critical.

### 4. Bundle Size

Hono has **zero dependencies** and a sub-20KB bundle. Fastify's dependency tree (find-my-way, fast-json-stringify, pino, etc.) is significantly larger. This matters for Lambda cold starts and edge deployments.

### 5. Simpler Middleware Model

Fastify's plugin/hook system (`preHandler`, `onSend`, `onRequest`, etc.) is powerful but complex. Hono uses a linear middleware chain identical to Express/Koa (`c.next()`), which is:

- Easier to reason about for new contributors
- Compatible with a larger ecosystem of existing middleware
- Typed end-to-end via Hono's `Context` generics

### 6. First-Class TypeScript Support

Hono was written in TypeScript from day one. Route handler context (`c: Context`) carries full type inference for request body, query params, route params, and environment variables — without decorators or separate type augmentation.

Fastify requires manual interface merging (e.g. `interface FastifyRequest { user: TokenPayload }`) that is error-prone and bypasses the type system at key security boundaries.

### 7. OpenAPI / RPC Compatibility

Hono's `hono/zod-openapi` and `hono/rpc` modules provide type-safe RPC between services and auto-generated OpenAPI specs. This aligns with our roadmap for internal service-to-service type-safe clients and public API documentation.

---

## What Changed

| Layer | Before | After |
|---|---|---|
| HTTP server | `fastify()` | `new Hono()` |
| Request type | `FastifyRequest` | `Context` from `hono` |
| Reply type | `FastifyReply` | `Context` (`.json()`, `.text()`, `.body()`) |
| Middleware | `preHandler` hooks | Hono middleware chain |
| Route registration | `app.register(plugin)` | `app.route('/path', handler)` |
| Auth middleware | Fastify `preHandler` array | Hono `createMiddleware()` |
| Shared server package | `@cms/server` (Fastify) | `@cms/server` (Hono) |
| Node.js adapter | `fastify-plugin` | `@hono/node-server` |

---

## What Was NOT Changed

- **Business logic** in route handlers — all database queries, validation, and domain logic are unchanged
- **API contracts** — all endpoints, request/response shapes, status codes, and headers remain identical
- **Authentication** — JWT verification, RBAC middleware, and tenant isolation logic are identical
- **Database layer** — Knex / `@cms/database` is unchanged
- **Validation** — Zod schemas and `@cms/validation` are unchanged
- **Messaging** — `@cms/messaging` (Redis pub/sub) is unchanged
- **Frontend** — no changes to `frontend/dashboard`

---

## Rollback Plan

All Fastify packages remain in the monorepo's `pnpm-lock.yaml` for 30 days. To revert:

```bash
git revert <migration-commit-sha>
pnpm install
pnpm build
```
