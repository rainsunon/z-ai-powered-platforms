package com.xrs.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Dead Letter Queue for failed events
 * Stores events that failed processing after max retries
 * Allows manual inspection and reprocessing
 */
@Entity
@Table(name = "dead_letter_queue", indexes = {
        @Index(name = "idx_dlq_event_type", columnList = "event_type"),
        @Index(name = "idx_dlq_order_id", columnList = "order_id"),
        @Index(name = "idx_dlq_created_at", columnList = "created_at")
})
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeadLetterEvent implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false, updatable = false)
    private Long id;

    /**
     * Original event ID
     */
    @Column(name = "event_id", nullable = false, length = 255)
    private String eventId;

    /**
     * Event type (e.g., INVENTORY_RESERVED, PAYMENT_COMPLETED)
     */
    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    /**
     * Order ID associated with this event
     */
    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    /**
     * Original event payload
     */
    @Column(name = "payload", columnDefinition = "TEXT", nullable = false)
    private String payload;

    /**
     * Kafka topic this event came from
     */
    @Column(name = "topic", length = 255)
    private String topic;

    /**
     * Reason for failure
     */
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    /**
     * Stack trace of the error
     */
    @Column(name = "error_stacktrace", columnDefinition = "TEXT")
    private String errorStacktrace;

    /**
     * Number of times this event failed processing
     */
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private Integer retryCount = 0;

    /**
     * Status of this DLQ entry
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private DLQStatus status = DLQStatus.PENDING;

    /**
     * When the event was first added to DLQ
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Last time this event was processed/retried
     */
    @Column(name = "last_processed_at")
    private LocalDateTime lastProcessedAt;

    /**
     * When the event was resolved (successfully reprocessed or manually handled)
     */
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    /**
     * Comments/notes about this DLQ entry (for manual intervention)
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum DLQStatus {
        PENDING,      // Waiting for manual intervention
        REPROCESSING, // Being retried
        RESOLVED,     // Successfully reprocessed
        DISCARDED     // Manually discarded as invalid
    }

    /**
     * Factory method to create a DLQ entry from a failed event
     */
    public static DeadLetterEvent fromFailedEvent(
            String eventId,
            String eventType,
            Integer orderId,
            String payload,
            String topic,
            String failureReason,
            String stackTrace,
            int retryCount) {
        
        return DeadLetterEvent.builder()
                .eventId(eventId)
                .eventType(eventType)
                .orderId(orderId)
                .payload(payload)
                .topic(topic)
                .failureReason(failureReason)
                .errorStacktrace(stackTrace)
                .retryCount(retryCount)
                .status(DLQStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build()
;
    }

    /**
     * Mark event as being reprocessed
     */
    public void markAsReprocessing() {
        this.status = DLQStatus.REPROCESSING;
        this.lastProcessedAt = LocalDateTime.now();
    }

    /**
     * Mark event as resolved
     */
    public void markAsResolved(String notes) {
        this.status = DLQStatus.RESOLVED;
        this.resolvedAt = LocalDateTime.now();
        this.notes = notes;
    }

    /**
     * Mark event as discarded
     */
    public void markAsDiscarded(String reason) {
        this.status = DLQStatus.DISCARDED;
        this.resolvedAt = LocalDateTime.now();
        this.notes = reason;
    }

    /**
     * Increment retry count
     */
    public void incrementRetry() {
        this.retryCount++;
        this.lastProcessedAt = LocalDateTime.now();
    }
}
