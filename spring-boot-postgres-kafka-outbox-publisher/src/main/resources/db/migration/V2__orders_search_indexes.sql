-- V2__orders_search_indexes.sql
-- Indexes to support dashboard search and recent-first ordering.

CREATE INDEX IF NOT EXISTS ix_orders_created_at_desc ON orders (created_at DESC);

CREATE INDEX IF NOT EXISTS ix_orders_customer_email_lower ON orders (lower(customer_email));
