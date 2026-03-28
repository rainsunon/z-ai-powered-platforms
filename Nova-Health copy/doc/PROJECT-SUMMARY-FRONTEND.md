# Nova-Health Project Summary & Data Model

## Project Summary

**Nova-Health** is a healthcare SPA built with **React 18 + TypeScript + Vite + Tailwind CSS + Zustand**. It has a Material Design 3 green theme ("Luminous Sanctuary") with two layout systems:

| Domain | Features |
|---|---|
| **Auth** | Login (with role selector), Register, Forgot Password, 2FA verify flow |
| **Patient Dashboard** | Vitals (HR, BP, SpO2, Blood Oxygen), family health cards, prescriptions, AI wisdom, quick connect |
| **Health Tracking** | Symptoms, Vitals, Sleep, Activity, Habits, Goals, Daily Schedule, Health Plan, Data Sync (device integration) |
| **Medications** | Schedules, prescriptions, refills, drug interactions, side effects, history |
| **Billing** | Invoices, payment methods (card + ACH bank), payment history, installments, subscriptions (Daily/Monthly/Yearly plans) |
| **Family** | Members, permissions, health summaries, wellness challenges, rewards/milestones |
| **Communication** | Doctor chat, consultations, support tickets, medical documents/records, reports |
| **Notifications** | Critical/warning/info alerts with action buttons |
| **Enterprise** | 3 role-based dashboards: Customer Service (tickets/chats), Manager (KPIs/revenue/AI insights), Admin (servers/security/access) |

**6 Zustand stores** manage state: Auth, Profile, Billing, Subscription, Family, Notifications.

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Material Design 3 color tokens)
- **State Management:** Zustand (6 stores)
- **Routing:** React Router v6 (lazy-loaded routes)
- **Forms:** react-hook-form + Zod validation
- **HTTP Client:** Axios (`/api` base URL)
- **Fonts:** Manrope (headline), Public Sans (body/label)
- **Icons:** Material Symbols Outlined (Google)
- **i18n:** i18next (English + Chinese)
- **Path Alias:** `@/` → `src/`

---

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx                    # Root routing (lazy-loaded)
│   ├── main.tsx                   # Entry point
│   ├── i18n.js                    # i18next config
│   ├── index.css                  # Tailwind + global styles
│   ├── components/
│   │   ├── Layout.tsx             # Patient layout (sidebar + topbar + mobile nav)
│   │   ├── EnterpriseLayout.tsx   # Enterprise layout (sidebar + topbar)
│   │   ├── Sidebar.tsx            # Patient sidebar navigation
│   │   ├── Topbar.tsx             # Patient top bar
│   │   ├── ui/                    # shadcn/ui primitives (30+ components)
│   │   └── ...                    # Shared components (modals, cards, etc.)
│   ├── features/
│   │   ├── auth/                  # Login, Register, ForgotPassword, Verify*
│   │   ├── billing/               # Billing, Payments, Subscription (15 pages)
│   │   ├── communication/         # Chat, Consultation, Support, Documents, Reports
│   │   ├── dashboard/             # Dashboard + sub-components
│   │   ├── enterprise/            # CustomerService, Manager, Admin dashboards
│   │   ├── family/                # FamilyHealth, Members, Permissions, Challenges, Rewards
│   │   ├── health/                # Symptoms, Vitals, Sleep, Activity, Goals, DataSync, etc.
│   │   ├── medications/           # Medications, MedicationDetail
│   │   ├── notifications/         # Notifications page
│   │   └── profile/               # Profile (Personal, Security, Preferences tabs)
│   ├── store/
│   │   ├── useAuthStore.ts        # Auth + role switching (patient/CS/manager/admin)
│   │   ├── useProfileStore.ts     # Profile + emergency contacts
│   │   ├── useBillingStore.ts     # Invoices + billing stats
│   │   ├── useSubscriptionStore.ts # Plans + billing cycle
│   │   ├── useFamilyStore.ts      # Family members
│   │   └── useNotificationStore.ts # Notifications + filters
│   ├── hooks/                     # use-mobile, useGoBack, usePageTitle
│   ├── lib/
│   │   ├── api.ts                 # Axios instance (/api, 10s timeout)
│   │   └── utils.ts               # cn() + helpers
│   ├── locales/                   # en.json, zh.json
│   └── pages/
│       └── PlaceholderPage.tsx    # Placeholder for unimplemented routes
└── data-model/
    ├── schema.sql                 # PostgreSQL DDL (28 tables)
    └── jsonb-schemas.json         # JSON Schema for all JSONB columns
