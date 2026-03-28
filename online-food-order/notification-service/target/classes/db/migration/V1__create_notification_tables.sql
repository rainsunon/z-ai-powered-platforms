CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    default_variables JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    template_name VARCHAR(100) NOT NULL,
    template_data JSONB,
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP,
    failed_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_notification_status ON notifications(status);
CREATE INDEX idx_notification_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notification_template_gin ON notifications USING GIN (template_data);

CREATE TABLE idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX idx_request_id_unique ON idempotency_keys(request_id);
CREATE INDEX idx_expires_at ON idempotency_keys(expires_at);

INSERT INTO notification_templates (template_name, subject, body, default_variables)
VALUES
  ('order-created', 'Order {{orderId}} received', 'Your order {{orderId}} has been received and is being processed.', '{"supportEmail":"support@ofo.com"}'),
  ('order-paid', 'Payment received for {{orderId}}', 'Payment of {{amount}} {{currency}} received for order {{orderId}}.', '{"supportEmail":"support@ofo.com"}'),
  ('invoice-generated', 'Invoice {{invoiceId}} is ready', 'Invoice {{invoiceId}} for order {{orderId}} is ready.', '{"supportEmail":"support@ofo.com"}');

