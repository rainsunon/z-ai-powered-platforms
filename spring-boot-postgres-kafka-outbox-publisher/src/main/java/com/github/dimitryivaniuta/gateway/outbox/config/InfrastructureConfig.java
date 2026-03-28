package com.github.dimitryivaniuta.gateway.outbox.config;

import java.time.Clock;
import java.util.UUID;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Common infrastructure beans.
 */
@Configuration
public class InfrastructureConfig {

    /**
     * Provides a UTC clock for consistent timestamps and testability.
     *
     * @return clock
     */
    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }

    /**
     * Unique identifier for this running instance (used for outbox row locking ownership).
     *
     * @return instance id string
     */
    @Bean
    public String instanceId() {
        return UUID.randomUUID().toString();
    }
}
