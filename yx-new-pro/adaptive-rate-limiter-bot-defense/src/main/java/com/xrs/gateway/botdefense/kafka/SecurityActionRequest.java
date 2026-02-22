package com.xrs.gateway.botdefense.kafka;

import java.time.Instant;

/**
 * A downstream "security action" request, produced after a successful
 * step-up trigger (e.g., CAPTCHA provider accepted the request).
 */
public record SecurityActionRequest(
        String requestId,
        Instant createdAt,
        String correlationId,
        String tenantId,
        String userId,
        String ip,
        String action,
        String sourceEventId,
        String providerResponse
) {
}
