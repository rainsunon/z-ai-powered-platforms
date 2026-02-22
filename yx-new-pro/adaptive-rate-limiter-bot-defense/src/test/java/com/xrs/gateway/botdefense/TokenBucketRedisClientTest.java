package com.xrs.gateway.botdefense;

import com.xrs.gateway.botdefense.redis.TokenBucketRedisClient;
import com.xrs.gateway.botdefense.testsupport.Containers;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Validates the atomic Lua token bucket.
 */
class TokenBucketRedisClientTest {

    @AfterAll
    static void cleanup() {
        // Leave containers running for other tests.
    }

    @Test
    void shouldConsumeAndThenDenyWhenEmpty() {
        LettuceConnectionFactory cf = new LettuceConnectionFactory(Containers.REDIS.getHost(), Containers.REDIS.getMappedPort(6379));
        cf.afterPropertiesSet();
        StringRedisTemplate tpl = new StringRedisTemplate(cf);
        tpl.afterPropertiesSet();

        DefaultRedisScript<String> script = new DefaultRedisScript<>();
        script.setLocation(new ClassPathResource("redis/token_bucket.lua"));
        script.setResultType(String.class);

        TokenBucketRedisClient client = new TokenBucketRedisClient(tpl, script);

        String key = "test:bucket";
        tpl.delete(key);

        long now = System.currentTimeMillis();
        // Capacity=3, no refill.
        assertThat(client.consume(key, 3, 0, now).allowed()).isTrue();
        assertThat(client.consume(key, 3, 0, now).allowed()).isTrue();
        assertThat(client.consume(key, 3, 0, now).allowed()).isTrue();

        TokenBucketRedisClient.BucketResult denied = client.consume(key, 3, 0, now);
        assertThat(denied.allowed()).isFalse();

        cf.destroy();
    }
}
