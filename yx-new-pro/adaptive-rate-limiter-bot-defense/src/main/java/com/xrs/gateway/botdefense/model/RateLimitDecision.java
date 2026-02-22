package com.xrs.gateway.botdefense.model;

import jakarta.annotation.Nullable;

/**
 * Result of enforcing adaptive limits.
 */
public record RateLimitDecision(
        boolean allowed,
        int riskScore,
        RiskTier riskTier,
        int remainingTokens,
        long retryAfterMillis,
        boolean stepUpRequired,
        @Nullable String stepUpAction,
        @Nullable String reason
) {
}
