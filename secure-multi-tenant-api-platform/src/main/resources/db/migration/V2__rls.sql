-- Tenant isolation via PostgreSQL Row Level Security (RLS)
--
-- The application sets: select set_config('app.tenant_id', '<uuid>', true)
-- once per transaction.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_tenant_isolation ON users;

CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
