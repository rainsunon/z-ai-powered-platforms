-- Order Service Database Schema with DDD and Outbox Pattern
-- Updated schema for event-driven architecture with transactional outbox

-- Drop existing tables if needed (for development)
-- DROP TABLE IF EXISTS order_items;
-- DROP TABLE IF EXISTS outbox_events;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS carts;

-- Carts table (keeping for backward compatibility)
CREATE TABLE IF NOT EXISTS carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table (refactored for DDD aggregate root)
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_address VARCHAR(500) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    order_desc VARCHAR(255),
    cart_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE SET NULL,
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Items table (new table for order line items)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    CONSTRAINT chk_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_line_total CHECK (line_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Outbox Events table (transactional outbox pattern)
CREATE TABLE IF NOT EXISTS outbox_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(36) UNIQUE NOT NULL,
    topic VARCHAR(100) NOT NULL,
    event_key VARCHAR(100),
    payload TEXT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(50) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    INDEX idx_published (published),
    INDEX idx_created_at (created_at),
    INDEX idx_aggregate_id (aggregate_id),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migration script to add new columns to existing orders table (if upgrading)
-- ALTER TABLE orders ADD COLUMN user_id BIGINT NOT NULL AFTER order_id;
-- ALTER TABLE orders ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING' AFTER user_id;
-- ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER status;
-- ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(500) NOT NULL AFTER total_amount;
-- ALTER TABLE orders DROP COLUMN product_id;
-- ALTER TABLE orders DROP COLUMN order_fee;
