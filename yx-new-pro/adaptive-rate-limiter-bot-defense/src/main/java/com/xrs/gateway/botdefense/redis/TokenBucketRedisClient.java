package com.xrs.gateway.botdefense.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Redis-backed token bucket using an atomic Lua script.
 */
@Component
public class TokenBucketRedisClient {

    private final StringRedisTemplate redis;
    private final DefaultRedisScript<String> tokenBucketScript;

    public TokenBucketRedisClient(StringRedisTemplate redis,
                                 DefaultRedisScript<String> tokenBucketScript) {
        this.redis = redis;
        this.tokenBucketScript = tokenBucketScript;
    }

    /**
     * Attempts to consume one token from the bucket.
     *
     * @param key bucket key
     * @param capacity burst capacity
     * @param refillPerSecond refill rate
     * @param nowMillis current time millis
     * @return result
     */
    public BucketResult consume(String key, double capacity, double refillPerSecond, long nowMillis) {
        String raw = redis.execute(tokenBucketScript, List.of(key),
                Double.toString(capacity),
                Double.toString(refillPerSecond),
                Long.toString(nowMillis));

        if (raw == null || raw.isBlank()) {
            // Fail-open: do not block users if Redis misbehaves.
            return new BucketResult(true, (int) Math.floor(capacity), 0);
        }

        String[] parts = raw.split("\\|");
        int allowed = Integer.parseInt(parts[0]);
        int remaining = Integer.parseInt(parts[1]);
        long retryAfter = Long.parseLong(parts[2]);
        return new BucketResult(allowed == 1, remaining, retryAfter);
    }

    /**
     * Lua-script output parsed into a typed result.
     */
    public record BucketResult(boolean allowed, int remainingTokens, long retryAfterMillis) {
    }
}
