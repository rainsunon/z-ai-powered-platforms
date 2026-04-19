package com.xrs.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * OutboxEvent entity for transactional outbox pattern
 * Ensures atomicity between database changes and event publishing
 * Events are stored in DB first, then published to Kafka by OutboxPublisher
 */
@Entity
@Table(name = "outbox_events", indexes = {
        @Index(name = "idx_published", columnList = "published"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OutboxEvent implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false, updatable = false)
    private Long id;

    /**
     * Unique event ID for idempotency
     */
    @Column(name = "event_id", unique = true, nullable = false, length = 36)
    private String eventId;

    /**
     * Kafka topic to publish to
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
     * When the event was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Whether the event has been published to Kafka
     */
    @Column(name = "published", nullable = false)
    @Builder.Default
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
    @Builder.Default
    private Integer retryCount = 0;

    /**
     * Last error message if publish failed
     */
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * Factory method to create outbox event
     */
    public static OutboxEvent create(String eventId, String topic, String eventKey, String payload,
                                      String eventType, String aggregateId, String aggregateType) {
        return OutboxEvent.builder()
                .eventId(eventId)
                .topic(topic)
                .eventKey(eventKey)
                .payload(payload)
                .eventType(eventType)
                .aggregateId(aggregateId)
                .aggregateType(aggregateType)
                .createdAt(LocalDateTime.now())
                .published(false)
                .retryCount(0)
                .build();
    }

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
    public boolean isMaxRetriesExceeded() {
        return retryCount >= 3;
    }
}
