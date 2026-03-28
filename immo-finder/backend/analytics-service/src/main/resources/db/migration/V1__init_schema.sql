CREATE TABLE IF NOT EXISTS property_view_events (
    id VARCHAR(36) PRIMARY KEY,
    property_id VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    event_date TIMESTAMP NOT NULL,
    duration_seconds INTEGER,
    source VARCHAR(50),
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_id ON property_view_events(property_id);
CREATE INDEX idx_user_id ON property_view_events(user_id);
CREATE INDEX idx_event_date ON property_view_events(event_date);
CREATE INDEX idx_property_type ON property_view_events(property_type);
CREATE INDEX idx_created_at ON property_view_events(created_at);
