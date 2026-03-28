-- V1__init.sql
-- Core schema for demo business table and outbox table.

CREATE TABLE IF NOT EXISTS orders (
    id              UUID PRIMARY KEY,
    customer_email  VARCHAR(320) NOT NULL,
    total_amount    NUMERIC(19,2) NOT NULL,
    status          VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS outbox_messages (
    id           UUID PRIMARY KEY,
    event_type   VARCHAR(200) NOT NULL,
    aggregate_id VARCHAR(200) NOT NULL,
    payload      JSONB NOT NULL,

    status       VARCHAR(32) NOT NULL,
    attempts     INTEGER NOT NULL DEFAULT 0,

    created_at   TIMESTAMPTZ NOT NULL,
    available_at TIMESTAMPTZ NOT NULL,

    locked_by    VARCHAR(100),
    locked_at    TIMESTAMPTZ,
    lock_until   TIMESTAMPTZ,

    sent_at      TIMESTAMPTZ,
    last_error   TEXT
);

-- Fast scan for eligible rows
CREATE INDEX IF NOT EXISTS ix_outbox_status_available ON outbox_messages (status, available_at, created_at);

-- Diagnostics / reaper
CREATE INDEX IF NOT EXISTS ix_outbox_lock_until ON outbox_messages (status, lock_until);

-- Optional: aggregate lookups
CREATE INDEX IF NOT EXISTS ix_outbox_aggregate ON outbox_messages (aggregate_id);

