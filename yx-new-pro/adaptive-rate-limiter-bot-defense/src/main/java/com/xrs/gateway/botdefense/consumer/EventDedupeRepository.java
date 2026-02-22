package com.xrs.gateway.botdefense.consumer;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

/**
 * Simple Redis-based eventId dedupe.
 * <p>
 * Uses SETNX with TTL: first processor marks the event as processed.
 */
@Repository
public class EventDedupeRepository {

    private final StringRedisTemplate redis;
    private final ConsumerProperties props;

    public EventDedupeRepository(StringRedisTemplate redis, ConsumerProperties props) {
        this.redis = redis;
        this.props = props;
    }

    /**
     * Try to mark eventId as processed.
     *
     * @return true if this call won (should process), false if already processed.
     */
    public boolean tryMarkProcessed(String eventId) {
        if (eventId == null || eventId.isBlank()) {
            return true; // nothing to dedupe
        }
        String key = "botdefense:dedupe:event:" + eventId;
        Boolean ok = redis.opsForValue().setIfAbsent(key, "1", Duration.ofSeconds(props.getDedupeTtlSeconds()));
        return Boolean.TRUE.equals(ok);
    }
}
