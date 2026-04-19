package com.xrs.inventoryservice.entity;

import com.xrs.commonlib.outbox.OutboxEvent;
import jakarta.persistence.*;

/**
 * Outbox event entity for inventory service.
 * Extends the abstract OutboxEvent from common-lib.
 */
@Entity
@Table(name = "inventory_outbox_events")
public class InventoryOutboxEvent extends OutboxEvent {
    
    public InventoryOutboxEvent() {
        super();
    }
    
    public InventoryOutboxEvent(String topic, String aggregateId, Object payload, 
                             String correlationId, String aggregateType) {
        super(topic, aggregateId, payload, correlationId, aggregateType);
    }
}
