package com.github.dimitryivaniuta.audittrail.config;

import java.time.Duration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Cache configuration.
 *
 * <p>Production profile uses Redis via Spring Boot auto-configuration.
 * The {@code test} profile uses an in-memory cache to keep tests deterministic.</p>
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * In-memory cache manager for tests.
     *
     * @return cache manager
     */
    @Bean
    @Profile("test")
    public CacheManager inMemoryCacheManager() {
        return new ConcurrentMapCacheManager("audit-record");
    }
}
