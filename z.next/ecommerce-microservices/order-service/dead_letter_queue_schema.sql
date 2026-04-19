# Dead Letter Queue Database Schema

CREATE TABLE IF NOT EXISTS dead_letter_queue (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    order_id INTEGER NOT NULL,
    payload TEXT NOT NULL,
    topic VARCHAR(255),
    failure_reason TEXT,
    error_stacktrace TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_processed_at TIMESTAMP,
    resolved_at TIMESTAMP,
    notes TEXT,
    
    CONSTRAINT chk_dlq_status CHECK (status IN ('PENDING', 'REPROCESSING', 'RESOLVED', 'DISCARDED'))
);

-- Indexes for DLQ queries
CREATE INDEX IF NOT EXISTS idx_dlq_event_id ON dead_letter_queue(event_id);
CREATE INDEX IF NOT EXISTS idx_dlq_event_type ON dead_letter_queue(event_type);
CREATE INDEX IF NOT EXISTS idx_dlq_order_id ON dead_letter_queue(order_id);
CREATE INDEX IF NOT EXISTS idx_dlq_status ON dead_letter_queue(status);
CREATE INDEX IF NOT EXISTS idx_dlq_created_at ON dead_letter_queue(created_at);

-- Comments
COMMENT ON TABLE dead_letter_queue IS 'Stores failed events that exceeded max retries for manual intervention';
COMMENT ON COLUMN dead_letter_queue.event_id IS 'Original event ID from Kafka message';
COMMENT ON COLUMN dead_letter_queue.status IS 'PENDING: awaiting manual action, REPROCESSING: being retried, RESOLVED: fixed, DISCARDED: invalid';
COMMENT ON COLUMN dead_letter_queue.retry_count IS 'Number of failed processing attempts before DLQ';
