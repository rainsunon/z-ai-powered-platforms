-- Phase 3: Saga Orchestration Tables
-- This migration adds tables for saga state management and idempotency tracking

-- Table: order_saga_state
-- Purpose: Track the state of each order saga for observability and recovery
CREATE TABLE IF NOT EXISTS order_saga_state (
    id BIGSERIAL PRIMARY KEY,
    saga_id VARCHAR(255) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL,
    current_step VARCHAR(100) NOT NULL,
    saga_status VARCHAR(50) NOT NULL,
    reservation_id VARCHAR(255),
    payment_id VARCHAR(255),
    shipment_id VARCHAR(255),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_order_saga_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT chk_saga_status CHECK (saga_status IN (
        'STARTED', 
        'INVENTORY_RESERVING', 
        'INVENTORY_RESERVED', 
        'PAYMENT_PROCESSING', 
        'PAYMENT_COMPLETED', 
        'SHIPMENT_CREATING', 
        'COMPLETED', 
        'COMPENSATING', 
        'FAILED', 
        'CANCELLED'
    ))
);

-- Index for querying saga state by order
CREATE INDEX idx_order_saga_state_order_id ON order_saga_state(order_id);

-- Index for recovery queries (find stuck/failed sagas)
CREATE INDEX idx_order_saga_state_status ON order_saga_state(saga_status);

-- Index for monitoring and retry logic
CREATE INDEX idx_order_saga_state_status_retry ON order_saga_state(saga_status, retry_count);

-- Table: processed_events
-- Purpose: Idempotency tracking to prevent duplicate event processing
CREATE TABLE IF NOT EXISTS processed_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    order_id BIGINT NOT NULL,
    payload TEXT,
    status VARCHAR(50) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_processed_event_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT chk_processed_event_status CHECK (status IN ('PROCESSED', 'FAILED', 'DUPLICATE'))
);

-- Index for idempotency check (most common query)
CREATE UNIQUE INDEX idx_processed_events_event_id ON processed_events(event_id);

-- Index for querying events by order
CREATE INDEX idx_processed_events_order_id ON processed_events(order_id);

-- Index for cleanup queries
CREATE INDEX idx_processed_events_processed_at ON processed_events(processed_at);

-- Comments for documentation
COMMENT ON TABLE order_saga_state IS 'Tracks the lifecycle and state of order sagas for monitoring and recovery';
COMMENT ON TABLE processed_events IS 'Records processed events to ensure idempotent event handling';

COMMENT ON COLUMN order_saga_state.saga_id IS 'Unique identifier for the saga instance';
COMMENT ON COLUMN order_saga_state.order_id IS 'Reference to the order aggregate';
COMMENT ON COLUMN order_saga_state.current_step IS 'Human-readable description of current saga step';
COMMENT ON COLUMN order_saga_state.saga_status IS 'Current state in saga state machine';
COMMENT ON COLUMN order_saga_state.reservation_id IS 'Inventory reservation ID from inventory service';
COMMENT ON COLUMN order_saga_state.payment_id IS 'Payment transaction ID from payment service';
COMMENT ON COLUMN order_saga_state.shipment_id IS 'Shipment tracking ID from shipping service';
COMMENT ON COLUMN order_saga_state.retry_count IS 'Number of retry attempts for failed sagas';

COMMENT ON COLUMN processed_events.event_id IS 'Unique event identifier for idempotency check';
COMMENT ON COLUMN processed_events.event_type IS 'Type of event (e.g., INVENTORY_RESERVED, PAYMENT_COMPLETED)';
COMMENT ON COLUMN processed_events.status IS 'Processing status (PROCESSED, FAILED, or DUPLICATE)';
