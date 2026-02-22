package com.xrs.gateway.botdefense.risk;

import com.xrs.gateway.botdefense.model.RequestContext;
import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * Simple, explainable risk scoring.
 *
 * <p>Weights are intentionally conservative to keep false positives low.
 */
@Service
public class RiskScoringService {

    private final RiskSignalStore signals;

    public RiskScoringService(RiskSignalStore signals) {
        this.signals = signals;
    }

    /**
     * Calculates a risk score (0..100).
     *
     * @param ctx request context
     * @return risk score
     */
    public int score(RequestContext ctx) {
        int score = 0;

        // Request rate - coarse signal.
        long rpmCount = signals.incrementIpRequestRate(ctx.ip());
        if (rpmCount > 300) {
            score += 70;
        } else if (rpmCount > 100) {
            score += 30;
        }

        // Missing or obviously scripted UA.
        String ua = ctx.userAgent();
        if (ua == null || ua.isBlank()) {
            score += 15;
        } else {
            String ual = ua.toLowerCase(Locale.ROOT);
            if (ual.contains("curl/") || ual.contains("python-requests") || ual.contains("httpclient") || ual.contains("bot")) {
                score += 20;
            }
        }

        // For login route, repeated failures are a strong signal.
        if ("login".equals(ctx.routeGroup())) {
            long fails = signals.getLoginFailures(safe(ctx.tenantId()), safe(ctx.userId()), ctx.ip());
            if (fails > 10) {
                score += 80;
            } else if (fails > 3) {
                score += 40;
            }
        }

        // Cap to 100.
        return Math.min(100, Math.max(0, score));
    }

    private static String safe(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }
}
