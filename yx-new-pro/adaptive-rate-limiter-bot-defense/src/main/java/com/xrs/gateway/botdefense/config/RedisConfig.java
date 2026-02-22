package com.xrs.gateway.botdefense.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.script.DefaultRedisScript;

/**
 * Redis configuration for token-bucket enforcement.
 */
@Configuration
public class RedisConfig {

    /**
     * Lua script implementing an atomic token-bucket.
     *
     * <p>Hash fields:
     * <ul>
     *   <li>t = current tokens (double)</li>
     *   <li>ts = last refill timestamp millis (long)</li>
     * </ul>
     */
    @Bean
    public DefaultRedisScript<String> tokenBucketScript() {
        DefaultRedisScript<String> script = new DefaultRedisScript<>();
        script.setLocation(new ClassPathResource("redis/token_bucket.lua"));
        script.setResultType(String.class);
        return script;
    }
}
