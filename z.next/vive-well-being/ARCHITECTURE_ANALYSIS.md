# Vive Well-Being Monorepo — Architecture Analysis

## Architecture Overview

```
vive-well-being/
├── apps/
│   ├── web/        → Hub portal (port 3000, TanStack Router, MUI+Tailwind)
│   └── health/     → Standalone health app (port 3001, React Router, Vite lib build)
├── services/
│   ├── health-service/     → Hono API (port 3002, PostgreSQL, better-auth)
│   └── notification-service/ → Hono + RabbitMQ + MongoDB
└── packages/
    ├── auth/       → better-auth shared config (Hono/Express/Fastify adapters)
    ├── database/   → Drizzle ORM schemas (Postgres + Mongo)
    ├── kafka/      → Kafka messaging utilities
    ├── notificationDB/ → MongoDB notification schema
    ├── types/      → (empty directory — should have shared types)
    └── ui/         → Shared UI components
```

---

## How Web Hub Uses the Health Frontend

The integration model is **duplicated pages with separate implementations**, NOT an embedded micro-frontend:

1. **Web hub (`apps/web`)** has its own health pages at `src/features/health/`:
   - `HealthPage.tsx` — Dashboard summary (calls `/api/dashboard/summary` directly)
   - `HealthCalendarPage.tsx` — Placeholder that links to `http://localhost:3001/calendar`
   - `HealthDocumentsPage.tsx` — Placeholder that links to `http://localhost:3001/documents`

2. **Health app (`apps/health`)** is a full standalone SPA with:
   - Its own routing, Zustand stores, API layer, and rich UI (charts, CRUD tables, forms)
   - An `embed.tsx` entry point designed to be built as a library (`vite.config.ts`) — but the web hub **does not use it**
   - Vite dev proxy configured to forward `/api` → `http://localhost:3002` (health-service)

3. **The web hub does NOT import or embed the health app**. Instead it:
   - Reimplements a minimal dashboard summary inline in `HealthPage.tsx`
   - Redirects users to the standalone app (`localhost:3001`) for Calendar and Documents

---

## Issues Found

### Critical Issues

| # | Issue | Location | Details |
|---|-------|----------|---------|
| 1 | **Web hub has no API proxy to health-service** | `apps/web/vite.config.ts` | The health app proxies `/api` → `localhost:3002`, but the web hub (`apps/web`) has **no proxy configured**. Its `api.ts` uses `baseURL: '/api'`, so calls like `api.get('/dashboard/summary')` will 404 in dev — no backend is reachable. |
| 2 | **Hardcoded localhost links in web hub** | `HealthCalendarPage.tsx:11`, `HealthDocumentsPage.tsx:11` | The placeholder pages hardcode `http://localhost:3001/calendar` and `/documents`. This breaks in any non-local environment (staging, production). |
| 3 | **Auth token mismatch** | `apps/web/src/lib/auth.ts` vs `apps/health/src/lib/auth.ts` | Both apps create `better-auth` clients, but the web hub stores auth via `zustand/persist` under `auth-storage` key, while the API interceptor reads from `localStorage.getItem('auth_token')`. better-auth manages its own session cookies — the `Authorization: Bearer` header with `auth_token` from localStorage is **never set by either app's login flow**. The health app's auth client points to `VITE_AUTH_URL` (defaulting to its own origin), but auth is handled by the health-service at port 3002. |

### Architecture Issues

| # | Issue | Details |
|---|-------|---------|
| 4 | **`packages/types/` is empty** | The `types` package directory exists but has no files. Both apps define duplicate TypeScript types independently (`apps/health/src/types/index.ts` defines Medication, Appointment, etc.) — these should be in the shared package. |
| 5 | **Health embed (`embed.tsx`) is unused** | The health app builds as a library with `embed.tsx` as the entry point, providing `HealthDashboardEmbed` as a component meant for consumption by the web hub. But the web hub never imports it — it reimplements simplified pages instead. This is wasted build complexity. |
| 6 | **Inconsistent auth architecture** | The health-service uses `@vive/auth/hono` middleware which reads better-auth session cookies. The frontend interceptors add `Authorization: Bearer` headers from `localStorage`. These are **two different auth mechanisms** — better-auth uses cookie-based sessions by default, not Bearer tokens. The interceptors may be redundant or conflicting. |
| 7 | **Missing `VITE_HEALTH_API_URL` in web hub** | The health app's API reads `VITE_HEALTH_API_URL` with fallback to `/api`. The web hub's `api.ts` hardcodes `/api` with no env override. In production, the web hub cannot point to the health-service without a reverse proxy. |

### Minor Issues

| # | Issue | Details |
|---|-------|---------|
| 8 | **Duplicate sub-navigation** | The `HealthSubNav` component is duplicated between `HealthCalendarPage.tsx` and `HealthDocumentsPage.tsx` (identical code). |
| 9 | **Health app `build` config conflict** | `vite.config.ts` sets `build.lib` with `embed.tsx` as entry, which means `vite build` produces a library bundle, not a deployable SPA. Running `tsc -b && vite build` won't produce the standalone app — only the embed library. |
| 10 | **No CORS for production** | Health-service CORS defaults to `localhost:3000` and `localhost:3001` only. No production origins are configured. |

---

## Summary

The web hub and health frontend are **loosely coupled** — they're two separate SPAs that share the same backend (health-service). The web hub provides a thin health dashboard by directly calling the same API, but delegates Calendar and Documents to the standalone health app via hardcoded localhost links. The `embed.tsx` micro-frontend capability exists but is completely unused.

The **most impactful issues** are:
1. The web hub lacks a dev proxy to the health-service causing API calls to fail
2. Auth token management doesn't align between the better-auth cookie sessions and the Bearer token interceptors
3. The hardcoded `localhost:3001` links make the web hub's Calendar/Documents pages non-functional outside local development
