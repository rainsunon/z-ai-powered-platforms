CREATE TABLE IF NOT EXISTS rate_limit_decisions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  tenant_id VARCHAR(128),
  user_id VARCHAR(128),
  ip VARCHAR(64) NOT NULL,
  route_group VARCHAR(64) NOT NULL,
  method VARCHAR(16) NOT NULL,
  path VARCHAR(512) NOT NULL,
  risk_score INT NOT NULL,
  risk_tier VARCHAR(16) NOT NULL,
  allowed BOOLEAN NOT NULL,
  remaining_tokens INT,
  retry_after_millis BIGINT,
  step_up_required BOOLEAN NOT NULL,
  step_up_action VARCHAR(64),
  reason VARCHAR(512),
  correlation_id VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_decisions_created_at ON rate_limit_decisions(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_decisions_tenant_id ON rate_limit_decisions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_decisions_ip ON rate_limit_decisions(ip);
