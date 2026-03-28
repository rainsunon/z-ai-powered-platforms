package com.github.dimitryivaniuta.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Application entry point.
 *
 * <p>This demo implements the Transactional Outbox pattern:
 * business data and an outbox row are stored in the same DB transaction, then a background publisher
 * reliably publishes outbox events to Kafka with retries/backoff and cluster-safe claiming.</p>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class OutboxPublisherDemoApplication {

    /**
     * Bootstraps the Spring Boot application.
     *
     * @param args application arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(OutboxPublisherDemoApplication.class, args);
    }
}
