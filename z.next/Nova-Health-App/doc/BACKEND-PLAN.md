# Plan: Nova-Health Backend API with Hono.js + Drizzle ORM

## TL;DR

Build a new `/backend` project at the workspace root using **Hono.js + TypeScript + Drizzle ORM + Zod + PostgreSQL** to implement all REST APIs the Nova-Health frontend expects. The frontend currently makes zero real API calls — all forms use simulated delays and local Zustand state. The backend will implement 28 Drizzle table schemas (matching the existing `schema.sql`), ~50 API endpoints across 12 route groups, JWT auth, Zod request validation, and standardized error handling.

---

## Phase 1: Project Scaffolding & Configuration

**Steps:**

1. Create `/backend` directory at workspace root with Hono.js + TypeScript project structure
2. Initialize `package.json` with dependencies:
   - Runtime: `hono`, `@hono/node-server`, `@hono/zod-validator`
   - ORM: `drizzle-orm`, `drizzle-kit`, `postgres` (pg driver via `postgres` package)
   - Validation: `zod`
   - Auth: `@hono/jwt` (or `hono/jwt`), `bcryptjs`
   - Dev: `typescript`, `tsx`, `@types/node`, `@types/bcryptjs`
3. Create `tsconfig.json` with strict mode, path alias `@/` → `src/`
4. Create `drizzle.config.ts` for Drizzle Kit (migrations, schema path)
5. Create `src/index.ts` — Hono app entry point on port 3000 with CORS for frontend dev server
6. Create `.env.example` with `DATABASE_URL`, `JWT_SECRET`, `PORT`
7. Create `src/lib/env.ts` — Zod-validated environment config

