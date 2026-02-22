package com.xrs.orderservice.controller;

import com.xrs.orderservice.entity.OrderSagaState;
import com.xrs.orderservice.entity.ProcessedEvent;
import com.xrs.orderservice.repository.OrderSagaStateRepository;
import com.xrs.orderservice.repository.ProcessedEventRepository;
import com.xrs.orderservice.service.SagaRecoveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API for saga monitoring and management
 * Provides visibility into saga execution, failures, and recovery
 */
@RestController
@RequestMapping("/api/saga")
@RequiredArgsConstructor
@Slf4j
public class SagaMonitoringController {

    private final OrderSagaStateRepository sagaStateRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final SagaRecoveryService sagaRecoveryService;

    /**
     * Get saga state for a specific order
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderSagaState> getSagaState(@PathVariable Integer orderId) {
        log.info("Fetching saga state for order: {}", orderId);
        
        return sagaStateRepository.findByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all sagas by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderSagaState>> getSagasByStatus(
            @PathVariable OrderSagaState.SagaStatus status) {
        log.info("Fetching sagas with status: {}", status);
        
        List<OrderSagaState> sagas = sagaStateRepository.findBySagaStatus(status);
        return ResponseEntity.ok(sagas);
    }

    /**
     * Get all failed sagas
     */
    @GetMapping("/failed")
    public ResponseEntity<List<OrderSagaState>> getFailedSagas() {
        log.info("Fetching failed sagas");
        
        List<OrderSagaState.SagaStatus> failedStatuses = List.of(
                OrderSagaState.SagaStatus.FAILED,
                OrderSagaState.SagaStatus.CANCELLED
        );
        
        List<OrderSagaState> failedSagas = sagaStateRepository.findBySagaStatusIn(failedStatuses);
        return ResponseEntity.ok(failedSagas);
    }

    /**
     * Get all in-progress sagas
     */
    @GetMapping("/in-progress")
    public ResponseEntity<List<OrderSagaState>> getInProgressSagas() {
        log.info("Fetching in-progress sagas");
        
        List<OrderSagaState.SagaStatus> inProgressStatuses = List.of(
                OrderSagaState.SagaStatus.STARTED,
                OrderSagaState.SagaStatus.INVENTORY_RESERVING,
                OrderSagaState.SagaStatus.INVENTORY_RESERVED,
                OrderSagaState.SagaStatus.PAYMENT_PROCESSING,
                OrderSagaState.SagaStatus.PAYMENT_COMPLETED,
                OrderSagaState.SagaStatus.SHIPMENT_CREATING,
                OrderSagaState.SagaStatus.COMPENSATING
        );
        
        List<OrderSagaState> inProgressSagas = sagaStateRepository.findBySagaStatusIn(inProgressStatuses);
        return ResponseEntity.ok(inProgressSagas);
    }

    /**
     * Get saga statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<SagaStats> getSagaStats() {
        log.info("Fetching saga statistics");
        
        long totalSagas = sagaStateRepository.count();
        
        // Count by status
        Map<OrderSagaState.SagaStatus, Long> statusCounts = sagaStateRepository.findAll().stream()
                .collect(Collectors.groupingBy(OrderSagaState::getSagaStatus, Collectors.counting()));

        // Get recovery stats
        SagaRecoveryService.RecoveryStats recoveryStats = sagaRecoveryService.getRecoveryStats();

        SagaStats stats = new SagaStats(
                totalSagas,
                statusCounts.getOrDefault(OrderSagaState.SagaStatus.COMPLETED, 0L),
                statusCounts.getOrDefault(OrderSagaState.SagaStatus.FAILED, 0L),
                statusCounts.getOrDefault(OrderSagaState.SagaStatus.CANCELLED, 0L),
                recoveryStats.inProgressSagas(),
                calculateSuccessRate(totalSagas, statusCounts.getOrDefault(OrderSagaState.SagaStatus.COMPLETED, 0L)),
                statusCounts
        );

        return ResponseEntity.ok(stats);
    }

    /**
     * Get processed events for an order
     */
    @GetMapping("/orders/{orderId}/events")
    public ResponseEntity<List<ProcessedEvent>> getProcessedEvents(@PathVariable Integer orderId) {
        log.info("Fetching processed events for order: {}", orderId);
        
        List<ProcessedEvent> events = processedEventRepository.findByOrderId(orderId);
        return ResponseEntity.ok(events);
    }

    /**
     * Manually trigger recovery for a specific order
     */
    @PostMapping("/orders/{orderId}/recover")
    public ResponseEntity<String> recoverSaga(@PathVariable Integer orderId) {
        log.info("Manual recovery triggered for order: {}", orderId);
        
        try {
            sagaRecoveryService.recoverSagaForOrder(orderId);
            return ResponseEntity.ok("Saga recovery initiated for order: " + orderId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error recovering saga: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to recover saga: " + e.getMessage());
        }
    }

    /**
     * Get recovery statistics
     */
    @GetMapping("/recovery/stats")
    public ResponseEntity<SagaRecoveryService.RecoveryStats> getRecoveryStats() {
        log.info("Fetching recovery statistics");
        
        SagaRecoveryService.RecoveryStats stats = sagaRecoveryService.getRecoveryStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Health check endpoint for saga monitoring
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        List<OrderSagaState.SagaStatus> failedStatuses = List.of(
                OrderSagaState.SagaStatus.FAILED,
                OrderSagaState.SagaStatus.CANCELLED
        );
        
        long failedCount = sagaStateRepository.findBySagaStatusIn(failedStatuses).size();
        
        return ResponseEntity.ok(Map.of(
                "status", failedCount > 10 ? "WARNING" : "HEALTHY",
                "failedSagasCount", failedCount,
                "timestamp", System.currentTimeMillis()
        ));
    }

    private double calculateSuccessRate(long total, long completed) {
        if (total == 0) return 0.0;
        return (completed * 100.0) / total;
    }

    public record SagaStats(
            long totalSagas,
            long completedSagas,
            long failedSagas,
            long cancelledSagas,
            long inProgressSagas,
            double successRate,
            Map<OrderSagaState.SagaStatus, Long> statusBreakdown
    ) {}
}
