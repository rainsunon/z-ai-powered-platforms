# Technical Architecture Analysis — Microservices E-Commerce Platform

> **Analyst Role**: Senior Architect  
> **Scope**: Full monorepo structure, service topology, data flows, technology stack, dependency graph, and architectural quality assessment  
> **Date**: March 31, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Monorepo Topology](#2-monorepo-topology)
3. [Build System & Toolchain](#3-build-system--toolchain)
4. [Service Catalog](#4-service-catalog)
5. [Shared Packages (Internal Libraries)](#5-shared-packages-internal-libraries)
6. [Frontend Applications](#6-frontend-applications)
7. [Inter-Service Communication (Kafka Event Bus)](#7-inter-service-communication-kafka-event-bus)
8. [Data Architecture](#8-data-architecture)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [API Gateway Pattern](#10-api-gateway-pattern)
11. [Dependency Graph](#11-dependency-graph)
12. [Port Allocation Map](#12-port-allocation-map)
13. [Architectural Patterns & Decisions](#13-architectural-patterns--decisions)
14. [Risk Assessment & Recommendations](#14-risk-assessment--recommendations)

---

## 1. Executive Summary

This is a **Turborepo-managed pnpm monorepo** implementing a microservices e-commerce platform. The system comprises **15 backend services**, **2 frontend applications (Next.js)**, and **5 shared internal packages**. Services communicate asynchronously via **Apache Kafka (Redpanda)** and are fronted by an **Express-based API Gateway** with reverse proxy routing.

**Key architectural characteristics:**
- **Polyglot HTTP frameworks**: Express (v4/v5), Fastify (v5), Hono (v4) — intentional heterogeneity across services
- **Polyglot databases**: PostgreSQL (via Prisma) for products, MongoDB (via Mongoose) for orders/inventory/discounts/audit
- **Event-driven architecture**: KafkaJS over a 3-node Redpanda cluster
- **Centralized auth**: Clerk across all layers (Next.js middleware, Express/Fastify/Hono integrations)
- **Payment processing**: Stripe with webhook-based payment confirmation

---

## 2. Monorepo Topology

```
microservice-ecommerce-services/          ← Root (pnpm workspace)
├── apps/                                  ← Deployable units
│   ├── api-gateway/          Express      ← Reverse proxy + rate limiting + audit
│   ├── auth-service/         Express v5   ← User management (Clerk wrapper)
│   ├── product-service/      Express v5   ← Product CRUD (PostgreSQL/Prisma)
│   ├── order-service/        Fastify v5   ← Order lifecycle (MongoDB/Mongoose)
│   ├── payment-service/      Hono v4      ← Stripe integration + webhooks
│   ├── email-service/        Pure Kafka   ← Event-driven email (Nodemailer)
│   ├── inventory-service/    Fastify v5   ← Stock management + analytics (MongoDB)
│   ├── discount-service/     Fastify v5   ← Coupon/discount codes (MongoDB)
│   ├── audit-service/        Fastify v4   ← Audit trail logging (MongoDB)
│   ├── client/               Next.js 15   ← Customer-facing storefront
│   └── admin/                Next.js 15   ← Admin dashboard
├── packages/                              ← Shared internal libraries
│   ├── kafka/                             ← Kafka client/producer/consumer abstractions
│   ├── order-db/                          ← MongoDB connection + Order model
│   ├── product-db/                        ← Prisma client + schema + migrations
│   ├── types/                             ← Shared TypeScript types + Zod schemas
│   ├── typescript-config/                 ← Shared tsconfig presets
│   └── eslint-config/                     ← Shared ESLint configurations
```

**Workspace configuration** (`pnpm-workspace.yaml`):
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 3. Build System & Toolchain

### 3.1 Turborepo Configuration

| Task | Dependencies | Cache | Persistent | Notes |
|------|-------------|-------|------------|-------|
| `build` | `^build` (topological) | Yes (`.next/**`) | No | Respects `DATABASE_URL` env, `.env*` inputs |
| `dev` | None | No | Yes | Runs all services with `--concurrency=15` |
| `lint` | `^lint` | Yes | No | Topological lint ordering |
| `check-types` | `^check-types` | Yes | No | TypeScript type checking |
| `db:generate` | None | No | No | Prisma client generation |
| `db:migrate` | None | No | Yes | Prisma migration (persistent for interactive) |
| `db:deploy` | None | No | No | Prisma migration deploy |

**UI mode**: `tui` (terminal UI for interactive development)

### 3.2 Runtime & Package Manager

| Tool | Version |
|------|---------|
| **Node.js** | >= 18 |
| **pnpm** | 9.0.0 |
| **Turborepo** | ^2.5.6 |
| **TypeScript** | 5.9.2 |
| **Prettier** | ^3.6.2 |

### 3.3 TypeScript Configuration

Base configuration (`packages/typescript-config/base.json`):
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **Strict mode**: Enabled
- **`noUncheckedIndexedAccess`**: Enabled — strong type safety for index signatures
- **`isolatedModules`**: Enabled — compatible with SWC/esbuild transpilation

All packages use **ESM** (`"type": "module"`) consistently.

### 3.4 Development Runtime

Services use **`tsx`** for development hot-reloading with `--watch` mode and `--env-file=.env` for environment variable loading. Some services use `pnpm dlx tsx` (on-demand execution) while others have `tsx` as a direct devDependency — an inconsistency noted below.

---

## 4. Service Catalog

### 4.1 API Gateway (`apps/api-gateway`)

| Property | Value |
|----------|-------|
| **Framework** | Express 4.x |
| **Port** | 4000 |
| **Purpose** | Centralized entry point, reverse proxy, cross-cutting concerns |

**Responsibilities:**
- Reverse-proxies all `/api/*` routes to downstream services via `http-proxy-middleware`
- Applies Clerk authentication selectively (per-route `auth` flag)
- Global rate limiting (100 req/min default, configurable)
- Tiered rate limiters: auth (5/min), write (30/min), read (60/min)
- Security headers via `helmet`
- Structured logging via `winston`
- Audit trail emission to Kafka (`audit.api` topic)
- CORS enforcement for `localhost:3002` (client) and `localhost:3003` (admin)

**Route table** (from `config/routes.ts`):

| Gateway Path | Target Service | Auth Required |
|-------------|----------------|---------------|
| `/api/auth` | auth-service (8003) | No |
| `/api/users` | auth-service (8003) | Yes |
| `/api/products` | product-service (8000) | No |
| `/api/categories` | product-service (8000) | No |
| `/api/orders` | order-service (8001) | Yes |
| `/api/payments` | payment-service (8002) | Yes |
| `/api/sessions` | payment-service (8002) | Yes |
| `/api/discount` | discount-service (3004) | Yes |
| `/api/inventory` | inventory-service (3005) | Yes |
| `/api/analytics` | inventory-service (3005) | Yes |
| `/api/notifications` | inventory-service (3005) | Yes |

All proxied routes strip the `/api` prefix via `pathRewrite: { "^/api": "" }`.

---

### 4.2 Auth Service (`apps/auth-service`)

| Property | Value |
|----------|-------|
| **Framework** | Express 5.x |
| **Port** | 8003 |
| **Database** | None (Clerk-managed) |
| **Kafka** | Producer only |

**Responsibilities:**
- Wraps Clerk user management APIs
- Admin-only user routes (`shouldBeAdmin` middleware)
- Publishes `user.created` events to Kafka on user creation

---

### 4.3 Product Service (`apps/product-service`)

| Property | Value |
|----------|-------|
| **Framework** | Express 5.x |
| **Port** | 8000 |
| **Database** | PostgreSQL via Prisma (`@repo/product-db`) |
| **Kafka** | Producer + Consumer |

**Responsibilities:**
- Full CRUD for products and categories
- Publishes `product.created`, `product.updated`, `product.deleted` events
- CORS configured for both client (3002) and admin (3003)

---

### 4.4 Order Service (`apps/order-service`)

| Property | Value |
|----------|-------|
| **Framework** | Fastify 5.x |
| **Port** | 8001 |
| **Database** | MongoDB via Mongoose (`@repo/order-db`) |
| **Kafka** | Producer + Consumer |

**Responsibilities:**
- Order creation and querying
- Subscribes to `payment.successful` — updates order status on payment confirmation
- Publishes `order.created` events

---

### 4.5 Payment Service (`apps/payment-service`)

| Property | Value |
|----------|-------|
| **Framework** | Hono 4.x (Node.js adapter) |
| **Port** | 8002 |
| **Database** | None (stateless, Stripe-managed) |
| **Kafka** | Producer + Consumer |

**Responsibilities:**
- Stripe Checkout Session creation
- Stripe webhook handling — publishes `payment.successful` on successful charges
- Subscribes to `product.created` and `product.deleted` for Stripe product sync

---

### 4.6 Email Service (`apps/email-service`)

| Property | Value |
|----------|-------|
| **Framework** | None (headless Kafka consumer) |
| **Port** | N/A |
| **Database** | None |
| **Kafka** | Consumer only |

**Responsibilities:**
- Pure event-driven service — no HTTP server
- Subscribes to `user.created` → sends welcome email
- Subscribes to `order.created` → sends order confirmation email
- Uses Nodemailer for SMTP delivery

---

### 4.7 Inventory Service (`apps/inventory-service`)

| Property | Value |
|----------|-------|
| **Framework** | Fastify 5.x |
| **Port** | 3005 |
| **Database** | MongoDB (own `inventory-service` database) |
| **Kafka** | Producer + Consumer |

**Responsibilities:**
- Stock level management, restocking
- Sales analytics and revenue reports
- Low-stock notification emission (`inventory.low-stock` topic)
- Subscribes to `order.created` → decrements stock
- Subscribes to `product.created` → creates inventory record
- Subscribes to `product.updated` → syncs product metadata
- Route prefixes: `/api/inventory`, `/api/analytics`, `/api/notifications`

---

### 4.8 Discount Service (`apps/discount-service`)

| Property | Value |
|----------|-------|
| **Framework** | Fastify 5.x |
| **Port** | 3004 |
| **Database** | MongoDB (own `discount-service` database) |
| **Kafka** | None |

**Responsibilities:**
- Discount code CRUD (percentage and fixed types)
- Discount validation against cart total, product eligibility, user eligibility
- Discount calculation with per-item breakdown
- Uses `@fastify/cors` plugin
- Route prefix: `/api/discount`

---

### 4.9 Audit Service (`apps/audit-service`)

| Property | Value |
|----------|-------|
| **Framework** | Fastify 4.x |
| **Port** | 3006 |
| **Database** | MongoDB (own `audit-service` database) |
| **Kafka** | Consumer only |

**Responsibilities:**
- Consumes all audit-related Kafka topics (wildcard subscription pattern)
- Stores audit trail events with metadata (user, resource, action, IP, etc.)
- Exposes query API for audit log retrieval
- Health check includes MongoDB connection status
- Route prefix: `/api/audit`

---

## 5. Shared Packages (Internal Libraries)

### 5.1 `@repo/kafka`

**Purpose**: Abstracts KafkaJS client creation, producer, and consumer patterns.

| Export | Description |
|--------|-------------|
| `createKafkaClient(service)` | Creates a KafkaJS client with 3-broker configuration |
| `createProducer(kafka)` | Returns `{ connect, send, disconnect }` — JSON-serializing producer |
| `createConsumer(kafka, groupId)` | Returns `{ connect, subscribe, disconnect }` — topic-handler-mapped consumer |

**Broker configuration**: `localhost:9094`, `localhost:9095`, `localhost:9096` (hardcoded, 3-node Redpanda cluster).

**Consumer pattern**: Topic-handler mapping via array of `{ topicName, topicHandler }` objects — clean separation of topic routing from message processing.

### 5.2 `@repo/product-db`

**Purpose**: Prisma-managed PostgreSQL database for the product domain.

| Component | Technology |
|-----------|-----------|
| ORM | Prisma 6.16.0 |
| Database | PostgreSQL |
| Client | Singleton pattern with global caching |

**Schema models**:
- **`Product`**: `id`, `name`, `shortDescription`, `description`, `price` (integer/cents), `sizes[]`, `colors[]`, `images` (JSON), `categorySlug` → Category
- **`Category`**: `id`, `name`, `slug` (unique)

Exports both the Prisma client instance and all generated types.

### 5.3 `@repo/order-db`

**Purpose**: MongoDB connection and Order model for the order domain.

| Component | Technology |
|-----------|-----------|
| ODM | Mongoose 8.x |
| Database | MongoDB |

**Order model schema**:
- `userId`, `email`, `amount`, `status` (enum: `success` | `failed`), `products[]` (embedded: `name`, `quantity`, `price`)
- Timestamps enabled (`createdAt`, `updatedAt`)

Connection management uses a singleton flag (`isConnected`) to prevent duplicate connections.

### 5.4 `@repo/types`

**Purpose**: Shared TypeScript type definitions and Zod validation schemas used across services and frontends.

| Module | Key Exports |
|--------|-------------|
| `auth.ts` | `CustomJwtSessionClaims`, `UserFormSchema` (Zod) |
| `product.ts` | `ProductType`, `ProductFormSchema` (Zod), `colors`, `sizes` constants |
| `cart.ts` | `CartItemType`, `shippingFormSchema` (Zod), cart store types |
| `order.ts` | `OrderType`, `OrderChartType` |
| `discount.ts` | `DiscountCode`, `ValidateDiscountRequest/Response`, `CalculateDiscountRequest/Response` |
| `inventory.ts` | `InventoryItem`, `SalesSummary`, `TopProduct`, `RevenueDataPoint`, `ProductPerformance` |

**Dependencies**: `@repo/product-db` (for `Product` type re-export), `@repo/order-db` (for `OrderSchemaType`), `zod` v4.

> **Note**: The `main` field in `@repo/types` package.json has a typo: `"src/index/ts"` instead of `"src/index.ts"`. This doesn't break resolution due to the correct `exports` field, but should be fixed.

### 5.5 `@repo/typescript-config`

Shared TypeScript configuration presets: `base.json`, `nextjs.json`, `react-library.json`.

### 5.6 `@repo/eslint-config`

Shared ESLint configurations: `base.js`, `next.js`, `react-internal.js`.

---

## 6. Frontend Applications

### 6.1 Client Storefront (`apps/client`)

| Property | Value |
|----------|-------|
| **Framework** | Next.js 15.4.5 / React 19.1.0 |
| **Port** | 3002 |
| **Styling** | TailwindCSS 4 |
| **Auth** | `@clerk/nextjs` |
| **State** | Zustand (cart store) |
| **Forms** | React Hook Form + Zod (via `@hookform/resolvers`) |
| **Payments** | `@stripe/react-stripe-js` + `@stripe/stripe-js` |
| **Notifications** | react-toastify |

**Route structure**:
```
/ (homepage)
/products/
/cart/
/orders/
/return/
/sign-in/
/sign-up/
/test/
```

**Middleware**: Clerk middleware applied to all routes (public access, auth info available when present).

**Image sources**: Clerk avatars (`img.clerk.com`), product images (`res.cloudinary.com`).

### 6.2 Admin Dashboard (`apps/admin`)

| Property | Value |
|----------|-------|
| **Framework** | Next.js 15.3.0 / React 19 |
| **Port** | 3003 |
| **Styling** | TailwindCSS 4 |
| **Auth** | `@clerk/nextjs` (admin role enforcement) |
| **UI Components** | Radix UI primitives (12+ components) |
| **Data** | `@tanstack/react-query` + `@tanstack/react-table` |
| **Charts** | Recharts |
| **Date handling** | date-fns + react-day-picker |

**Route structure**:
```
/(auth)/          ← sign-in, unauthorized
/(dashboard)/     ← protected admin area
  /               ← dashboard home
  /analytics/
  /discounts/
  /inventory/
  /orders/
  /products/
  /users/
```

**Middleware**: Strict role-based access control — Clerk middleware checks `sessionClaims.metadata.userRole === "admin"`, redirects non-admins to `/unauthorized`.

**Image sources**: Pexels, Clerk avatars, Cloudinary.

---

## 7. Inter-Service Communication (Kafka Event Bus)

### 7.1 Infrastructure

- **Engine**: Redpanda (Kafka-compatible)
- **Cluster**: 3 nodes (dev-container mode)
- **Broker ports**: 9094, 9095, 9096 (external)
- **Client library**: KafkaJS 2.2.4
- **Consumer groups**: Service-name-based (e.g., `email-service`, `order-service`)

### 7.2 Event Topology

```
┌──────────────────────────────────────────────────────────────────┐
│                        KAFKA EVENT BUS                           │
├─────────────────────┬────────────────────────────────────────────┤
│ Topic               │ Producer → Consumers                       │
├─────────────────────┼────────────────────────────────────────────┤
│ user.created        │ auth-service → email-service               │
│ product.created     │ product-service → payment-service,         │
│                     │                   inventory-service         │
│ product.updated     │ product-service → inventory-service         │
│ product.deleted     │ product-service → payment-service           │
│ order.created       │ order-service → email-service,             │
│                     │                  inventory-service           │
│ payment.successful  │ payment-service → order-service             │
│ inventory.low-stock │ inventory-service → (consumers TBD)         │
│ audit.api           │ api-gateway → audit-service                 │
└─────────────────────┴────────────────────────────────────────────┘
```

### 7.3 Event Flow Sequences

**Purchase Flow:**
```
1. Client → API Gateway → Payment Service   (create Stripe session)
2. Stripe Webhook → Payment Service          (payment confirmed)
3. Payment Service → [payment.successful]    (Kafka)
4. Order Service ← [payment.successful]      (creates order)
5. Order Service → [order.created]           (Kafka)
6. Email Service ← [order.created]           (sends confirmation)
7. Inventory Service ← [order.created]       (decrements stock)
```

**Product Creation Flow:**
```
1. Admin → API Gateway → Product Service     (create product)
2. Product Service → [product.created]        (Kafka)
3. Payment Service ← [product.created]        (syncs Stripe product)
4. Inventory Service ← [product.created]      (creates inventory record)
```

**User Registration Flow:**
```
1. Admin → Auth Service                       (create user)
2. Auth Service → [user.created]              (Kafka)
3. Email Service ← [user.created]             (sends welcome email)
```

---

## 8. Data Architecture

### 8.1 Database-per-Service Pattern

| Service | Database | Technology | Connection String Source |
|---------|----------|-----------|------------------------|
| product-service | PostgreSQL | Prisma 6.x | `DATABASE_URL` env |
| order-service | MongoDB | Mongoose 8.x | `MONGO_URL` env |
| inventory-service | MongoDB | Mongoose 8.x | `MONGO_URI` env (default: `mongodb://localhost:27017/inventory-service`) |
| discount-service | MongoDB | Mongoose 8.x | `MONGO_URI` env (default: `mongodb://localhost:27017/discount-service`) |
| audit-service | MongoDB | Mongoose 8.x | `MONGO_URI` env (default: `mongodb://localhost:27017/audit-service`) |

> **Inconsistency**: `order-service` uses `MONGO_URL` while `inventory-service`, `discount-service`, and `audit-service` use `MONGO_URI`. Should be standardized.

### 8.2 Data Models

**PostgreSQL (Product domain):**
```
Product {
  id: Int (PK, auto-increment)
  name: String
  shortDescription: String
  description: String
  price: Int (cents)
  sizes: String[]
  colors: String[]
  images: Json
  categorySlug: String → Category.slug
  createdAt: DateTime
  updatedAt: DateTime
}

Category {
  id: Int (PK, auto-increment)
  name: String
  slug: String (unique)
  products: Product[]
}
```

**MongoDB (Order domain):**
```
Order {
  userId: String (required)
  email: String (required)
  amount: Number (required)
  status: Enum ["success", "failed"]
  products: [{
    name: String
    quantity: Number
    price: Number
  }]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## 9. Authentication & Authorization

### 9.1 Architecture

**Provider**: Clerk (fully managed identity platform)

| Layer | Integration |
|-------|------------|
| **Client (Next.js)** | `@clerk/nextjs` middleware — all routes, non-blocking |
| **Admin (Next.js)** | `@clerk/nextjs` middleware — role-based (`admin` check via JWT claims) |
| **API Gateway** | `@clerk/express` — per-route authentication based on route config |
| **Auth Service** | `@clerk/express` — admin-only middleware for user management |
| **Product Service** | `@clerk/express` — user authentication for protected endpoints |
| **Order Service** | `@clerk/fastify` — user authentication plugin |
| **Payment Service** | `@hono/clerk-auth` — Hono Clerk middleware |

### 9.2 Role Model

| Role | Access |
|------|--------|
| `user` | Client storefront, order placement, payment |
| `admin` | Admin dashboard, user management, product CRUD, inventory, discounts, analytics |

Roles stored in Clerk JWT session claims: `sessionClaims.metadata.userRole`.

### 9.3 Auth Flow

```
Client/Admin → Clerk (JWT) → API Gateway (verify + forward) → Service (trusts gateway)
```

> **Note**: Services also independently verify Clerk tokens — defense-in-depth, but creates coupling to Clerk across all services. The API Gateway already validates auth; downstream services could trust the gateway's forwarded auth headers instead.

---

## 10. API Gateway Pattern

### 10.1 Middleware Pipeline

```
Request
  → helmet (security headers)
  → CORS (origin whitelist)
  → Body parsing (JSON + URL-encoded)
  → Request logging (winston)
  → Global rate limiting (100 req/60s)
  → Audit middleware (Kafka emission)
  → Health routes (no auth)
  → Proxy routes
    → [if auth required] Clerk middleware → requireAuth
    → http-proxy-middleware → downstream service
  → 404 handler
  → Error handler
```

### 10.2 Cross-Cutting Concerns

| Concern | Implementation |
|---------|---------------|
| **Rate Limiting** | `express-rate-limit` with 4 tiers |
| **CORS** | Configurable origin whitelist (env-driven) |
| **Security Headers** | `helmet` defaults |
| **Logging** | Winston structured logging |
| **Audit Trail** | Kafka-based async audit event emission |
| **Error Handling** | Centralized error handler with 503 for service unavailability |
| **Path Rewriting** | Strips `/api` prefix before proxying |

---

## 11. Dependency Graph

```
                    ┌─────────────────────────┐
                    │    @repo/types           │
                    │  (Zod schemas + types)   │
                    └──┬──────────────┬────────┘
                       │              │
              ┌────────▼──┐    ┌──────▼───────┐
              │@repo/      │    │@repo/         │
              │product-db  │    │order-db       │
              │(Prisma)    │    │(Mongoose)     │
              └──┬─────────┘    └──┬────────────┘
                 │                 │
    ┌────────────┼─────────────────┼──────────────────────┐
    │            │                 │                       │
    │    @repo/kafka          @repo/typescript-config      │
    │            │                                        │
    ▼            ▼                                        ▼
┌────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│api-    │ │product-  │ │order-    │ │payment-  │ │email-    │
│gateway │ │service   │ │service   │ │service   │ │service   │
└────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐ ┌────────┐
│inventory-  │ │discount-   │ │audit-      │ │client  │ │admin   │
│service     │ │service     │ │service     │ │(Next)  │ │(Next)  │
└────────────┘ └────────────┘ └────────────┘ └────────┘ └────────┘
```

**Workspace dependency summary:**

| Package | Depended on by |
|---------|---------------|
| `@repo/kafka` | api-gateway, auth-service, product-service, order-service, payment-service, email-service, inventory-service, audit-service |
| `@repo/types` | auth-service, product-service, order-service, payment-service, email-service, inventory-service, discount-service, audit-service, client, admin |
| `@repo/product-db` | product-service, `@repo/types` |
| `@repo/order-db` | order-service, `@repo/types` |
| `@repo/typescript-config` | All packages and apps |
| `@repo/eslint-config` | client, admin |

---

## 12. Port Allocation Map

| Port | Service | Protocol |
|------|---------|----------|
| 3002 | Client (Next.js) | HTTP |
| 3003 | Admin (Next.js) | HTTP |
| 3004 | Discount Service (Fastify) | HTTP |
| 3005 | Inventory Service (Fastify) | HTTP |
| 3006 | Audit Service (Fastify) | HTTP |
| 4000 | API Gateway (Express) | HTTP |
| 8000 | Product Service (Express) | HTTP |
| 8001 | Order Service (Fastify) | HTTP |
| 8002 | Payment Service (Hono) | HTTP |
| 8003 | Auth Service (Express) | HTTP |
| 9094 | Redpanda Broker 1 | Kafka |
| 9095 | Redpanda Broker 2 | Kafka |
| 9096 | Redpanda Broker 3 | Kafka |
| 5432 | PostgreSQL (default) | PostgreSQL |
| 27017 | MongoDB (default) | MongoDB |

---

## 13. Architectural Patterns & Decisions

### 13.1 Patterns Employed

| Pattern | Implementation |
|---------|---------------|
| **API Gateway** | Centralized reverse proxy with auth, rate limiting, audit |
| **Database-per-Service** | PostgreSQL for products, separate MongoDB databases per service |
| **Event-Driven Architecture** | Kafka for async inter-service communication |
| **CQRS (partial)** | Inventory service maintains materialized read models from events |
| **Saga Pattern (implicit)** | Payment → Order → Email/Inventory flow via event choreography |
| **Strangler Fig (potential)** | API Gateway enables gradual service decomposition |
| **Singleton Pattern** | Prisma and MongoDB connection management |
| **Backend-for-Frontend** | Separate client and admin frontends with different auth requirements |

### 13.2 Technology Justification

| Decision | Rationale |
|----------|-----------|
| **Polyglot frameworks** | Each service uses the best-fit framework for its workload (Hono for lightweight, Fastify for performance, Express for ecosystem) |
| **Redpanda over Kafka** | Drop-in Kafka replacement, simpler ops, no JVM/ZooKeeper dependency |
| **Clerk** | Managed auth eliminates auth service complexity; JWT-based, works across frameworks |
| **Prisma for products** | Relational data with categories; type-safe queries; migration management |
| **Mongoose for orders** | Flexible schema for order variations; embedded subdocuments for products |
| **Turborepo** | Incremental builds, task caching, and dependency-aware orchestration |
| **pnpm** | Efficient disk usage via hard linking, strict dependency resolution |

---

## 14. Risk Assessment & Recommendations

### 14.1 Critical Issues

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Hardcoded Kafka brokers** | High | Broker addresses (`localhost:9094/9095/9096`) are hardcoded in `@repo/kafka/src/client.ts`. Must be configurable via environment variables for deployment beyond localhost. |
| 2 | **No Kafka message retry/DLQ** | High | Consumer errors are caught and logged but messages are not retried or sent to a dead letter queue. Failed events (e.g., failed email sends) are silently lost. |
| 3 | **Missing `await` in `Promise.all`** | High | Multiple services use `Promise.all([await x(), await y()])` which serializes execution instead of parallelizing. Should be `Promise.all([x(), y()])` — in `product-service`, `order-service`, and `payment-service`. |
| 4 | **No service discovery** | Medium | Service URLs are hardcoded/env-configured. No dynamic service discovery mechanism. Acceptable for current scale but blocks horizontal scaling. |
| 5 | **Inconsistent env var names** | Medium | `MONGO_URL` vs `MONGO_URI` across services. Should standardize to one convention. |

### 14.2 Architectural Improvements

| # | Recommendation | Priority | Impact |
|---|---------------|----------|--------|
| 1 | **Externalize Kafka broker config** | P0 | Replace hardcoded brokers with `process.env.KAFKA_BROKERS` in `@repo/kafka/src/client.ts`. |
| 2 | **Add Dead Letter Queue (DLQ)** | P0 | Implement retry logic with exponential backoff and DLQ topic for failed messages in the consumer abstraction. |
| 3 | **Circuit breaker on gateway** | P1 | Add circuit breaker pattern (e.g., `opossum`) to the proxy middleware to prevent cascading failures when downstream services are unhealthy. |
| 4 | **Health check aggregation** | P1 | The gateway's `/health/services` should actively check all downstream service health endpoints and return aggregated status. |
| 5 | **Standardize framework choice** | P2 | Consider converging on Fastify for all backend services — it's already the dominant framework (3 of 6 HTTP services). Reduces cognitive overhead and shared middleware duplication. |
| 6 | **Add OpenTelemetry tracing** | P2 | Distributed tracing across services for observability. Current winston logging is per-service only. |
| 7 | **Schema registry** | P2 | Add Redpanda Schema Registry for Kafka message schema validation and evolution. |
| 8 | **Containerization** | P1 | Only Redpanda has Docker config. All services need Dockerfiles for consistent deployment. |
| 9 | **Fix `@repo/types` main field** | P3 | Correct `"main": "src/index/ts"` to `"src/index.ts"` in `packages/types/package.json`. |
| 10 | **Standardize tsx usage** | P3 | Some services use `pnpm dlx tsx` while others have `tsx` as devDependency. Standardize to direct dependency for consistent startup behavior. |

### 14.3 Security Assessment

| Area | Status | Notes |
|------|--------|-------|
| **Helmet** | ✅ Applied | Gateway applies security headers |
| **CORS** | ⚠️ Partial | Gateway has proper CORS, but some services also apply their own (redundant when accessed through gateway, but necessary for direct access) |
| **Rate Limiting** | ✅ Applied | Multi-tier rate limiting at gateway |
| **Auth** | ✅ Defense-in-depth | Both gateway and services verify Clerk tokens |
| **Input Validation** | ✅ Zod schemas | Shared validation schemas in `@repo/types` |
| **SQL Injection** | ✅ Mitigated | Prisma parameterized queries |
| **NoSQL Injection** | ⚠️ Review needed | Mongoose queries should be audited for user-input sanitization |
| **Secrets Management** | ⚠️ Env files | `.env` files used — no vault integration |
| **Webhook Verification** | ⚠️ Review needed | Stripe webhook signature verification should be confirmed in payment-service |

### 14.4 Scalability Considerations

- **Horizontal scaling**: Services are stateless (auth via JWTs, no server-side sessions). Kafka consumer groups enable horizontal scaling of consumers.
- **Database bottleneck**: Single PostgreSQL instance for products. Consider read replicas for high-traffic product reads.
- **Event ordering**: Kafka partitioning strategy is not configured — default partitioning may not guarantee event ordering per entity.
- **Gateway as single point of failure**: No load balancing or HA for the API Gateway itself. Deploy behind a cloud load balancer for production.

---

*End of Technical Analysis*
