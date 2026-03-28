package com.github.dimitryivaniuta.audittrail.api.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * REST response for an audit record.
 */
public record AuditRecordResponse(
        long id,
        long seq,
        String tenantId,
        UUID eventId,
        String actor,
        String action,
        String resourceType,
        String resourceId,
        String correlationId,
        Instant createdAt,
        Map<String, Object> data,
        String hashAlg,
        String keyId,
        String prevHash,
        String hash
) {
}
