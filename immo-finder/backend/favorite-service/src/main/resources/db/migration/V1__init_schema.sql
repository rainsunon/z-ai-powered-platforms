CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    property_id VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_user_property UNIQUE (user_id, property_id, property_type)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_type ON favorites(property_type);
CREATE INDEX idx_favorites_created_at ON favorites(created_at);