**Relevant files to create:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/drizzle.config.ts`
- `backend/src/index.ts`
- `backend/src/lib/env.ts`
- `backend/.env.example`

---

## Phase 2: Drizzle ORM Schema (28 Tables)

**Steps:**

8. Create `src/db/connection.ts` — PostgreSQL connection using `postgres` driver + Drizzle instance
9. Create `src/db/schema/` — one file per domain, exporting Drizzle table definitions:
   - `users.ts` — `users` table with JSONB columns (`profileData`, `securitySettings`, `preferences`), `user_role` enum
   - `emergency-contacts.ts` — `emergency_contacts`
   - `family.ts` — `family_members`, `family_invitations`, `family_challenges`, `family_rewards` + `family_permission` enum
   - `subscriptions.ts` — `subscription_plans`, `user_subscriptions` + `billing_cycle`, `subscription_status` enums
   - `billing.ts` — `payment_methods`, `invoices`, `payment_transactions` + `invoice_status`, `payment_method_type`, `payment_method_status` enums
   - `health.ts` — `vital_readings`, `symptoms`, `health_plans`, `activity_logs`, `sleep_records` + `symptom_severity` enum
   - `medications.ts` — `medications`, `medication_schedule` + `interaction_severity`, `side_effect_type` enums
   - `documents.ts` — `documents` + `document_type`, `document_status` enums
   - `communication.ts` — `conversations`, `conversation_participants`, `messages` + `message_type` enum
   - `notifications.ts` — `notifications` + `notification_type` enum
   - `devices.ts` — `connected_devices`
   - `appointments.ts` — `appointments`
   - `habits.ts` — `habits`
   - `enterprise.ts` — `support_tickets`, `security_logs`, `system_alerts`, `access_requests` + `alert_severity` enum
   - `index.ts` — barrel re-export all schemas
10. Generate initial Drizzle migration from schemas: `drizzle-kit generate`

**Reference:** All table definitions from `doc/data-model/schema.sql` (lines 1–1100), JSONB schemas from `doc/data-model/jsonb-schemas.json`

---

## Phase 3: Shared Middleware & Utilities

**Steps:**

11. Create `src/middleware/auth.ts` — JWT authentication middleware using Hono's built-in JWT. Extracts `userId` and `role` into context. Skips auth for `/api/auth/*` routes.
12. Create `src/middleware/error-handler.ts` — Global error handler returning `{ error: string, details?: unknown }` with proper HTTP status codes.
13. Create `src/lib/password.ts` — `hashPassword()` / `verifyPassword()` wrappers around bcryptjs.
14. Create `src/lib/response.ts` — Standardized response helpers: `success(data)`, `paginated(data, total, page, limit)`, `created(data)`.
15. Create `src/lib/pagination.ts` — Shared `paginationSchema` (Zod: `page`, `limit` query params) and `getPaginationOffset()` helper.

---

## Phase 4: Zod Validation Schemas

**Steps:**

16. Create `src/validators/` — one file per route group, exporting Zod schemas for request body/params/query:
   - `auth.ts` — `loginSchema`, `registerSchema`, `forgotPasswordSchema`, `verifyMethodSchema`, `verifyCodeSchema`
   - `profile.ts` — `updateProfileSchema`, `emergencyContactSchema`
   - `billing.ts` — `addCardSchema`, `addBankAccountSchema`, `invoiceQuerySchema`
   - `subscriptions.ts` — `subscribePlanSchema`, `billingCycleSchema`
   - `family.ts` — `addFamilyMemberSchema`, `familyInvitationSchema`, `updatePermissionSchema`
   - `health.ts` — `logSymptomSchema`, `vitalReadingSchema`, `activityLogSchema`, `sleepRecordSchema`, `healthPlanSchema`
   - `medications.ts` — `medicationSchema`, `medicationScheduleSchema`
   - `documents.ts` — `documentSchema`, `documentQuerySchema`
   - `communication.ts` — `createConversationSchema`, `sendMessageSchema`
   - `notifications.ts` — `notificationQuerySchema`
   - `enterprise.ts` — `ticketSchema`, `accessRequestSchema`

---

## Phase 5: API Route Implementation (~50 endpoints across 12 groups)

**Steps:**

17. Create `src/routes/auth.ts` — Auth routes (no JWT required):
    - `POST /api/auth/register` — hash password, create user, return token
    - `POST /api/auth/login` — verify credentials, return JWT + user
    - `POST /api/auth/forgot-password` — generate reset token (stub/email)
    - `POST /api/auth/verify-method` — send 2FA code (stub)
    - `POST /api/auth/verify-code` — verify 2FA code, finalize auth
    - `POST /api/auth/refresh` — refresh JWT

18. Create `src/routes/users.ts` — User profile routes:
    - `GET /api/users/me` — get current user profile
    - `PATCH /api/users/me` — update profile fields
    - `GET /api/users/me/emergency-contacts` — list contacts
    - `POST /api/users/me/emergency-contacts` — add contact
    - `DELETE /api/users/me/emergency-contacts/:contactId` — remove contact

19. Create `src/routes/billing.ts` — Billing & payments:
    - `GET /api/billing/summary` — totalExpenses, pendingAmount, insuranceCoverage
    - `GET /api/billing/invoices` — list invoices (filterable by status)
    - `GET /api/billing/invoices/:invoiceId` — invoice detail
    - `GET /api/billing/payment-methods` — list payment methods
    - `POST /api/billing/payment-methods` — add card
    - `POST /api/billing/payment-methods/bank` — add bank account (ACH)
    - `DELETE /api/billing/payment-methods/:methodId` — remove
    - `GET /api/billing/transactions` — payment history (paginated)
    - `POST /api/billing/transactions` — process payment

20. Create `src/routes/subscriptions.ts` — Subscription management:
    - `GET /api/subscriptions/plans` — list available plans
    - `GET /api/subscriptions/current` — get user's current subscription
    - `POST /api/subscriptions` — subscribe or change plan
    - `PATCH /api/subscriptions/current` — update billing cycle / cancel

21. Create `src/routes/family.ts` — Family management:
    - `GET /api/family/members` — list family members
    - `POST /api/family/members` — add member
    - `DELETE /api/family/members/:memberId` — remove member
    - `GET /api/family/members/:memberId` — member health summary
    - `PATCH /api/family/members/:memberId/permissions` — update permission level
    - `GET /api/family/challenges` — list wellness challenges
    - `GET /api/family/rewards` — list rewards

22. Create `src/routes/health.ts` — Health tracking:
    - `GET /api/health/vitals` — vital readings (with date range filter)
    - `POST /api/health/vitals` — record vital reading
    - `GET /api/health/symptoms` — list symptoms (filterable: all/active/resolved)
    - `POST /api/health/symptoms` — log symptom
    - `PATCH /api/health/symptoms/:symptomId` — update/resolve symptom
    - `GET /api/health/activity` — activity logs (paginated, date range)
    - `POST /api/health/activity` — log activity
    - `GET /api/health/sleep` — sleep records (paginated, date range)
    - `POST /api/health/sleep` — log sleep record
    - `GET /api/health/plans` — health plans
    - `GET /api/health/habits` — habit tracker data
    - `PATCH /api/health/habits/:habitId` — update habit (mark complete)

23. Create `src/routes/medications.ts` — Medications:
    - `GET /api/medications` — list medications
    - `GET /api/medications/:medicationId` — medication detail (interactions, history, side effects)
    - `POST /api/medications/:medicationId/refill` — request refill
    - `GET /api/medications/:medicationId/schedule` — daily schedule
    - `PATCH /api/medications/:medicationId/schedule/:scheduleId` — mark taken

24. Create `src/routes/communication.ts` — Chat, documents, reports:
    - `GET /api/conversations` — list conversations (filterable: all/doctors/support)
    - `POST /api/conversations` — create conversation
    - `GET /api/conversations/:conversationId/messages` — messages (paginated)
    - `POST /api/conversations/:conversationId/messages` — send message
    - `GET /api/documents` — list documents (filterable by type)
    - `POST /api/documents` — upload document
    - `GET /api/reports` — health reports (period: weekly/monthly/yearly)

25. Create `src/routes/notifications.ts` — Notifications:
    - `GET /api/notifications` — list (filterable: all/critical/warning/info)
    - `POST /api/notifications/mark-all-read` — mark all as read
    - `DELETE /api/notifications/:notificationId` — delete notification

26. Create `src/routes/devices.ts` — Connected devices:
    - `GET /api/devices` — list connected devices
    - `POST /api/devices` — connect device
    - `PATCH /api/devices/:deviceId` — toggle sync status
    - `DELETE /api/devices/:deviceId` — disconnect

27. Create `src/routes/enterprise.ts` — Enterprise dashboards (role-gated):
    - `GET /api/enterprise/dashboard` — role-based dashboard stats (CS/Manager/Admin)
    - `GET /api/enterprise/tickets` — support tickets (CS agents)
    - `PATCH /api/enterprise/tickets/:ticketId` — update ticket status
    - `GET /api/enterprise/security-logs` — security logs (Admin)
    - `GET /api/enterprise/system-alerts` — system alerts (Admin)
    - `GET /api/enterprise/access-requests` — access requests (Admin)
    - `PATCH /api/enterprise/access-requests/:requestId` — approve/deny

28. Create `src/routes/index.ts` — Mount all route groups onto the Hono app under `/api` prefix

---

## Phase 6: Database Seeding

**Steps:**

29. Create `src/db/seed.ts` — Seed script that populates:
    - Demo user (elena.vance@email.com) with profile data matching frontend mock state
    - 3 subscription plans (daily/monthly/yearly)
    - Emergency contacts, family members, invoices, payment methods
    - Sample vitals, symptoms, medications, notifications
    - Enterprise users (support, manager, admin roles)
    This ensures the frontend works immediately after connecting to the real backend.

---

## Phase 7: Dev Tooling & Scripts

**Steps:**

30. Add `package.json` scripts:
    - `dev` — `tsx watch src/index.ts` (hot reload)
    - `build` — `tsc` to compile
    - `start` — `node dist/index.js`
    - `db:generate` — `drizzle-kit generate`
    - `db:migrate` — `drizzle-kit migrate`
    - `db:push` — `drizzle-kit push` (schema push without migrations)
    - `db:seed` — `tsx src/db/seed.ts`
    - `db:studio` — `drizzle-kit studio` (visual DB browser)

31. Update frontend Vite config to proxy `/api` to `http://localhost:3000` for seamless dev experience

---

## Project Structure

```
backend/
├── .env.example
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│   ├── index.ts                     # Hono app entry, CORS, mount routes
│   ├── lib/
│   │   ├── env.ts                   # Zod-validated env config
│   │   ├── password.ts              # bcrypt hash/verify
│   │   ├── response.ts              # Standardized response helpers
│   │   └── pagination.ts            # Pagination schema + helpers
│   ├── middleware/
│   │   ├── auth.ts                  # JWT auth middleware
│   │   └── error-handler.ts         # Global error handler
│   ├── db/
│   │   ├── connection.ts            # Drizzle + postgres connection
│   │   ├── seed.ts                  # Database seeding script
│   │   └── schema/
│   │       ├── index.ts             # Barrel export
│   │       ├── users.ts             # users table
│   │       ├── emergency-contacts.ts
│   │       ├── family.ts            # family_members, invitations, challenges, rewards
│   │       ├── subscriptions.ts     # subscription_plans, user_subscriptions
│   │       ├── billing.ts           # payment_methods, invoices, payment_transactions
│   │       ├── health.ts            # vital_readings, symptoms, health_plans, activity_logs, sleep_records
│   │       ├── medications.ts       # medications, medication_schedule
│   │       ├── documents.ts         # documents
│   │       ├── communication.ts     # conversations, participants, messages
│   │       ├── notifications.ts     # notifications
│   │       ├── devices.ts           # connected_devices
│   │       ├── appointments.ts      # appointments
│   │       ├── habits.ts            # habits
│   │       └── enterprise.ts        # support_tickets, security_logs, system_alerts, access_requests
│   ├── validators/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── billing.ts
│   │   ├── subscriptions.ts
│   │   ├── family.ts
│   │   ├── health.ts
│   │   ├── medications.ts
│   │   ├── documents.ts
│   │   ├── communication.ts
│   │   ├── notifications.ts
│   │   └── enterprise.ts
│   └── routes/
│       ├── index.ts                 # Mount all route groups
│       ├── auth.ts                  # 6 endpoints
│       ├── users.ts                 # 5 endpoints
│       ├── billing.ts               # 9 endpoints
│       ├── subscriptions.ts         # 4 endpoints
│       ├── family.ts                # 7 endpoints
│       ├── health.ts                # 12 endpoints
│       ├── medications.ts           # 5 endpoints
│       ├── communication.ts         # 7 endpoints
│       ├── notifications.ts         # 3 endpoints
│       ├── devices.ts               # 4 endpoints
│       └── enterprise.ts            # 7 endpoints
└── drizzle/                         # Generated migrations (by drizzle-kit)
```

---

## Relevant Files (existing, for reference)

- `doc/data-model/schema.sql` — Full PostgreSQL DDL (28 tables, enums, indexes, triggers) — use as blueprint for Drizzle schemas
- `doc/data-model/jsonb-schemas.json` — JSON Schema definitions for all JSONB columns — use for Zod validators
- `doc/PROJECT-SUMMARY-FRONTEND.md` — Frontend architecture overview, 6 Zustand stores, routing map
- `frontend/src/lib/api.ts` — Axios client (`baseURL: '/api'`, 10s timeout) — backend must serve all routes under `/api`
- `frontend/src/store/*.ts` — 6 Zustand stores define exact data shapes the frontend expects
- `frontend/vite.config.ts` — needs proxy config update for dev server

---

## Verification

1. `pnpm install` completes without errors in `/backend`
2. `pnpm db:generate` produces migration files matching the 28-table schema
3. `pnpm db:push` applies schema to local PostgreSQL without errors
4. `pnpm dev` starts Hono server on port 3000, serves `/api` routes
5. `pnpm db:seed` populates demo data matching frontend mock state
6. Frontend proxy (`/api` → `localhost:3000`) works: login form reaches backend
7. `POST /api/auth/register` + `POST /api/auth/login` return JWT tokens
8. `GET /api/users/me` with JWT returns profile matching `useProfileStore` shape
9. `GET /api/billing/invoices` returns data matching `useBillingStore` shape
10. All route groups return 200 for GET endpoints with seeded data
11. TypeScript compilation (`pnpm build`) passes with zero errors

---

## Decisions

- **Use `/api/users/me` instead of `/api/users/:userId`** — cleaner, JWT carries user identity. Frontend currently uses local stores; transitioning to `me` endpoints avoids exposing user IDs in URLs.
- **Keep JSONB columns for flexible nested data** — matches existing `schema.sql` design, avoids over-normalizing rarely-queried fields.
- **JWT stored in httpOnly cookie** (not localStorage) — OWASP secure auth pattern. Frontend axios interceptor will send cookies automatically.
- **Role-based middleware** for enterprise routes — only `support`, `manager`, `admin` roles can access `/api/enterprise/*`.
- **Pagination default** — `page=1, limit=20` for all list endpoints.
- **Excluded from scope**: WebSocket real-time chat (implement REST first, WebSocket can be added later), file upload storage (stub with local filesystem, S3 integration deferred), email/SMS delivery for 2FA (stub responses).
- **Typo fix**: `schema.sql` has `user_role` enum with `'clent'` — fix to `'client'` in Drizzle schema.
