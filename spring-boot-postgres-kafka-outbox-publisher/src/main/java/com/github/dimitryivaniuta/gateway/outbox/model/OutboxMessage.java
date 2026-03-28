package com.github.dimitryivaniuta.gateway.outbox.model;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Outbox message representation used by the publisher.
 *
 * @param id outbox message id
 * @param eventType event type (e.g., OrderCreated)
 * @param aggregateId business aggregate identifier
 * @param payloadJson serialized JSON payload
 * @param status current status
 * @param createdAt creation time
 * @param availableAt next time eligible for publishing
 * @param attempts current attempt count
 * @param lockedBy instance id that claimed the row
 * @param lockedAt time when claimed
 * @param lockUntil time until the claim expires
 */
public record OutboxMessage(
        UUID id,
        String eventType,
        String aggregateId,
        String payloadJson,
        OutboxStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime availableAt,
        int attempts,
        String lockedBy,
        OffsetDateTime lockedAt,
        OffsetDateTime lockUntil
) {
}
