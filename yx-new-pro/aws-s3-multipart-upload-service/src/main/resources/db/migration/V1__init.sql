-- Upload session metadata. No enum constraints; state is enforced in application.
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY,

  user_sub VARCHAR(128) NOT NULL,
  username VARCHAR(128),

  bucket VARCHAR(128) NOT NULL,
  object_key VARCHAR(1024) NOT NULL,
  s3_upload_id VARCHAR(256) NOT NULL,

  file_name VARCHAR(512) NOT NULL,
  content_type VARCHAR(256) NOT NULL,
  file_size BIGINT NOT NULL,

  part_size BIGINT NOT NULL,
  part_count INT NOT NULL,

  idempotency_key VARCHAR(128),

  status VARCHAR(32) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ NULL,

  version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_uploads_user_sub_created_at ON uploads(user_sub, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_uploads_status_created_at ON uploads(status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_uploads_bucket_key_uploadid ON uploads(bucket, object_key, s3_upload_id);

-- Idempotency: one key per user
CREATE UNIQUE INDEX IF NOT EXISTS uq_uploads_user_idem ON uploads(user_sub, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
