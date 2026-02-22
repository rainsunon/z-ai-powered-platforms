package com.xrs.gateway.botdefense.service;

import com.xrs.gateway.botdefense.config.BotDefenseProperties;
import com.xrs.gateway.botdefense.kafka.BotDefenseEventPublisher;
import com.xrs.gateway.botdefense.model.RateLimitDecision;
import com.xrs.gateway.botdefense.model.RequestContext;
import com.xrs.gateway.botdefense.model.RiskTier;
import com.xrs.gateway.botdefense.persistence.RateLimitDecisionEntity;
import com.xrs.gateway.botdefense.persistence.RateLimitDecisionRepository;
import com.xrs.gateway.botdefense.redis.TokenBucketRedisClient;
import com.xrs.gateway.botdefense.risk.RiskScoringService;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Central enforcement logic. It combines:
 * <ul>
 *   <li>risk scoring</li>
 *   <li>three token buckets (IP, user, tenant)</li>
 *   <li>step-up trigger when risk is extreme</li>
 * </ul>
 */
@Service
public class AdaptiveRateLimiterService {

    private static final Logger log = LoggerFactory.getLogger(AdaptiveRateLimiterService.class);

    private final BotDefenseProperties props;
    private final RiskScoringService riskScoring;
    private final TokenBucketRedisClient buckets;
    private final BotDefenseEventPublisher eventPublisher;
    private final RateLimitDecisionRepository decisionRepository;
    private final MeterRegistry metrics;

    public AdaptiveRateLimiterService(BotDefenseProperties props,
                                    RiskScoringService riskScoring,
                                    TokenBucketRedisClient buckets,
                                    BotDefenseEventPublisher eventPublisher,
                                    RateLimitDecisionRepository decisionRepository,
                                    MeterRegistry metrics) {
        this.props = props;
        this.riskScoring = riskScoring;
        this.buckets = buckets;
        this.eventPublisher = eventPublisher;
        this.decisionRepository = decisionRepository;
        this.metrics = metrics;

        metrics.counter("botdefense.decisions", "result", "init").increment(0.0);
    }

    /**
     * Checks whether the request should be allowed.
     *
     * <p>Fail-open design: if Redis is down or returns unexpected output, we allow.
     */
    public RateLimitDecision check(RequestContext ctx) {
        long now = System.currentTimeMillis();

        int riskScore = riskScoring.score(ctx);
        RiskTier tier = tierOf(riskScore);
        double factor = factorOf(tier);

        // Step-up action: only for very high risk on login.
        boolean stepUpRequired = "login".equals(ctx.routeGroup()) && riskScore >= props.getRisk().getStepUpAt();
        if (stepUpRequired) {
            String action = "CAPTCHA_REQUIRED";
            String reason = "high_risk_login";
            publishStepUp(ctx, riskScore, action, reason);
            RateLimitDecision decision = new RateLimitDecision(false, riskScore, tier, 0, 0, true, action, reason);
            persistIfNeeded(ctx, decision, now);
            metrics.counter("botdefense.decisions", "result", "stepup").increment();
            return decision;
        }

        // Enforce 3 buckets: ip, user (if present), tenant (if present).
        TokenBucketRedisClient.BucketResult ipR = buckets.consume(
                keyIp(ctx),
                effCapacity(props.getLimits().getIp().getCapacity(), factor),
                effRefill(props.getLimits().getIp().getRefillPerSecond(), factor),
                now
        );

        TokenBucketRedisClient.BucketResult userR = null;
        if (ctx.userId() != null && !ctx.userId().isBlank()) {
            userR = buckets.consume(
                    keyUser(ctx),
                    effCapacity(props.getLimits().getUser().getCapacity(), factor),
                    effRefill(props.getLimits().getUser().getRefillPerSecond(), factor),
                    now
            );
        }

        TokenBucketRedisClient.BucketResult tenantR = null;
        if (ctx.tenantId() != null && !ctx.tenantId().isBlank()) {
            tenantR = buckets.consume(
                    keyTenant(ctx),
                    effCapacity(props.getLimits().getTenant().getCapacity(), factor),
                    effRefill(props.getLimits().getTenant().getRefillPerSecond(), factor),
                    now
            );
        }

        boolean allowed = ipR.allowed() && (userR == null || userR.allowed()) && (tenantR == null || tenantR.allowed());
        int remaining = minRemaining(ipR, userR, tenantR);
        long retryAfter = maxRetryAfter(ipR, userR, tenantR);

        RateLimitDecision decision;
        if (allowed) {
            decision = new RateLimitDecision(true, riskScore, tier, remaining, 0, false, null, null);
            metrics.counter("botdefense.decisions", "result", "allowed").increment();
        } else {
            decision = new RateLimitDecision(false, riskScore, tier, remaining, retryAfter, false, null, "rate_limited");
            metrics.counter("botdefense.decisions", "result", "limited").increment();
            log.debug("Rate limited: routeGroup={}, ip={}, tenantId={}, userId={}, riskScore={}, retryAfterMs={}",
                    ctx.routeGroup(), ctx.ip(), ctx.tenantId(), ctx.userId(), riskScore, retryAfter);
        }

        persistIfNeeded(ctx, decision, now);
        return decision;
    }

