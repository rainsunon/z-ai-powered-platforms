package com.xrs.gateway.botdefense.kafka;

import java.time.Instant;

/**
 * Event published when the system requires a step-up (e.g. CAPTCHA).
 */
public record BotDefenseEvent(
        String eventId,
        Instant createdAt,
        String correlationId,
        String routeGroup,
        String tenantId,
        String userId,
        String ip,
        int riskScore,
        String action,
        String reason
) {
}
