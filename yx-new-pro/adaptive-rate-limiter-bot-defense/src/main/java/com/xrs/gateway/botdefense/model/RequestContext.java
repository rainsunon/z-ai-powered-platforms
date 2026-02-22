package com.xrs.gateway.botdefense.model;

import jakarta.annotation.Nullable;

/**
 * Request context extracted from an incoming HTTP request.
 *
 * <p>Tenant/user identifiers are optional depending on the endpoint (e.g. login).
 */
public record RequestContext(
        String correlationId,
        String ip,
        String method,
        String path,
        String routeGroup,
        @Nullable String tenantId,
        @Nullable String userId,
        @Nullable String userAgent
) {
}
