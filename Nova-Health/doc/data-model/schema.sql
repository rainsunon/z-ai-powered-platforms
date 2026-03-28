-- =============================================================================
-- Nova-Health PostgreSQL Data Model
-- =============================================================================
-- Generated from frontend analysis. Uses JSONB for flexible/nested form data,
-- relational columns for indexed/queryable fields.
-- =============================================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('clent', 'support', 'manager', 'admin');
CREATE TYPE invoice_status AS ENUM ('overdue', 'pending', 'paid');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'paused');
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'bank_account');
CREATE TYPE payment_method_status AS ENUM ('active', 'expiring_soon', 'expired');
CREATE TYPE notification_type AS ENUM ('critical', 'warning', 'info');
CREATE TYPE symptom_severity AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE document_type AS ENUM ('labs', 'prescriptions', 'imaging', 'reports');
CREATE TYPE document_status AS ENUM ('reviewed', 'archived', 'pending');
CREATE TYPE family_permission AS ENUM ('full_access', 'limited_access', 'view_only');
CREATE TYPE message_type AS ENUM ('text', 'file', 'image');
CREATE TYPE interaction_severity AS ENUM ('high', 'moderate', 'safe');
CREATE TYPE side_effect_type AS ENUM ('common', 'serious');
CREATE TYPE alert_severity AS ENUM ('warning', 'error', 'info');

-- ═════════════════════════════════════════════════════════════════════════════
-- 1. USERS (core identity + profile JSONB)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    member_id       VARCHAR(50) UNIQUE NOT NULL DEFAULT ('NXH-' || lpad(floor(random()*99999)::text, 5, '0')),
    role            user_role NOT NULL DEFAULT 'patient',
    avatar_url      TEXT,

    -- Indexed queryable profile fields
    date_of_birth   DATE,
    gender          VARCHAR(20),
    phone           VARCHAR(30),
    timezone        VARCHAR(50) DEFAULT 'UTC',

    -- JSONB: flexible profile form data (height, weight, blood type, address, etc.)
    -- Matches frontend useProfileStore shape
    profile_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      profile_data JSONB schema:
      {
        "bloodType":    "O+",
        "height":       "5'7\"",
        "weight":       "138 lbs",
        "address": {
          "street":     "482 Greenfield Lane",
          "city":       "Austin",
          "state":      "TX",
          "zipCode":    "78701",
          "country":    "US"
        },
        "memberSince":  "2023-01-15"
      }
    */

    -- JSONB: security preferences from profile Security tab
    security_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      security_settings JSONB schema:
      {
        "twoFactorEnabled":     true,
        "lastPasswordChange":   "2024-10-11T00:00:00Z",
        "activeSessions":       2,
        "dataPrivacy": {
          "shareWithProviders":   true,
          "anonymousAnalytics":   false
        }
      }
    */

    -- JSONB: user preferences from profile Preferences tab
    preferences     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      preferences JSONB schema:
      {
        "language":             "en",
        "theme":                "light",
        "notifications": {
          "email":              true,
          "push":               true,
          "sms":                false
        },
        "accessibility": {
          "highContrast":       false,
          "fontSize":           "medium"
        }
      }
    */

    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_member_id ON users (member_id);
CREATE INDEX idx_users_profile_blood_type ON users USING GIN ((profile_data -> 'bloodType'));