    private void publishStepUp(RequestContext ctx, int riskScore, String action, String reason) {
        eventPublisher.publishStepUpRequired(ctx.correlationId(), ctx.routeGroup(), ctx.tenantId(), ctx.userId(), ctx.ip(), riskScore, action, reason);
    }

    private void persistIfNeeded(RequestContext ctx, RateLimitDecision decision, long nowMillis) {
        // Persist only denials and step-up decisions (keeps storage small, helps investigations).
        if (decision.allowed()) {
            return;
        }

        RateLimitDecisionEntity e = new RateLimitDecisionEntity();
        e.setId(UUID.randomUUID());
        e.setCreatedAt(Instant.ofEpochMilli(nowMillis));
        e.setTenantId(ctx.tenantId());
        e.setUserId(ctx.userId());
        e.setIp(ctx.ip());
        e.setRouteGroup(ctx.routeGroup());
        e.setMethod(ctx.method());
        e.setPath(ctx.path());
        e.setRiskScore(decision.riskScore());
        e.setRiskTier(decision.riskTier().name());
        e.setAllowed(decision.allowed());
        e.setRemainingTokens(decision.remainingTokens());
        e.setRetryAfterMillis(decision.retryAfterMillis());
        e.setStepUpRequired(decision.stepUpRequired());
        e.setStepUpAction(decision.stepUpAction());
        e.setReason(decision.reason());
        e.setCorrelationId(ctx.correlationId());
        decisionRepository.save(e);
    }

    private RiskTier tierOf(int riskScore) {
        if (riskScore >= props.getRisk().getTightenHighAt()) {
            return RiskTier.HIGH;
        }
        if (riskScore >= props.getRisk().getTightenMediumAt()) {
            return RiskTier.MEDIUM;
        }
        return RiskTier.NORMAL;
    }

    private double factorOf(RiskTier tier) {
        return switch (tier) {
            case NORMAL -> 1.0;
            case MEDIUM -> props.getRisk().getFactors().getMedium();
            case HIGH -> props.getRisk().getFactors().getHigh();
        };
    }

    private static double effCapacity(int base, double factor) {
        // Never go below 1 token.
        return Math.max(1.0, Math.round(base * factor));
    }

    private static double effRefill(double base, double factor) {
        // Never go below a tiny refill so the system recovers.
        return Math.max(0.05, base * factor);
    }

    private String keyIp(RequestContext ctx) {
        return "rl:ip:" + ctx.ip() + ":rg:" + ctx.routeGroup();
    }

    private String keyUser(RequestContext ctx) {
        String tenant = ctx.tenantId() == null || ctx.tenantId().isBlank() ? "-" : ctx.tenantId();
        return "rl:user:" + tenant + ":" + ctx.userId() + ":rg:" + ctx.routeGroup();
    }

    private String keyTenant(RequestContext ctx) {
        return "rl:tenant:" + ctx.tenantId() + ":rg:" + ctx.routeGroup();
    }

    private static int minRemaining(TokenBucketRedisClient.BucketResult a,
                                    TokenBucketRedisClient.BucketResult b,
                                    TokenBucketRedisClient.BucketResult c) {
        int min = a.remainingTokens();
        if (b != null) min = Math.min(min, b.remainingTokens());
        if (c != null) min = Math.min(min, c.remainingTokens());
        return min;
    }

    private static long maxRetryAfter(TokenBucketRedisClient.BucketResult a,
                                     TokenBucketRedisClient.BucketResult b,
                                     TokenBucketRedisClient.BucketResult c) {
        long max = a.retryAfterMillis();
        if (b != null) max = Math.max(max, b.retryAfterMillis());
        if (c != null) max = Math.max(max, c.retryAfterMillis());
        return max;
    }
}
