package com.github.dimitryivaniuta.gateway.kafka;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Kafka-related configuration for outbox publishing.
 */
@Data
@ConfigurationProperties(prefix = "outbox.kafka")
public class OutboxKafkaProperties {

    /**
     * Kafka topic where all domain events are published.
     */
    private String topic = "domain-events";
}
