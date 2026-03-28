package com.github.dimitryivaniuta.multitenant.security;

import com.github.dimitryivaniuta.multitenant.tenant.MissingTenantException;
import com.github.dimitryivaniuta.multitenant.tenant.TenantContext;
import com.github.dimitryivaniuta.multitenant.observability.MdcKeys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Extracts {@code tenantId} from the authenticated JWT and stores it in {@link TenantContext}.
 *
 * <p>All application code must use {@link TenantContext#requireTenantId()} to guarantee presence.
 */
public class TenantContextFilter extends OncePerRequestFilter {

  /** JWT claim name containing the tenant id. */
  public static final String TENANT_ID_CLAIM = "tenantId";

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    try {
      // Allow unauthenticated endpoints (e.g., actuator health) to pass without tenant context.
      AbstractAuthenticationToken auth = (AbstractAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
      if (auth instanceof JwtAuthenticationToken jwtAuth) {
        Object raw = jwtAuth.getToken().getClaims().get(TENANT_ID_CLAIM);
        if (raw == null) {
          throw new MissingTenantException("JWT is missing required claim: " + TENANT_ID_CLAIM);
        }
        UUID tenantId = UUID.fromString(String.valueOf(raw));
        TenantContext.setTenantId(tenantId);
        MDC.put(MdcKeys.TENANT_ID, tenantId.toString());
      }

      filterChain.doFilter(request, response);
    } finally {
      TenantContext.clear();
      MDC.remove(MdcKeys.TENANT_ID);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    String auth = request.getHeader(HttpHeaders.AUTHORIZATION);

    // Skip for actuator endpoints (health/info) and for requests without Authorization.
    // If the endpoint is protected, Spring Security will reject it before we need tenant context.
    return path.startsWith("/actuator") || auth == null || auth.isBlank();
  }
}
