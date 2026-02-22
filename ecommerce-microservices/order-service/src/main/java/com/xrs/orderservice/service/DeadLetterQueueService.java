package com.xrs.orderservice.service;

import com.google.gson.Gson;
import com.xrs.orderservice.entity.DeadLetterEvent;
import com.xrs.orderservice.repository.DeadLetterEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing Dead Letter Queue
 * Handles events that failed processing after max retries
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DeadLetterQueueService {

    private final DeadLetterEventRepository deadLetterEventRepository;
    private final OrderSagaOrchestrator orderSagaOrchestrator;
    private final Gson gson = new Gson();

    private static final int MAX_EVENT_RETRIES = 3;

    /**
     * Send failed event to Dead Letter Queue
     */
    @Transactional
    public void sendToDeadLetterQueue(
            String eventId,
            String eventType,
            Integer orderId,
            String payload,
            String topic,
            Exception exception,
            int retryCount) {
        
        log.error("Sending event to DLQ: eventId={}, eventType={}, orderId={}, retries={}", 
                 eventId, eventType, orderId, retryCount);

        // Check if already in DLQ
        if (deadLetterEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already in DLQ, updating retry count", eventId);
            deadLetterEventRepository.findByEventId(eventId).ifPresent(dlqEvent -> {
                dlqEvent.incrementRetry();
                deadLetterEventRepository.save(dlqEvent);
            });
            return;
        }

        // Get stack trace
        String stackTrace = getStackTrace(exception);

        // Create DLQ entry
        DeadLetterEvent dlqEvent = DeadLetterEvent.fromFailedEvent(
                eventId,
                eventType,
                orderId,
                payload,
                topic,
                exception.getMessage(),
                stackTrace,
                retryCount
        );

        deadLetterEventRepository.save(dlqEvent);
        log.info("Event {} successfully added to DLQ", eventId);
    }

    /**
     * Check if event should be sent to DLQ based on retry count
     */
    public boolean shouldSendToDeadLetterQueue(int retryCount) {
        return retryCount >= MAX_EVENT_RETRIES;
    }

    /**
     * Reprocess a DLQ event manually
     */
    @Transactional
    public void reprocessEvent(Long dlqId) {
        log.info("Attempting to reprocess DLQ event: {}", dlqId);

        DeadLetterEvent dlqEvent = deadLetterEventRepository.findById(dlqId)
                .orElseThrow(() -> new IllegalArgumentException("DLQ event not found: " + dlqId));

        if (dlqEvent.getStatus() != DeadLetterEvent.DLQStatus.PENDING) {
            throw new IllegalStateException("Can only reprocess PENDING events");
        }

        try {
            dlqEvent.markAsReprocessing();
            deadLetterEventRepository.save(dlqEvent);

            // Parse event and route to appropriate handler
            reprocessEventByType(dlqEvent);

            // Mark as resolved
            dlqEvent.markAsResolved("Successfully reprocessed");
            deadLetterEventRepository.save(dlqEvent);

            log.info("Successfully reprocessed DLQ event: {}", dlqId);

        } catch (Exception e) {
            log.error("Failed to reprocess DLQ event {}: {}", dlqId, e.getMessage(), e);
            dlqEvent.incrementRetry();
            dlqEvent.setStatus(DeadLetterEvent.DLQStatus.PENDING);
            dlqEvent.setFailureReason("Reprocessing failed: " + e.getMessage());
            deadLetterEventRepository.save(dlqEvent);
            throw new RuntimeException("Failed to reprocess event", e);
        }
    }

    /**
     * Route event to appropriate handler based on type
     */
    private void reprocessEventByType(DeadLetterEvent dlqEvent) {
        switch (dlqEvent.getEventType()) {
            case "INVENTORY_RESERVED":
                // Parse and call orchestrator
                var inventoryEvent = gson.fromJson(dlqEvent.getPayload(), InventoryReservedEvent.class);
                orderSagaOrchestrator.handleInventoryReserved(
                        inventoryEvent.eventId(), 
                        inventoryEvent.orderId(), 
                        inventoryEvent.reservationId()
                );
                break;

            case "PAYMENT_COMPLETED":
                var paymentEvent = gson.fromJson(dlqEvent.getPayload(), PaymentCompletedEvent.class);
                orderSagaOrchestrator.handlePaymentCompleted(
                        paymentEvent.eventId(), 
                        paymentEvent.orderId(), 
                        paymentEvent.paymentId()
                );
                break;

            case "SHIPMENT_CREATED":
                var shipmentEvent = gson.fromJson(dlqEvent.getPayload(), ShipmentCreatedEvent.class);
                orderSagaOrchestrator.handleShipmentCreated(
                        shipmentEvent.eventId(), 
                        shipmentEvent.orderId(), 
                        shipmentEvent.shipmentId()
                );
                break;

            default:
                throw new IllegalArgumentException("Unknown event type: " + dlqEvent.getEventType());
        }
    }

    /**
     * Discard a DLQ event (mark as invalid/unprocessable)
     */
    @Transactional
    public void discardEvent(Long dlqId, String reason) {
        log.info("Discarding DLQ event {}: {}", dlqId, reason);

        DeadLetterEvent dlqEvent = deadLetterEventRepository.findById(dlqId)
                .orElseThrow(() -> new IllegalArgumentException("DLQ event not found: " + dlqId));

        dlqEvent.markAsDiscarded(reason);
        deadLetterEventRepository.save(dlqEvent);

        log.info("DLQ event {} discarded", dlqId);
    }

    /**
     * Get all pending DLQ events
     */
    public List<DeadLetterEvent> getPendingEvents() {
        return deadLetterEventRepository.findByStatus(DeadLetterEvent.DLQStatus.PENDING);
    }

    /**
     * Get DLQ events for an order
     */
    public List<DeadLetterEvent> getEventsForOrder(Integer orderId) {
        return deadLetterEventRepository.findByOrderId(orderId);
    }

    /**
     * Cleanup old resolved/discarded DLQ entries
     */
    @Transactional
    public int cleanupOldEntries(int daysOld) {
        log.info("Cleaning up DLQ entries older than {} days", daysOld);

        LocalDateTime threshold = LocalDateTime.now().minusDays(daysOld);
        
        List<DeadLetterEvent> oldResolved = deadLetterEventRepository
                .findByStatusAndCreatedAtBefore(DeadLetterEvent.DLQStatus.RESOLVED, threshold);
        
        List<DeadLetterEvent> oldDiscarded = deadLetterEventRepository
                .findByStatusAndCreatedAtBefore(DeadLetterEvent.DLQStatus.DISCARDED, threshold);

        int totalDeleted = oldResolved.size() + oldDiscarded.size();
        
        deadLetterEventRepository.deleteAll(oldResolved);
        deadLetterEventRepository.deleteAll(oldDiscarded);

        log.info("Cleaned up {} old DLQ entries", totalDeleted);
        return totalDeleted;
    }

    /**
     * Get DLQ statistics
     */
    public DLQStats getStats() {
        long total = deadLetterEventRepository.count();
        long pending = deadLetterEventRepository.findByStatus(DeadLetterEvent.DLQStatus.PENDING).size();
        long reprocessing = deadLetterEventRepository.findByStatus(DeadLetterEvent.DLQStatus.REPROCESSING).size();
        long resolved = deadLetterEventRepository.findByStatus(DeadLetterEvent.DLQStatus.RESOLVED).size();
        long discarded = deadLetterEventRepository.findByStatus(DeadLetterEvent.DLQStatus.DISCARDED).size();

        return new DLQStats(total, pending, reprocessing, resolved, discarded);
    }

    private String getStackTrace(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    // Event DTOs for reprocessing
    private record InventoryReservedEvent(String eventId, Integer orderId, String reservationId) {}
    private record PaymentCompletedEvent(String eventId, Integer orderId, String paymentId) {}
    private record ShipmentCreatedEvent(String eventId, Integer orderId, String shipmentId) {}

    public record DLQStats(
            long total,
            long pending,
            long reprocessing,
            long resolved,
            long discarded
    ) {}
}
