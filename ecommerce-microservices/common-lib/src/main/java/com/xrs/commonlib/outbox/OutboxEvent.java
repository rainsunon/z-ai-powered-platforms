package com.xrs.commonlib.outbox;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * OutboxEvent entity for transactional outbox pattern.
 * Ensures atomicity between database changes and event publishing.
 * Events are stored in DB first, then published to message broker by OutboxPublisher.
 * 
 * This is a base class that can be extended by services for custom fields.
 */
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@Data
public abstract class OutboxEvent implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Unique event ID for idempotency
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false, updatable = false)
    private Long id;

    /**
     * Unique event ID for idempotency across services
     */
    @Column(name = "event_id", unique = true, nullable = false, length = 36)
    private String eventId;

    /**
     * Message broker topic to publish to
     */
    @Column(name = "topic", nullable = false, length = 100)
    private String topic;

    /**
     * Event key (for partitioning in Kafka)
     */
    @Column(name = "event_key", length = 100)
    private String eventKey;

    /**
     * Event payload (JSON)
     */
    @Column(name = "payload", nullable = false, columnDefinition = "TEXT")
    private String payload;

    /**
     * Event type (e.g., OrderCreatedEvent, OrderConfirmedEvent)
     */
    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    /**
     * Aggregate ID (orderId, userId, etc.)
     */
    @Column(name = "aggregate_id", nullable = false, length = 50)
    private String aggregateId;

    /**
     * Aggregate type (Order, Payment, Inventory, etc.)
     */
    @Column(name = "aggregate_type", nullable = false, length = 50)
    private String aggregateType;

    /**
     * Correlation ID for tracing across services
     */
    @Column(name = "correlation_id", length = 36)
    private String correlationId;

    /**
     * Causation ID for tracking event causality
     */
    @Column(name = "causation_id", length = 36)
    private String causationId;

    /**
     * When the event was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Whether the event has been published to message broker
     */
    @Column(name = "published", nullable = false)
    private Boolean published = false;

    /**
     * When the event was published
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * Number of publish attempts (for retry tracking)
     */
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    /**
     * Last error message if publish failed
     */
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * Mark event as published
     */
    public void markAsPublished() {
        this.published = true;
        this.publishedAt = LocalDateTime.now();
        this.errorMessage = null;
    }

    /**
     * Increment retry count and record error
     */
    public void recordFailure(String error) {
        this.retryCount++;
        this.errorMessage = error;
    }

    /**
     * Check if max retries exceeded (e.g., 3 retries)
     */
    public boolean isMaxRetriesExceeded(int maxRetries) {
        return retryCount >= maxRetries;
    }
}
