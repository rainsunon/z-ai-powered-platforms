package com.xrs.paymentservice.entity;

import com.xrs.commonlib.outbox.OutboxEvent;
import jakarta.persistence.*;

/**
 * Outbox event entity for payment service.
 * Extends the abstract OutboxEvent from common-lib.
 */
@Entity
@Table(name = "payment_outbox_events")
public class PaymentOutboxEvent extends OutboxEvent {
    
    public PaymentOutboxEvent() {
        super();
    }
    
    public PaymentOutboxEvent(String topic, String aggregateId, Object payload, 
                             String correlationId, String aggregateType) {
        super(topic, aggregateId, payload, correlationId, aggregateType);
    }
}
