package com.github.dimitryivaniuta.gateway.kafka;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Kafka configuration wiring for this demo.
 */
@Configuration
@EnableConfigurationProperties(OutboxKafkaProperties.class)
public class KafkaConfig {
}
