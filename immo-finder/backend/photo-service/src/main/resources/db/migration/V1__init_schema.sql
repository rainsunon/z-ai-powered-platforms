CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY,
    property_id VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    alt_text VARCHAR(255),
    category VARCHAR(50),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_property_url UNIQUE (property_id, url)
);

CREATE INDEX idx_photos_property_id ON photos(property_id);
CREATE INDEX idx_photos_property_type ON photos(property_type);
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_display_order ON photos(display_order);
CREATE INDEX idx_photos_is_primary ON photos(is_primary);
