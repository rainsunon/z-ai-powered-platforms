package com.github.dimitryivaniuta.gateway.orders;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Domain event emitted after a new order is created.
 *
 * <p>This event is stored in the outbox table and later published to Kafka.</p>
 */
public record OrderCreatedEvent(
        UUID orderId,
        String customerEmail,
        BigDecimal totalAmount,
        String status,
        OffsetDateTime createdAt
) {
}
