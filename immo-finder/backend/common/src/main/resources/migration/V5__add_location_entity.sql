-- Create location table
CREATE TABLE IF NOT EXISTS location (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Add location_id column to asset table (nullable for now to allow migration)
ALTER TABLE asset 
ADD COLUMN location_id BIGINT NULL;

-- Add foreign key constraint
ALTER TABLE asset 
ADD CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES location(id);

-- Note: The old 'location' VARCHAR column is kept for backward compatibility
-- You can migrate existing location strings to location entities and then drop the column later
-- Example migration script (run separately if needed):
-- INSERT INTO location (name, is_active) SELECT DISTINCT location, TRUE FROM asset WHERE location IS NOT NULL;
-- UPDATE asset a SET location_id = (SELECT id FROM location l WHERE l.name = a.location) WHERE a.location IS NOT NULL;

