package com.xrs.gateway.botdefense.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.gateway.botdefense.model.RateLimitDecision;
import com.xrs.gateway.botdefense.model.RequestContext;
import com.xrs.gateway.botdefense.net.ProxyAwareIpResolver;
import com.xrs.gateway.botdefense.service.AdaptiveRateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

/**
 * HTTP filter enforcing adaptive bot-defense limits.
 */
@Component
public class AdaptiveRateLimitFilter extends OncePerRequestFilter {

    public static final String TENANT_HEADER = "X-Tenant-Id";
    public static final String USER_HEADER = "X-User-Id";

    private final RouteGroupMatcher matcher;
    private final IpAllowlist allowlist;
    private final ProxyAwareIpResolver ipResolver;
    private final AdaptiveRateLimiterService limiter;
    private final ObjectMapper om;

    public AdaptiveRateLimitFilter(RouteGroupMatcher matcher,
                                   IpAllowlist allowlist,
                                   ProxyAwareIpResolver ipResolver,
                                   AdaptiveRateLimiterService limiter,
                                   ObjectMapper om) {
        this.matcher = matcher;
        this.allowlist = allowlist;
        this.ipResolver = ipResolver;
        this.limiter = limiter;
        this.om = om;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String group = matcher.match(request.getMethod(), request.getRequestURI());
        if (group == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = ipResolver.resolve(request);
        if (allowlist.isAllowed(ip)) {
            filterChain.doFilter(request, response);
            return;
        }

        String correlationId = MDC.get("correlationId");
        String tenantId = request.getHeader(TENANT_HEADER);
        String userId = request.getHeader(USER_HEADER);
        String ua = request.getHeader("User-Agent");

        RequestContext ctx = new RequestContext(
                correlationId,
                ip,
                request.getMethod(),
                request.getRequestURI(),
                group,
                tenantId,
                userId,
                ua
        );

        RateLimitDecision decision = limiter.check(ctx);
        response.setHeader("X-Risk-Score", Integer.toString(decision.riskScore()));
        response.setHeader("X-Risk-Tier", decision.riskTier().name());
        response.setHeader("X-RateLimit-Remaining", Integer.toString(decision.remainingTokens()));

        if (decision.allowed()) {
            filterChain.doFilter(request, response);
            return;
        }

        if (decision.stepUpRequired()) {
            response.setStatus(403);
            response.setHeader("X-Step-Up-Required", "true");
            if (decision.stepUpAction() != null) {
                response.setHeader("X-Step-Up-Action", decision.stepUpAction());
            }
            writeJson(response, "STEP_UP_REQUIRED", "Additional verification required.", decision);
            return;
        }

        response.setStatus(429);
        if (decision.retryAfterMillis() > 0) {
            response.setHeader("Retry-After", Long.toString(Math.max(1, decision.retryAfterMillis() / 1000)));
            response.setHeader("X-Retry-After-Millis", Long.toString(decision.retryAfterMillis()));
        }
        writeJson(response, "RATE_LIMITED", "Too many requests. Please retry later.", decision);
    }

    private void writeJson(HttpServletResponse response, String code, String message, RateLimitDecision decision)
            throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Map<String, Object> body = Map.of(
                "code", code,
                "message", message,
                "riskScore", decision.riskScore(),
                "riskTier", decision.riskTier().name(),
                "retryAfterMillis", decision.retryAfterMillis(),
                "stepUpRequired", decision.stepUpRequired(),
                "stepUpAction", decision.stepUpAction(),
                "timestamp", Instant.now().toString()
        );
        om.writeValue(response.getWriter(), body);
    }

}
