package com.github.dimitryivaniuta.audittrail.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

/**
 * Request to append an audit record.
 */
public record CreateAuditRecordRequest(
        @NotBlank String tenantId,
        UUID eventId,
        @NotBlank String actor,
        @NotBlank String action,
        @NotBlank String resourceType,
        @NotBlank String resourceId,
        String correlationId,
        @NotNull Map<String, Object> data
) {
}
