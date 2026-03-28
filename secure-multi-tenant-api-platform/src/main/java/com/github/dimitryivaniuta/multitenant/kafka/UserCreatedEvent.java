package com.github.dimitryivaniuta.multitenant.kafka;

import java.time.Instant;
import java.util.UUID;

/**
 * Event emitted when a user is created in a tenant.
 */
public record UserCreatedEvent(
    UUID tenantId,
    UUID userId,
    String email,
    String fullName,
    Instant createdAt
) {
}