```

---

## Zustand Stores

### useAuthStore
```typescript
UserRole: 'client' | 'support' | 'manager' | 'admin'
State: { isAuthenticated, user: { name, email, avatar, role, title } }
Actions: login(email, role?), logout(), switchRole(role)
```

### useProfileStore
```typescript
UserProfile: { fullName, dateOfBirth, gender, bloodType, height, weight, memberId, memberSince, email, phone, address, timezone }
EmergencyContact: { id, name, relationship, phone, isPrimary }
Actions: updateProfile(data), addEmergencyContact(contact), removeEmergencyContact(id)
```

### useBillingStore
```typescript
Invoice: { id, title, date, amount, status: 'overdue'|'pending'|'paid', icon }
State: { invoices[], totalExpenses, pendingAmount, insuranceCoverage }
Actions: setInvoices(invoices)
```

### useSubscriptionStore
```typescript
Plan: { id, name, price, period, features[], savingsNote? }
State: { currentPlanId, billingCycle: 'monthly'|'yearly', plans[] }
Actions: setBillingCycle(cycle), selectPlan(planId)
```

### useFamilyStore
```typescript
FamilyMember: { id, name, age, role, avatar, color, gradient, bloodType, heartRate, sleep, steps, bp, wellness, lastSync, status, lastCheckup, vaccination }
Actions: addMember(member), removeMember(id)
```

### useNotificationStore
```typescript
Notification: { id, type: 'critical'|'warning'|'info', title, message, time, read, icon, actions[]? }
State: { notifications[], filter: 'all'|'critical'|'warning'|'info' }
Actions: setFilter(filter), markAllRead(), deleteNotification(id)
```

---

## Form Data Inventory

| Form | Location | Zod Schema Fields |
|---|---|---|
| **Login** | `features/auth/Login.tsx` | email (email), password (min 6), role selector (UI only) |
| **Register** | `features/auth/Register.tsx` | name (min 2), email (email), dateOfBirth (date), password (min 6) |
| **Forgot Password** | `features/auth/ForgotPassword.tsx` | email (email) |
| **Add Payment Card** | `features/billing/AddPaymentMethod.tsx` | cardholderName, cardNumber, expiryDate, cvv, street, city, postalCode, isPrimary |
| **Add Bank Account** | `features/billing/AddBankAccount.tsx` | accountHolderName, routingNumber, accountNumber |
| **Emergency Contact** | `components/AddEmergencyContactModal.tsx` | name, relationship, phone, isPrimary |
| **Log Symptoms** | `components/LogSymptomsModal.tsx` | symptom name, severity, description |

---

## Routing Map

### Patient Layout (`/`)
| Path | Component |
|---|---|
| `/` | Dashboard |
| `/symptoms` | Symptoms |
| `/sleep` | SleepData |
| `/activity` | ActivityTracking |
| `/vitals` | VitalsTracking |
| `/goals` | GoalManagement |
| `/schedule` | DailySchedule |
| `/health-plan` | HealthPlan |
| `/habits` | HabitTracker |
| `/sync` | DataSync |
| `/medications` | Medications |
| `/medications/detail` | MedicationDetail |
| `/billing` | Billing |
| `/billing/detail` | BillingDetail |
| `/billing/history` | PaymentHistory |
| `/billing/methods` | PaymentMethods |
| `/billing/methods/add-card` | AddPaymentMethod |
| `/billing/methods/add-bank` | AddBankAccount |
| `/billing/methods/verify-ach` | ACHVerification |
| `/billing/methods/bank-success` | BankLinkedSuccess |
| `/billing/methods/success` | PaymentMethodSuccess |
| `/billing/bulk-pay/*` | BulkPayment flows |
| `/billing/payment-confirmed` | PaymentPlanConfirmed |
| `/billing/payment-failed` | PaymentFailed |
| `/subscription` | Subscription |
| `/family` | FamilyHealth |
| `/family/members` | FamilyMembers |
| `/family/permissions` | FamilyPermissions |
| `/family/permissions/:memberId` | FamilyPermissionDetail |
| `/family/health-summary/:memberId` | FamilyHealthSummary |
| `/family/challenges` | FamilyWellnessChallenge |
| `/family/rewards` | FamilyRewards |
| `/family/milestone` | MilestoneAchieved |
| `/family/reward-redeemed` | RewardRedeemed |
| `/consultation` | Consultation |
| `/support` | Support |
| `/documents` | Documents |
| `/reports` | Reports |
| `/chat` | Chat |
| `/profile` | Profile |
| `/notifications` | Notifications |
| `/appointments` | PlaceholderPage |
| `/settings` | PlaceholderPage |

### Auth (no layout)
| Path | Component |
|---|---|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | ForgotPassword |
| `/verify-method` | VerifyMethod |
| `/verify-code` | VerifyCode |
| `/verify-success` | VerifySuccess |

### Enterprise Layout (`/enterprise`)
| Path | Component |
|---|---|
| `/enterprise` | EnterpriseOverview (role-based) |
| `/enterprise/users` | PlaceholderPage |
| `/enterprise/records` | PlaceholderPage |
| `/enterprise/tickets` | PlaceholderPage |
| `/enterprise/security` | PlaceholderPage |
| `/enterprise/finance` | PlaceholderPage |
| `/enterprise/settings` | PlaceholderPage |

---

## Data Model (PostgreSQL + JSONB)

### Design Principles
- **Relational columns** for indexed/queryable fields (email, status, dates, FKs)
- **JSONB columns** for flexible nested form data that varies per entity
- Every JSONB column has a documented schema in `data-model/jsonb-schemas.json`
- Full DDL in `data-model/schema.sql`

### Table Overview (28 tables)

| # | Table | JSONB Columns | Frontend Source |
|---|---|---|---|
| 1 | `users` | `profile_data`, `security_settings`, `preferences` | useProfileStore, Profile tabs |
| 2 | `emergency_contacts` | — | Profile emergency contacts |
| 3 | `family_members` | `health_snapshot`, `display_settings` | useFamilyStore |
| 4 | `family_invitations` | — | Family invites |
| 5 | `subscription_plans` | `plan_details` | useSubscriptionStore |
| 6 | `user_subscriptions` | — | Subscription page |
| 7 | `payment_methods` | `method_data` | AddPaymentMethod / AddBankAccount forms |
| 8 | `invoices` | `invoice_data` | useBillingStore |
| 9 | `payment_transactions` | `transaction_data` | PaymentHistory |
| 10 | `vital_readings` | `extended_data` | VitalsTracking + Dashboard |
| 11 | `symptoms` | `symptom_data` | Symptoms page |
| 12 | `medications` | `medication_data` | MedicationDetail |
| 13 | `medication_schedule` | — | Medication time slots |
| 14 | `health_plans` | `plan_data` | HealthPlan phases/goals/metrics |
| 15 | `activity_logs` | `activity_data` | ActivityTracking |
| 16 | `sleep_records` | `sleep_data` | SleepData |
| 17 | `documents` | `document_data` | Documents page |
| 18 | `conversations` | `conversation_data` | Chat |
| 19 | `conversation_participants` | — | Chat join table |
| 20 | `messages` | `message_data` | Chat messages + attachments |
| 21 | `notifications` | `notification_data` | useNotificationStore |
| 22 | `connected_devices` | `device_data` | DataSync page |
| 23 | `appointments` | `appointment_data` | Appointments |
| 24 | `habits` | `habit_data` | HabitTracker |
| 25 | `family_challenges` | `challenge_data` | FamilyWellnessChallenge |
| 26 | `family_rewards` | `reward_data` | FamilyRewards |
| 27 | `support_tickets` | `ticket_data` | Enterprise CS Dashboard |
| 28 | `security_logs` / `system_alerts` / `access_requests` | `log_data` / `alert_data` / `request_data` | Enterprise Admin Dashboard |

### Entity Relationship Diagram (Simplified)

```
users (1) ──── (N) emergency_contacts
  │
  ├──── (N) family_members ──── (N) family_rewards
  │           │
  │           └──── family_challenges
  │
  ├──── (1) user_subscriptions ──── subscription_plans
  │
  ├──── (N) payment_methods
  │
  ├──── (N) invoices ──── (N) payment_transactions
  │
  ├──── (N) vital_readings
  │
  ├──── (N) symptoms
  │
  ├──── (N) medications ──── (N) medication_schedule
  │
  ├──── (N) health_plans
  │
  ├──── (N) activity_logs
  │
  ├──── (N) sleep_records
  │
  ├──── (N) documents
  │
  ├──── (N) conversations ──── conversation_participants
  │           │                     │
  │           └──── (N) messages    │
  │                                 │
  ├──── (N) notifications           │
  │                                 │
  ├──── (N) connected_devices       │
  │                                 │
  ├──── (N) appointments ───────────┘
  │
  ├──── (N) habits
  │
  ├──── (N) support_tickets (enterprise)
  │
  ├──── (N) security_logs (enterprise)
  │
  └──── (N) access_requests (enterprise)

system_alerts (standalone, enterprise)
```

### JSONB Column Examples

#### users.profile_data
```json
{
  "bloodType": "O+",
  "height": "5'7\"",
  "weight": "138 lbs",
  "address": {
    "street": "482 Greenfield Lane",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "country": "US"
  },
  "memberSince": "2023-01-15"
}
```

#### payment_methods.method_data (credit card)
```json
{
  "cardholderName": "Elena Vance",
  "lastFourDigits": "4242",
  "cardNetwork": "Visa",
  "expiryDate": "12/26",
  "billingAddress": {
    "street": "482 Greenfield Lane",
    "city": "Austin",
    "postalCode": "78701"
  },
  "tokenRef": "tok_xxxxxxxxxxxx"
}
```

#### medications.medication_data
```json
{
  "interactions": [
    {
      "medicationName": "Potassium Supplements",
      "severity": "high",
      "description": "May cause dangerous increase in potassium levels"
    }
  ],
  "sideEffects": {
    "common": ["Dizziness", "Dry Cough", "Fatigue"],
    "serious": ["Angioedema", "Hyperkalemia"]
  },
  "history": [
    {
      "date": "2024-03-15",
      "change": "Initial prescription",
      "provider": "Dr. Sarah Chen",
      "dosage": "10mg"
    }
  ],
  "nextRefill": "2024-11-15",
  "adherenceRate": 92
}
```

#### health_plans.plan_data
```json
{
  "phases": [
    {
      "phase": 1,
      "title": "Foundation",
      "status": "completed",
      "duration": "Weeks 1–4",
      "goals": [
        { "title": "Establish morning routine", "completed": true },
        { "title": "Track nutrition for 7 consecutive days", "completed": true }
      ]
    }
  ],
  "weeklyFocus": [
    { "day": "Monday", "focus": "Cardio + Meal Prep", "icon": "directions_run" }
  ],
  "metrics": [
    { "label": "Weight", "value": "168 lbs", "change": "-4 lbs", "trend": "down" }
  ]
}
```

#### notifications.notification_data
```json
{
  "actions": [
    { "label": "Call Doctor", "variant": "primary", "href": "/consultation" },
    { "label": "View Vitals", "variant": "secondary", "href": "/vitals" }
  ],
  "relatedEntity": { "type": "vital_reading", "id": "uuid-here" },
  "expiresAt": "2024-10-26T00:00:00Z"
}
```

---

## Files Reference

| File | Description |
|---|---|
| `data-model/schema.sql` | Full PostgreSQL DDL — 28 tables, enums, indexes, triggers |
| `data-model/jsonb-schemas.json` | JSON Schema definitions for every JSONB column |
