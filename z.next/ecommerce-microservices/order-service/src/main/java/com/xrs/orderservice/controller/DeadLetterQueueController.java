package com.xrs.orderservice.controller;

import com.xrs.orderservice.entity.DeadLetterEvent;
import com.xrs.orderservice.repository.DeadLetterEventRepository;
import com.xrs.orderservice.service.DeadLetterQueueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API for Dead Letter Queue management
 * Allows viewing and reprocessing failed events
 */
@RestController
@RequestMapping("/api/dlq")
@RequiredArgsConstructor
@Slf4j
public class DeadLetterQueueController {

    private final DeadLetterQueueService dlqService;
    private final DeadLetterEventRepository dlqRepository;

    /**
     * Get all pending DLQ events
     */
    @GetMapping("/pending")
    public ResponseEntity<List<DeadLetterEvent>> getPendingEvents() {
        log.info("Fetching pending DLQ events");
        List<DeadLetterEvent> events = dlqService.getPendingEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * Get DLQ event by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DeadLetterEvent> getEvent(@PathVariable Long id) {
        log.info("Fetching DLQ event: {}", id);
        return dlqRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get DLQ events for a specific order
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<DeadLetterEvent>> getEventsForOrder(@PathVariable Integer orderId) {
        log.info("Fetching DLQ events for order: {}", orderId);
        List<DeadLetterEvent> events = dlqService.getEventsForOrder(orderId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get DLQ events by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<DeadLetterEvent>> getEventsByStatus(
            @PathVariable DeadLetterEvent.DLQStatus status) {
        log.info("Fetching DLQ events with status: {}", status);
        List<DeadLetterEvent> events = dlqRepository.findByStatus(status);
        return ResponseEntity.ok(events);
    }

    /**
     * Manually reprocess a DLQ event
     */
    @PostMapping("/{id}/reprocess")
    public ResponseEntity<String> reprocessEvent(@PathVariable Long id) {
        log.info("Reprocessing DLQ event: {}", id);
        
        try {
            dlqService.reprocessEvent(id);
            return ResponseEntity.ok("Event reprocessed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error reprocessing event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Failed to reprocess event: " + e.getMessage());
        }
    }

    /**
     * Discard a DLQ event
     */
    @PostMapping("/{id}/discard")
    public ResponseEntity<String> discardEvent(
            @PathVariable Long id,
            @RequestBody DiscardRequest request) {
        log.info("Discarding DLQ event {}: {}", id, request.reason());
        
        try {
            dlqService.discardEvent(id, request.reason());
            return ResponseEntity.ok("Event discarded");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error discarding event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Failed to discard event: " + e.getMessage());
        }
    }

    /**
     * Get DLQ statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<DeadLetterQueueService.DLQStats> getStats() {
        log.info("Fetching DLQ statistics");
        DeadLetterQueueService.DLQStats stats = dlqService.getStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Cleanup old DLQ entries
     */
    @PostMapping("/cleanup")
    public ResponseEntity<String> cleanup(@RequestParam(defaultValue = "30") int daysOld) {
        log.info("Cleaning up DLQ entries older than {} days", daysOld);
        
        try {
            int deleted = dlqService.cleanupOldEntries(daysOld);
            return ResponseEntity.ok(String.format("Cleaned up %d old DLQ entries", deleted));
        } catch (Exception e) {
            log.error("Error cleaning up DLQ: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Failed to cleanup DLQ: " + e.getMessage());
        }
    }

    public record DiscardRequest(String reason) {}
}
