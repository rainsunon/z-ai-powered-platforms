package com.xrs.productservice.entity;

import com.xrs.commonlib.outbox.OutboxEvent;
import jakarta.persistence.*;

/**
 * OutboxEvent entity for product-service.
 * Extends the abstract OutboxEvent from common-lib.
 */
@Entity
@Table(name = "outbox_events", indexes = {
        @Index(name = "idx_published", columnList = "published"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
public class ProductOutboxEvent extends OutboxEvent {
    
    public ProductOutboxEvent() {
        // Default constructor
    }
}
