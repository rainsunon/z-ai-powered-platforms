package com.github.dimitryivaniuta.gateway.outbox.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Enables configuration properties for outbox publishing.
 */
@Configuration
@EnableConfigurationProperties(OutboxPublisherProperties.class)
public class OutboxConfig {
}
