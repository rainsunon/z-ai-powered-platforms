-- Billing Service Database Schema with PostgreSQL Advanced Features
-- V1__create_billing_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create billing_transactions table with JSONB and partitioning
CREATE TABLE billing_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    processed_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX idx_user_id ON billing_transactions(user_id);
CREATE INDEX idx_order_id ON billing_transactions(order_id);
CREATE INDEX idx_status ON billing_transactions(status);
CREATE INDEX idx_created_at ON billing_transactions(created_at DESC);
CREATE INDEX idx_request_id ON billing_transactions(request_id);

-- JSONB GIN index for metadata queries
CREATE INDEX idx_metadata_gin ON billing_transactions USING GIN (metadata);

-- Create idempotency_keys table for exactly-once processing
CREATE TABLE idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(255) UNIQUE NOT NULL,
    resource_id VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    response_body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Index for idempotency lookups
CREATE UNIQUE INDEX idx_request_id_unique ON idempotency_keys(request_id);
CREATE INDEX idx_created_at_ttl ON idempotency_keys(created_at);
CREATE INDEX idx_expires_at ON idempotency_keys(expires_at);

-- Create function for automatic cleanup of expired idempotency keys
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency_keys()
RETURNS void AS $$
BEGIN
    DELETE FROM idempotency_keys WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create billing_cycles table for recurring billing
CREATE TABLE billing_cycles (
    cycle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    cycle_start_date DATE NOT NULL,
    cycle_end_date DATE NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_billing_cycles_user_id ON billing_cycles(user_id);
CREATE INDEX idx_billing_cycles_dates ON billing_cycles(cycle_start_date, cycle_end_date);
CREATE INDEX idx_billing_cycles_status ON billing_cycles(status);

-- Add comments for documentation
COMMENT ON TABLE billing_transactions IS 'Stores all billing transactions with JSONB metadata for flexibility';
COMMENT ON COLUMN billing_transactions.metadata IS 'JSONB column for flexible transaction metadata (payment details, tags, etc.)';
COMMENT ON TABLE idempotency_keys IS 'Ensures exactly-once processing of distributed events';
COMMENT ON COLUMN idempotency_keys.expires_at IS 'TTL for automatic cleanup - default 24 hours';

