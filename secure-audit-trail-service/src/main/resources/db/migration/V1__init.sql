-- Append-only, tamper-evident audit table.
-- IMPORTANT: This table is designed to be immutable (no UPDATE/DELETE).
-- Any attempt is rejected by triggers.

CREATE TABLE IF NOT EXISTS audit_records (
    id          BIGSERIAL PRIMARY KEY,
    tenant_id   VARCHAR(64)  NOT NULL,
    event_id    UUID         NOT NULL,
    actor       VARCHAR(256) NOT NULL,
    action      VARCHAR(128) NOT NULL,
    resource_type VARCHAR(128) NOT NULL,
    resource_id VARCHAR(256) NOT NULL,
    correlation_id VARCHAR(128),
    data        JSONB        NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    hash_alg    VARCHAR(32)  NOT NULL,
    key_id      VARCHAR(32)  NOT NULL,
    prev_hash   VARCHAR(128),
    hash        VARCHAR(128) NOT NULL,
    CONSTRAINT uq_audit_records_tenant_event_id UNIQUE (tenant_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_audit_records_tenant_id_id ON audit_records(tenant_id, id);
CREATE INDEX IF NOT EXISTS idx_audit_records_created_at ON audit_records(created_at);

-- Reject UPDATE/DELETE for immutability.
CREATE OR REPLACE FUNCTION audit_records_reject_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'audit_records is append-only: % is not allowed', TG_OP
        USING ERRCODE = '0A000'; -- feature_not_supported
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_records_reject_mutation ON audit_records;

CREATE TRIGGER trg_audit_records_reject_mutation
BEFORE UPDATE OR DELETE ON audit_records
FOR EACH ROW
EXECUTE FUNCTION audit_records_reject_mutation();
