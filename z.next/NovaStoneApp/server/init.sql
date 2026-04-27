-- NovaStone Database Initialization
-- This script runs when the PostgreSQL container is first created

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database if it doesn't exist (redundant with docker-compose, but safe)
SELECT 'CREATE DATABASE novastone'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'novastone')\gexec

\c novastone;

-- Create JSONB indexes for better query performance
-- These will be created after Prisma migrations, but documented here

-- Customer JSONB indexes
-- CREATE INDEX IF NOT EXISTS idx_customer_address ON customers USING GIN (address);
-- CREATE INDEX IF NOT EXISTS idx_customer_contacts ON customers USING GIN (contacts);
-- CREATE INDEX IF NOT EXISTS idx_customer_custom_fields ON customers USING GIN ("customFields");

-- Product JSONB indexes
-- CREATE INDEX IF NOT EXISTS idx_product_pricing ON products USING GIN (pricing);
-- CREATE INDEX IF NOT EXISTS idx_product_inventory ON products USING GIN (inventory);
-- CREATE INDEX IF NOT EXISTS idx_product_categories ON products USING GIN (categories);

-- Invoice JSONB indexes
-- CREATE INDEX IF NOT EXISTS idx_invoice_line_items ON invoices USING GIN ("lineItems");
-- CREATE INDEX IF NOT EXISTS idx_invoice_payments ON invoices USING GIN (payments);

-- Transaction JSONB indexes
-- CREATE INDEX IF NOT EXISTS idx_transaction_tags ON transactions USING GIN (tags);
-- CREATE INDEX IF NOT EXISTS idx_transaction_related ON transactions USING GIN ("relatedTo");

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE novastone TO novastone;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO novastone;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO novastone;

-- Log initialization
SELECT 'NovaStone database initialized successfully' AS status;
