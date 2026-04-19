package com.xrs.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Tracks processed events for idempotency
 * Prevents duplicate event processing in distributed systems
 */
@Entity
@Table(name = "processed_events", indexes = {
        @Index(name = "idx_event_id", columnList = "event_id", unique = true),
        @Index(name = "idx_processed_at", columnList = "processed_at")
})
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProcessedEvent implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false, updatable = false)
    private Long id;

    /**
     * Unique event ID from the event message
     */
    @Column(name = "event_id", unique = true, nullable = false, length = 100)
    private String eventId;

    /**
     * Event type (e.g., InventoryReservedEvent, PaymentCompletedEvent)
     */
    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    /**
     * Order ID this event is related to
     */
    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    /**
     * Event payload (JSON)
     */
    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    /**
     * Processing status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ProcessingStatus status = ProcessingStatus.PROCESSED;

    /**
     * When the event was processed
     */
    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;

    public enum ProcessingStatus {
        PROCESSED,
        FAILED,
        DUPLICATE
    }

    /**
     * Check if event was already processed
     */
    public static boolean isDuplicate(ProcessedEvent event) {
        return event != null && event.getStatus() == ProcessingStatus.PROCESSED;
    }

    /**
     * Factory method to create processed event record
     */
    public static ProcessedEvent create(String eventId, String eventType, Integer orderId, String payload) {
        return ProcessedEvent.builder()
                .eventId(eventId)
                .eventType(eventType)
                .orderId(orderId)
                .payload(payload)
                .status(ProcessingStatus.PROCESSED)
                .processedAt(LocalDateTime.now())
                .build();
    }
}
