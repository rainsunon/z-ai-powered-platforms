package com.xrs.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Tracks the state of order saga for distributed transaction coordination
 * Enables saga recovery and monitoring
 */
@Entity
@Table(name = "order_saga_state", indexes = {
        @Index(name = "idx_order_id", columnList = "order_id"),
        @Index(name = "idx_saga_status", columnList = "saga_status")
})
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderSagaState implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saga_id", unique = true, nullable = false, updatable = false)
    private Long sagaId;

    /**
     * Order ID this saga is coordinating
     */
    @Column(name = "order_id", nullable = false, unique = true)
    private Integer orderId;

    /**
     * Current step in the saga (e.g., INVENTORY_RESERVATION, PAYMENT_PROCESSING)
     */
    @Column(name = "current_step", nullable = false, length = 50)
    private String currentStep;

    /**
     * Overall saga status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "saga_status", nullable = false, length = 20)
    private SagaStatus sagaStatus;

    /**
     * Inventory reservation ID (for compensation)
     */
    @Column(name = "reservation_id", length = 100)
    private String reservationId;

    /**
     * Payment ID (for compensation)
     */
    @Column(name = "payment_id")
    private String paymentId;

    /**
     * Shipment ID
     */
    @Column(name = "shipment_id")
    private String shipmentId;

    /**
     * Error message if saga failed
     */
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * Number of retry attempts
     */
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private Integer retryCount = 0;

    /**
     * When the saga started
     */
    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    /**
     * When the saga completed or failed
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Last update time
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum SagaStatus {
        STARTED,
        INVENTORY_RESERVING,
        INVENTORY_RESERVED,
        PAYMENT_PROCESSING,
        PAYMENT_COMPLETED,
        SHIPMENT_CREATING,
        COMPLETED,
        COMPENSATING,
        FAILED,
        CANCELLED;

        /**
         * Check if this status is terminal (saga has finished)
         */
        public boolean isTerminal() {
            return this == COMPLETED || this == FAILED || this == CANCELLED;
        }
    }

    /**
     * Move saga to next step
     */
    public void moveToNextStep(String step, SagaStatus status) {
        this.currentStep = step;
        this.sagaStatus = status;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark saga as failed
     */
    public void markAsFailed(String errorMessage) {
        this.sagaStatus = SagaStatus.FAILED;
        this.errorMessage = errorMessage;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark saga as completed
     */
    public void markAsCompleted() {
        this.sagaStatus = SagaStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Increment retry count
     */
    public void incrementRetry() {
        this.retryCount++;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Start compensation
     */
    public void startCompensation() {
        this.sagaStatus = SagaStatus.COMPENSATING;
        this.updatedAt = LocalDateTime.now();
    }
}
