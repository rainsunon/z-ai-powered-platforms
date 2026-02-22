-- Initial schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY,
  tenant_id  UUID NOT NULL,
  email      VARCHAR(320) NOT NULL,
  full_name  VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_tenant_email ON users (tenant_id, email);
CREATE INDEX IF NOT EXISTS ix_users_tenant_id ON users (tenant_id);
