-- Adds per-tenant sequence numbers and a lightweight per-tenant chain head row for scalable, serialized appends.
-- This refactor avoids locking the whole "last record" row and provides stronger ordering guarantees.

ALTER TABLE audit_records
    ADD COLUMN IF NOT EXISTS seq BIGINT;

-- Backfill seq for existing rows (if any) using deterministic ordering by id within each tenant.
WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY id) AS rn
    FROM audit_records
    WHERE seq IS NULL
)
UPDATE audit_records ar
SET seq = numbered.rn
FROM numbered
WHERE ar.id = numbered.id;

-- Enforce seq presence going forward.
ALTER TABLE audit_records
    ALTER COLUMN seq SET NOT NULL;

-- Ensure no duplicates for ordering in a tenant chain.
CREATE UNIQUE INDEX IF NOT EXISTS uq_audit_records_tenant_seq
    ON audit_records(tenant_id, seq);

-- Chain head table (one row per tenant) to serialize appends with minimal locking.
CREATE TABLE IF NOT EXISTS audit_chain_heads (
    tenant_id      VARCHAR(64) PRIMARY KEY,
    last_seq       BIGINT      NOT NULL DEFAULT 0,
    last_hash      VARCHAR(128),
    last_record_id BIGINT,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Initialize chain heads for existing tenants.
INSERT INTO audit_chain_heads (tenant_id, last_seq, last_hash, last_record_id, updated_at)
SELECT
    tenant_id,
    MAX(seq) AS last_seq,
    (ARRAY_AGG(hash ORDER BY seq DESC))[1] AS last_hash,
    (ARRAY_AGG(id ORDER BY seq DESC))[1] AS last_record_id,
    now()
FROM audit_records
GROUP BY tenant_id
ON CONFLICT (tenant_id) DO UPDATE
SET last_seq = EXCLUDED.last_seq,
    last_hash = EXCLUDED.last_hash,
    last_record_id = EXCLUDED.last_record_id,
    updated_at = now();
