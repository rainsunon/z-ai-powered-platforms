package com.xrs.orderservice.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration for Micrometer metrics
 * Provides custom metrics for saga monitoring
 */
@Configuration
@Slf4j
public class MetricsConfig {

    @Value("${spring.application.name:order-service}")
    private String applicationName;

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config().commonTags(
                List.of(
                        Tag.of("application", applicationName),
                        Tag.of("service", "order-service"),
                        Tag.of("environment", System.getenv().getOrDefault("ENVIRONMENT", "development"))
                )
        );
    }

    /**
     * Custom metrics for saga monitoring
     * These would be incremented by the saga orchestrator and recovery service
     */
    @Bean
    public SagaMetrics sagaMetrics(MeterRegistry registry) {
        return new SagaMetrics(registry);
    }

    /**
     * Helper class for saga-specific metrics
     */
    public static class SagaMetrics {
        private final MeterRegistry registry;

        public SagaMetrics(MeterRegistry registry) {
            this.registry = registry;
        }

        public void recordSagaStarted() {
            registry.counter("saga.started", "type", "order").increment();
        }

        public void recordSagaCompleted() {
            registry.counter("saga.completed", "type", "order").increment();
        }

        public void recordSagaFailed(String reason) {
            registry.counter("saga.failed", "type", "order", "reason", reason).increment();
        }

        public void recordSagaRecovered() {
            registry.counter("saga.recovered", "type", "order").increment();
        }

        public void recordEventProcessed(String eventType) {
            registry.counter("saga.events.processed", "type", eventType).increment();
        }

        public void recordEventFailed(String eventType) {
            registry.counter("saga.events.failed", "type", eventType).increment();
        }

        public void recordDlqEntry() {
            registry.counter("saga.dlq.entries").increment();
        }

        public void recordDlqReprocessed() {
            registry.counter("saga.dlq.reprocessed").increment();
        }
    }
}