-- ═════════════════════════════════════════════════════════════════════════════
-- 2. EMERGENCY CONTACTS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE emergency_contacts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    relationship    VARCHAR(100) NOT NULL,
    phone           VARCHAR(30) NOT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_emergency_contacts_user ON emergency_contacts (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 3. FAMILY MEMBERS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE family_members (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    linked_user_id      UUID REFERENCES users(id) ON DELETE SET NULL,   -- nullable; linked if they have their own account
    name                VARCHAR(255) NOT NULL,
    age                 INT,
    family_role         VARCHAR(100),        -- 'Account Owner', 'Teen Member', 'Child Member', 'Spouse'
    permission_level    family_permission NOT NULL DEFAULT 'view_only',

    -- JSONB: health snapshot (updated by sync)
    health_snapshot     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      health_snapshot JSONB schema:
      {
        "bloodType":      "A+",
        "heartRate":      72,
        "sleep":          7.5,
        "steps":          8200,
        "bloodPressure":  "118/76",
        "wellness":       87,
        "lastSync":       "2024-10-25T14:30:00Z",
        "status":         "Excellent",
        "lastCheckup":    "2024-10-12",
        "vaccination":    "Up to date"
      }
    */

    -- JSONB: UI display preferences
    display_settings    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      display_settings JSONB schema:
      {
        "avatar":   "face_4",
        "color":    "bg-primary",
        "gradient": "from-primary to-primary/70"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_family_members_owner ON family_members (account_owner_id);
CREATE INDEX idx_family_members_health ON family_members USING GIN (health_snapshot);

-- ═════════════════════════════════════════════════════════════════════════════
-- 4. FAMILY INVITATIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE family_invitations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inviter_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_name    VARCHAR(255) NOT NULL,
    invitee_email   VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, accepted, declined, expired
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at    TIMESTAMPTZ
);

CREATE INDEX idx_family_invitations_inviter ON family_invitations (inviter_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 5. SUBSCRIPTION PLANS (reference table)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE subscription_plans (
    id              VARCHAR(50) PRIMARY KEY,       -- 'daily', 'monthly', 'yearly'
    name            VARCHAR(100) NOT NULL,
    price_monthly   NUMERIC(10, 2) NOT NULL,
    price_yearly    NUMERIC(10, 2),
    period_label    VARCHAR(20) NOT NULL,          -- '/day', '/month', '/year'

    -- JSONB: feature list + savings note
    plan_details    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      plan_details JSONB schema:
      {
        "features":     ["Basic Health Sync", "Ad-free Experience"],
        "savingsNote":  "SAVE $58 ANNUALLY",
        "tier":         "premium"
      }
    */

    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═════════════════════════════════════════════════════════════════════════════
-- 6. USER SUBSCRIPTIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE user_subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id         VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
    billing_cycle   billing_cycle NOT NULL DEFAULT 'monthly',
    status          subscription_status NOT NULL DEFAULT 'active',
    current_price   NUMERIC(10, 2) NOT NULL,
    start_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date        DATE,
    auto_renew      BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON user_subscriptions (user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions (status);

-- ═════════════════════════════════════════════════════════════════════════════
-- 7. PAYMENT METHODS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE payment_methods (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method_type     payment_method_type NOT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT false,
    status          payment_method_status NOT NULL DEFAULT 'active',

    -- JSONB: card/bank form data (sensitive fields are tokenized, not raw)
    method_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      Credit Card method_data JSONB schema:
      {
        "cardholderName":   "Elena Vance",
        "lastFourDigits":   "4242",
        "cardNetwork":      "Visa",
        "expiryDate":       "12/26",
        "billingAddress": {
          "street":         "482 Greenfield Lane",
          "city":           "Austin",
          "postalCode":     "78701"
        },
        "tokenRef":         "tok_xxxxxxxxxxxx"
      }

      Bank Account method_data JSONB schema:
      {
        "accountHolderName":  "Elena Vance",
        "lastFourDigits":     "8812",
        "bankName":           "Chase",
        "accountType":        "checking",
        "routingLastFour":    "6789",
        "verified":           true,
        "tokenRef":           "ba_xxxxxxxxxxxx"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_methods_user ON payment_methods (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 8. INVOICES
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE invoices (
    id              VARCHAR(50) PRIMARY KEY,        -- 'NH-89230'
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    amount          NUMERIC(12, 2) NOT NULL,
    status          invoice_status NOT NULL DEFAULT 'pending',
    due_date        DATE,
    paid_at         TIMESTAMPTZ,

    -- JSONB: line items, insurance breakdown, provider info
    invoice_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      invoice_data JSONB schema:
      {
        "lineItems": [
          { "description": "Dental Cleaning", "amount": 300.00 },
          { "description": "X-Ray", "amount": 125.00 }
        ],
        "insuranceCoverage": 85,
        "insuranceAmount":   361.25,
        "patientResponsibility": 63.75,
        "provider": {
          "name":      "Dr. Williams",
          "facility":  "Austin Dental Center",
          "npi":       "1234567890"
        },
        "fiscalYear": "2024",
        "icon":       "warning"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_user ON invoices (user_id);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_invoices_due_date ON invoices (due_date);

-- ═════════════════════════════════════════════════════════════════════════════
-- 9. PAYMENT TRANSACTIONS (payment history)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE payment_transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_id          VARCHAR(50) REFERENCES invoices(id),
    payment_method_id   UUID REFERENCES payment_methods(id),
    amount              NUMERIC(12, 2) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'completed',  -- completed, failed, refunded

    -- JSONB: transaction metadata
    transaction_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      transaction_data JSONB schema:
      {
        "transactionRef":   "txn_abc123",
        "processorResponse": "approved",
        "failureReason":     null,
        "installmentInfo": {
          "planTotal":       1200.00,
          "installmentNumber": 3,
          "totalInstallments": 6
        }
      }
    */

    paid_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user ON payment_transactions (user_id);
CREATE INDEX idx_transactions_invoice ON payment_transactions (invoice_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 10. VITAL READINGS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE vital_readings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_date    DATE NOT NULL,

    -- Indexed numeric vitals for time-series queries
    heart_rate      INT,             -- bpm
    systolic        INT,             -- mmHg
    diastolic       INT,             -- mmHg
    spo2            INT,             -- percent
    temperature     NUMERIC(5, 1),   -- fahrenheit

    -- JSONB: additional/extended vital data (blood oxygen trends, HRV, etc.)
    extended_data   JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      extended_data JSONB schema:
      {
        "bloodOxygen": {
          "value":    98,
          "trend":    "stable",
          "history":  [97, 98, 98, 97, 98]
        },
        "hrv": {
          "value":    45,
          "trend":    "improving"
        },
        "respiratoryRate": 16,
        "source": "apple_health"
      }
    */

    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vitals_user_date ON vital_readings (user_id, reading_date DESC);
CREATE INDEX idx_vitals_heart_rate ON vital_readings (heart_rate) WHERE heart_rate IS NOT NULL;

-- ═════════════════════════════════════════════════════════════════════════════
-- 11. SYMPTOMS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE symptoms (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    severity        symptom_severity NOT NULL DEFAULT 'mild',
    is_resolved     BOOLEAN NOT NULL DEFAULT false,
    onset_date      DATE NOT NULL,
    resolved_date   DATE,

    -- JSONB: symptom details, notes, related conditions
    symptom_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      symptom_data JSONB schema:
      {
        "description":      "Recurring morning headache, mainly frontal",
        "triggers":         ["lack of sleep", "dehydration"],
        "relatedConditions": ["migraine"],
        "aiInsight":        "Possible correlation with reduced sleep quality",
        "bodyArea":         "head"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_symptoms_user ON symptoms (user_id);
CREATE INDEX idx_symptoms_severity ON symptoms (severity);
CREATE INDEX idx_symptoms_resolved ON symptoms (is_resolved);

-- ═════════════════════════════════════════════════════════════════════════════
-- 12. MEDICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE medications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    dosage          VARCHAR(100) NOT NULL,
    medication_type VARCHAR(50),              -- 'Tablet', 'Capsule', 'Injection'
    rx_number       VARCHAR(100),
    quantity         INT,
    refills_remaining INT DEFAULT 0,
    prescribed_by   VARCHAR(255),
    prescribed_date DATE,
    expires_at      DATE,
    is_active       BOOLEAN NOT NULL DEFAULT true,

    -- JSONB: interactions, side effects, history
    medication_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      medication_data JSONB schema:
      {
        "interactions": [
          {
            "medicationName": "Potassium Supplements",
            "severity":       "high",
            "description":    "May cause dangerous increase in potassium levels"
          }
        ],
        "sideEffects": {
          "common":  ["Dizziness", "Dry Cough", "Fatigue"],
          "serious": ["Angioedema", "Hyperkalemia"]
        },
        "history": [
          {
            "date":     "2024-03-15",
            "change":   "Initial prescription",
            "provider": "Dr. Sarah Chen",
            "dosage":   "10mg"
          }
        ],
        "nextRefill": "2024-11-15",
        "adherenceRate": 92
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_medications_user ON medications (user_id);
CREATE INDEX idx_medications_active ON medications (is_active) WHERE is_active = true;

-- ═════════════════════════════════════════════════════════════════════════════
-- 13. MEDICATION SCHEDULE
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE medication_schedule (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id   UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    scheduled_time  TIME NOT NULL,
    period_label    VARCHAR(20),             -- 'morning', 'afternoon', 'evening', 'bedtime'
    taken           BOOLEAN NOT NULL DEFAULT false,
    taken_at        TIMESTAMPTZ,
    schedule_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_med_schedule_medication ON medication_schedule (medication_id);
CREATE INDEX idx_med_schedule_date ON medication_schedule (schedule_date);

-- ═════════════════════════════════════════════════════════════════════════════
-- 14. HEALTH PLANS & GOALS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE health_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,

    -- JSONB: phases, weekly focus, metrics
    plan_data       JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      plan_data JSONB schema:
      {
        "phases": [
          {
            "phase":     1,
            "title":     "Foundation",
            "status":    "completed",
            "duration":  "Weeks 1–4",
            "goals": [
              { "title": "Establish morning routine", "completed": true },
              { "title": "Track nutrition for 7 consecutive days", "completed": true }
            ]
          },
          {
            "phase":     2,
            "title":     "Build Momentum",
            "status":    "current",
            "duration":  "Weeks 5–8",
            "goals": [
              { "title": "Lose 3 lbs", "completed": false },
              { "title": "Average 8,000 steps daily", "completed": true }
            ]
          }
        ],
        "weeklyFocus": [
          { "day": "Monday",   "focus": "Cardio + Meal Prep", "icon": "directions_run" },
          { "day": "Tuesday",  "focus": "Strength Training",  "icon": "fitness_center" }
        ],
        "metrics": [
          { "label": "Weight",       "value": "168 lbs",  "change": "-4 lbs",  "trend": "down" },
          { "label": "Resting HR",   "value": "68 BPM",   "change": "-6 BPM",  "trend": "down" },
          { "label": "Blood Pressure","value": "118/76",   "change": "Improved","trend": "down" }
        ]
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_plans_user ON health_plans (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 15. ACTIVITY LOG
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type   VARCHAR(100) NOT NULL,          -- 'Morning Run', 'Strength Training', 'Yoga'
    duration_minutes INT,
    calories_burned INT,
    recorded_date   DATE NOT NULL,

    -- JSONB: daily stats snapshot, weekly aggregates
    activity_data   JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      activity_data JSONB schema:
      {
        "icon":         "directions_run",
        "time":         "7:15 AM",
        "dailyStats": {
          "totalSteps":       10482,
          "stepsGoal":        12000,
          "caloriesBurned":   1847,
          "caloriesGoal":     2200,
          "activeMinutes":    78,
          "activeMinutesGoal": 90
        },
        "weeklySteps": [
          { "day": "Mon", "steps": 9200 },
          { "day": "Tue", "steps": 11400 }
        ],
        "source": "fitbit"
      }
    */

    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user_date ON activity_logs (user_id, recorded_date DESC);

-- ═════════════════════════════════════════════════════════════════════════════
-- 16. SLEEP DATA
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE sleep_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sleep_date      DATE NOT NULL,
    total_hours     NUMERIC(4, 2),

    -- JSONB: sleep architecture breakdown
    sleep_data      JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      sleep_data JSONB schema:
      {
        "deepSleep":    2.1,
        "remSleep":     1.8,
        "lightSleep":   3.6,
        "awake":        0.3,
        "sleepScore":   82,
        "bedTime":      "22:30",
        "wakeTime":     "06:15",
        "efficiency":   91,
        "source":       "apple_health"
      }
    */

    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sleep_user_date ON sleep_records (user_id, sleep_date DESC);

-- ═════════════════════════════════════════════════════════════════════════════
-- 17. DOCUMENTS (Medical Records)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    doc_type        document_type NOT NULL,
    status          document_status NOT NULL DEFAULT 'pending',
    added_by        VARCHAR(255),                   -- institution or doctor name
    file_url        TEXT,
    file_size       VARCHAR(20),
    file_format     VARCHAR(20),                    -- 'pdf', 'DICOM', 'png'
    expiration_date DATE,

    -- JSONB: document metadata, sharing info
    document_data   JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      document_data JSONB schema:
      {
        "category":       "Lab Results",
        "description":    "Complete blood count panel",
        "sharedWith":     ["dr_smith_uuid", "dr_chen_uuid"],
        "isFavorite":     false,
        "tags":           ["blood", "annual", "routine"],
        "ocrExtracted":   { "key_findings": "All values within normal range" }
      }
    */

    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_user ON documents (user_id);
CREATE INDEX idx_documents_type ON documents (doc_type);
CREATE INDEX idx_documents_tags ON documents USING GIN ((document_data -> 'tags'));

-- ═════════════════════════════════════════════════════════════════════════════
-- 18. CONVERSATIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by      UUID NOT NULL REFERENCES users(id),

    -- JSONB: conversation metadata
    conversation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      conversation_data JSONB schema:
      {
        "type":       "doctor_chat",
        "category":   "Doctors",
        "subject":    "Follow-up on blood work"
      }
    */

    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- participants join table
CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unread_count    INT NOT NULL DEFAULT 0,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_user ON conversation_participants (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 19. MESSAGES
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id           UUID NOT NULL REFERENCES users(id),
    content             TEXT,
    message_type        message_type NOT NULL DEFAULT 'text',
    is_read             BOOLEAN NOT NULL DEFAULT false,
    read_at             TIMESTAMPTZ,

    -- JSONB: attachments, rich content
    message_data        JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      message_data JSONB schema:
      {
        "attachments": [
          {
            "type":     "file",
            "name":     "lab-results.pdf",
            "size":     "2.4 MB",
            "url":      "/files/abc123.pdf",
            "mimeType": "application/pdf"
          }
        ]
      }
    */

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages (sender_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 20. NOTIFICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title           VARCHAR(500) NOT NULL,
    message         TEXT NOT NULL,
    icon            VARCHAR(50),
    is_read         BOOLEAN NOT NULL DEFAULT false,
    read_at         TIMESTAMPTZ,

    -- JSONB: action buttons, links, metadata
    notification_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      notification_data JSONB schema:
      {
        "actions": [
          { "label": "Call Doctor", "variant": "primary", "href": "/consultation" },
          { "label": "View Vitals", "variant": "secondary", "href": "/vitals" }
        ],
        "relatedEntity": {
          "type": "vital_reading",
          "id":   "uuid_here"
        },
        "expiresAt": "2024-10-26T00:00:00Z"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications (user_id) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON notifications (notification_type);

-- ═════════════════════════════════════════════════════════════════════════════
-- 21. DATA SYNC / CONNECTED DEVICES
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE connected_devices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name     VARCHAR(100) NOT NULL,          -- 'Apple Health', 'Fitbit', 'Google Fit'
    device_type     VARCHAR(50),                    -- 'wearable', 'mobile', 'medical_device'
    status          VARCHAR(20) NOT NULL DEFAULT 'connected',  -- connected, paused, disconnected

    -- JSONB: sync status, configuration
    device_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      device_data JSONB schema:
      {
        "icon":                "favorite",
        "iconColor":           "text-rose-500",
        "syncProgress":        85,
        "syncLabel":           "Telemetry Stream",
        "lastSyncAt":          "2024-10-25T14:28:00Z",
        "dataTypes":           ["heartRate", "steps", "sleep", "bloodOxygen"],
        "tokenRef":            "device_tok_xxx",
        "firmwareVersion":     "4.2.1"
      }
    */

    connected_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_sync_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_devices_user ON connected_devices (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 22. APPOINTMENTS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE appointments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id     UUID REFERENCES users(id),

    title           VARCHAR(500) NOT NULL,
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 30,
    status          VARCHAR(20) NOT NULL DEFAULT 'scheduled',  -- scheduled, completed, cancelled, no_show

    -- JSONB: appointment details, notes, location
    appointment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      appointment_data JSONB schema:
      {
        "type":        "in_person",
        "location": {
          "facility":  "Austin Medical Center",
          "room":      "202B",
          "address":   "1200 Medical Pkwy"
        },
        "specialty":   "Cardiology",
        "notes":       "Follow-up for echocardiogram results",
        "reminders":   ["24h", "1h"],
        "videoLink":   null
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_patient ON appointments (patient_id, appointment_date DESC);
CREATE INDEX idx_appointments_provider ON appointments (provider_id);
CREATE INDEX idx_appointments_date ON appointments (appointment_date);

-- ═════════════════════════════════════════════════════════════════════════════
-- 23. HABIT TRACKER
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE habits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    icon            VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT true,

    -- JSONB: habit config, streak, schedule
    habit_data      JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      habit_data JSONB schema:
      {
        "frequency":      "daily",
        "targetPerDay":   1,
        "currentStreak":  12,
        "longestStreak":  28,
        "category":       "wellness",
        "scheduleDays":   ["Mon", "Tue", "Wed", "Thu", "Fri"],
        "completionLog": {
          "2024-10-25": true,
          "2024-10-24": true,
          "2024-10-23": false
        }
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_habits_user ON habits (user_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 24. FAMILY WELLNESS CHALLENGES & REWARDS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE family_challenges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,

    -- JSONB: challenge config, participants, progress
    challenge_data  JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      challenge_data JSONB schema:
      {
        "description":   "10K steps daily for 7 days",
        "startDate":     "2024-10-20",
        "endDate":       "2024-10-27",
        "participants": [
          { "memberId": "sarah", "progress": 85, "completed": false },
          { "memberId": "alex",  "progress": 100, "completed": true }
        ],
        "reward": {
          "type":    "badge",
          "name":    "Step Champion",
          "icon":    "emoji_events"
        }
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenges_owner ON family_challenges (family_owner_id);

CREATE TABLE family_rewards (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    reward_name     VARCHAR(255) NOT NULL,
    earned_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    redeemed        BOOLEAN NOT NULL DEFAULT false,

    -- JSONB: reward details
    reward_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      reward_data JSONB schema:
      {
        "type":         "badge",
        "icon":         "emoji_events",
        "challengeId":  "uuid",
        "description":  "Completed 7-day step challenge",
        "redeemedAt":   null
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rewards_member ON family_rewards (family_member_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- 25. ENTERPRISE: SUPPORT TICKETS (Customer Service Dashboard)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE support_tickets (
    id              VARCHAR(50) PRIMARY KEY,         -- 'TK-4521'
    user_id         UUID NOT NULL REFERENCES users(id),
    assigned_to     UUID REFERENCES users(id),       -- customer service agent
    subject         VARCHAR(500) NOT NULL,
    priority        VARCHAR(20) NOT NULL DEFAULT 'medium',  -- critical, high, medium, low
    status          VARCHAR(20) NOT NULL DEFAULT 'open',    -- open, in_progress, resolved, closed

    -- JSONB: ticket details, chat log
    ticket_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      ticket_data JSONB schema:
      {
        "category":     "Billing Issue",
        "description":  "Patient unable to process payment for invoice NH-89230",
        "sla":          "15m",
        "responseTime": "12m 40s",
        "chatMessages": [
          {
            "sender":    "patient",
            "message":   "I can't pay my bill",
            "timestamp": "2024-10-25T10:30:00Z"
          }
        ]
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tickets_user ON support_tickets (user_id);
CREATE INDEX idx_tickets_assigned ON support_tickets (assigned_to);
CREATE INDEX idx_tickets_status ON support_tickets (status);

-- ═════════════════════════════════════════════════════════════════════════════
-- 26. ENTERPRISE: SECURITY LOGS (Admin Dashboard)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE security_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    event_type      VARCHAR(100) NOT NULL,           -- 'login_success', 'login_failed', 'policy_change'
    ip_address      INET,
    location        VARCHAR(255),

    -- JSONB: event details
    log_data        JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      log_data JSONB schema:
      {
        "userAgent":     "Mozilla/5.0...",
        "device":        "MacBook Pro",
        "icon":          "check_circle",
        "severity":      "info",
        "details":       "Successful login from known device"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_logs_user ON security_logs (user_id);
CREATE INDEX idx_security_logs_event ON security_logs (event_type);
CREATE INDEX idx_security_logs_time ON security_logs (created_at DESC);

-- ═════════════════════════════════════════════════════════════════════════════
-- 27. ENTERPRISE: SYSTEM ALERTS (Admin Dashboard)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE system_alerts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type      VARCHAR(100) NOT NULL,
    severity        alert_severity NOT NULL,
    title           VARCHAR(500) NOT NULL,
    message         TEXT,
    is_resolved     BOOLEAN NOT NULL DEFAULT false,

    -- JSONB: alert details
    alert_data      JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      alert_data JSONB schema:
      {
        "refId":       "MAINT-2024-Q4",
        "impact":      "15-minute downtime expected",
        "affectedServices": ["FHIR Endpoint", "Auth Service"],
        "scheduledAt":  "2024-11-01T02:00:00Z"
      }
    */

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_system_alerts_severity ON system_alerts (severity);
CREATE INDEX idx_system_alerts_unresolved ON system_alerts (is_resolved) WHERE is_resolved = false;

-- ═════════════════════════════════════════════════════════════════════════════
-- 28. ENTERPRISE: ACCESS REQUESTS (Admin Dashboard)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TABLE access_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id    UUID NOT NULL REFERENCES users(id),
    reviewed_by     UUID REFERENCES users(id),
    requested_role  user_role NOT NULL,
    department      VARCHAR(255),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, approved, denied

    -- JSONB: request justification, review notes
    request_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
      request_data JSONB schema:
      {
        "justification": "Need admin access for Q4 audit",
        "reviewNotes":   "Approved by security team",
        "approvedAt":    null,
        "expiresAt":     "2025-01-01T00:00:00Z"
      }
    */

    requested_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at     TIMESTAMPTZ
);

CREATE INDEX idx_access_requests_status ON access_requests (status);
CREATE INDEX idx_access_requests_requester ON access_requests (requester_id);

-- ═════════════════════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER (reusable)
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            t, t
        );
    END LOOP;
END;
$$;
