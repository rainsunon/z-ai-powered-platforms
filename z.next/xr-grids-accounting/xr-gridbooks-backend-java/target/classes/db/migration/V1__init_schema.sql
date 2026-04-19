-- GridBooks Supabase Migration Script
-- This script creates tables with JSONB columns and GIN indexes for optimal performance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table with preferences JSONB
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    initials VARCHAR(10),
    color VARCHAR(50),
    email VARCHAR(255),
    mobile VARCHAR(50),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    gender VARCHAR(50),
    member_time TIMESTAMP,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create GIN index on preferences for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_clients_preferences ON clients USING GIN (preferences);

-- Expenses table with metadata JSONB
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(255) PRIMARY KEY,
    date DATE,
    merchant VARCHAR(255),
    category VARCHAR(255),
    amount DECIMAL(19, 2),
    status VARCHAR(50),
    member VARCHAR(255),
    claimed_at TIMESTAMP,
    memo TEXT,
    approved_by VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create GIN index on metadata for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_expenses_metadata ON expenses USING GIN (metadata);

-- Invoices table with line_items JSONB
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT,
    date DATE,
    due_date DATE,
    amount DECIMAL(19, 2),
    status VARCHAR(50),
    client_id VARCHAR(255),
    line_items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Create GIN index on line_items for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_invoices_line_items ON invoices USING GIN (line_items);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date DESC);

-- Example JSONB queries that benefit from GIN indexes:
-- 
-- Find clients with dark theme preference:
-- SELECT * FROM clients WHERE preferences @> '{"theme": "dark"}';
--
-- Find expenses with receipt attached:
-- SELECT * FROM expenses WHERE metadata ?? 'receiptName';
--
-- Find invoices with specific line item:
-- SELECT * FROM invoices WHERE line_items @> '[{"description": "Consulting"}]';
