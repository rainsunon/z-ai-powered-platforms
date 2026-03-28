package com.github.dimitryivaniuta.multitenant.api.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * API response representing a user.
 */
public record UserResponse(
    UUID id,
    UUID tenantId,
    String email,
    String fullName,
    Instant createdAt
) {
}
