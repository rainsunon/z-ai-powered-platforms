package com.xrs.gateway.botdefense.risk;

import com.xrs.gateway.botdefense.config.BotDefenseProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Stores and aggregates simple risk signals in Redis.
 *
 * <p>Signals are lightweight counters with TTLs (windows). They are intentionally
 * coarse to reduce false positives.
 */
@Component
public class RiskSignalStore {

    private final StringRedisTemplate redis;
    private final BotDefenseProperties properties;

    public RiskSignalStore(StringRedisTemplate redis, BotDefenseProperties properties) {
        this.redis = redis;
        this.properties = properties;
    }

    /**
     * Records a login failure for the given key.
     */
    public void recordLoginFailure(String tenantId, String userId, String ip) {
        String key = "sig:loginFail:" + safe(tenantId) + ":" + safe(userId) + ":" + safe(ip);
        long ttl = properties.getSignals().getLoginFailureWindowSeconds();
        redis.opsForValue().increment(key);
        redis.expire(key, Duration.ofSeconds(ttl));
    }

    /**
     * Clears recorded login failures after a successful authentication.
     */
    public void clearLoginFailures(String tenantId, String userId, String ip) {
        String key = "sig:loginFail:" + safe(tenantId) + ":" + safe(userId) + ":" + safe(ip);
        redis.delete(key);
    }

    /**
     * Returns the number of login failures within the configured window.
     */
    public long getLoginFailures(String tenantId, String userId, String ip) {
        String key = "sig:loginFail:" + safe(tenantId) + ":" + safe(userId) + ":" + safe(ip);
        String v = redis.opsForValue().get(key);
        return v == null ? 0 : Long.parseLong(v);
    }

    /**
     * Increments and returns a per-IP request counter for a short window.
     */
    public long incrementIpRequestRate(String ip) {
        String key = "sig:reqRate:" + safe(ip);
        long ttl = properties.getSignals().getRequestRateWindowSeconds();
        Long v = redis.opsForValue().increment(key);
        redis.expire(key, Duration.ofSeconds(ttl));
        return v == null ? 0 : v;
    }

    /**
     * Returns the current per-IP request counter (may be 0 if key not present).
     */
    public long getIpRequestRate(String ip) {
        String key = "sig:reqRate:" + safe(ip);
        String v = redis.opsForValue().get(key);
        return v == null ? 0 : Long.parseLong(v);
    }

    private static String safe(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }
}
