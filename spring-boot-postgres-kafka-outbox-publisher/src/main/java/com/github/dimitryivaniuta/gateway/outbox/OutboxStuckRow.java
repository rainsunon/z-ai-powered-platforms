package com.github.dimitryivaniuta.gateway.outbox;

import com.github.dimitryivaniuta.gateway.outbox.model.OutboxStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Diagnostic projection for admin views.
 */
public record OutboxStuckRow(
        UUID id,
        String eventType,
        String aggregateId,
        OutboxStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime availableAt,
        int attempts,
        String lockedBy,
        OffsetDateTime lockedAt,
        OffsetDateTime lockUntil,
        String lastError
) {
}
