package com.xrs.orderservice.service;

import com.xrs.orderservice.entity.OrderSagaState;
import com.xrs.orderservice.repository.OrderSagaStateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for recovering stuck or failed sagas
 * Runs periodically to identify and retry sagas that are in a non-terminal state
 * for too long or have failed but are eligible for retry
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SagaRecoveryService {

    private final OrderSagaStateRepository sagaStateRepository;
    private final OrderSagaOrchestrator orderSagaOrchestrator;

    private static final int MAX_RETRY_COUNT = 3;
    private static final int STUCK_SAGA_MINUTES = 10;

    /**
     * Recovery job that runs every 5 minutes
     * Identifies stuck sagas and attempts to recover them
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void recoverStuckSagas() {
        log.info("Starting saga recovery job");

        try {
            // Find sagas that are not in terminal state and are eligible for retry
            List<OrderSagaState.SagaStatus> recoverableStatuses = List.of(
                    OrderSagaState.SagaStatus.STARTED,
                    OrderSagaState.SagaStatus.INVENTORY_RESERVING,
                    OrderSagaState.SagaStatus.INVENTORY_RESERVED,
                    OrderSagaState.SagaStatus.PAYMENT_PROCESSING,
                    OrderSagaState.SagaStatus.PAYMENT_COMPLETED,
                    OrderSagaState.SagaStatus.SHIPMENT_CREATING,
                    OrderSagaState.SagaStatus.COMPENSATING
            );

            List<OrderSagaState> stuckSagas = sagaStateRepository
                    .findBySagaStatusInAndRetryCountLessThan(recoverableStatuses, MAX_RETRY_COUNT);

            log.info("Found {} potentially stuck sagas", stuckSagas.size());

            int recoveredCount = 0;
            int skippedCount = 0;

            for (OrderSagaState saga : stuckSagas) {
                // Check if saga is actually stuck (no update in last N minutes)
                if (isStuck(saga)) {
                    log.warn("Attempting to recover stuck saga: orderId={}, status={}, retryCount={}", 
                             saga.getOrderId(), saga.getSagaStatus(), saga.getRetryCount());
                    
                    try {
                        recoverSaga(saga);
                        recoveredCount++;
                    } catch (Exception e) {
                        log.error("Failed to recover saga for order {}: {}", 
                                 saga.getOrderId(), e.getMessage(), e);
                    }
                } else {
                    skippedCount++;
                }
            }

            log.info("Saga recovery job completed: recovered={}, skipped={}", 
                     recoveredCount, skippedCount);

        } catch (Exception e) {
            log.error("Error in saga recovery job: {}", e.getMessage(), e);
        }
    }

    /**
     * Check if saga is stuck (no updates in configured time window)
     */
    private boolean isStuck(OrderSagaState saga) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(STUCK_SAGA_MINUTES);
        return saga.getUpdatedAt().isBefore(threshold);
    }

    /**
     * Attempt to recover a stuck saga based on its current state
     */
    private void recoverSaga(OrderSagaState saga) {
        saga.incrementRetry();
        
        switch (saga.getSagaStatus()) {
            case STARTED:
            case INVENTORY_RESERVING:
                // Saga stuck waiting for inventory reservation
                // Could republish inventory reservation request
                log.info("Saga stuck in inventory reservation phase for order {}", saga.getOrderId());
                saga.setErrorMessage("Recovery: Stuck in inventory reservation");
                break;

            case INVENTORY_RESERVED:
            case PAYMENT_PROCESSING:
                // Saga stuck waiting for payment
                log.info("Saga stuck in payment processing phase for order {}", saga.getOrderId());
                saga.setErrorMessage("Recovery: Stuck in payment processing");
                break;

            case PAYMENT_COMPLETED:
            case SHIPMENT_CREATING:
                // Saga stuck waiting for shipment
                log.info("Saga stuck in shipment creation phase for order {}", saga.getOrderId());
                saga.setErrorMessage("Recovery: Stuck in shipment creation");
                break;

            case COMPENSATING:
                // Saga stuck in compensation
                log.info("Saga stuck in compensation phase for order {}", saga.getOrderId());
                
                if (saga.getRetryCount() >= MAX_RETRY_COUNT) {
                    // Give up on this saga
                    saga.markAsFailed("Max retries exceeded during compensation");
                    orderSagaOrchestrator.handleSagaFailure(saga.getOrderId(), 
                            "Recovery failed: Max retries exceeded");
                }
                break;

            default:
                log.warn("Unknown saga status during recovery: {}", saga.getSagaStatus());
        }

        sagaStateRepository.save(saga);
    }

    /**
     * Manually trigger saga recovery for a specific order
     * Useful for admin operations
     */
    @Transactional
    public void recoverSagaForOrder(Integer orderId) {
        log.info("Manual saga recovery triggered for order {}", orderId);
        
        OrderSagaState saga = sagaStateRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Saga not found for order: " + orderId));

        if (saga.getSagaStatus().isTerminal()) {
            throw new IllegalStateException("Cannot recover saga in terminal state: " + saga.getSagaStatus());
        }

        if (saga.getRetryCount() >= MAX_RETRY_COUNT) {
            throw new IllegalStateException("Max retries exceeded for saga");
        }

        recoverSaga(saga);
    }

    /**
     * Get recovery statistics
     */
    public RecoveryStats getRecoveryStats() {
        long totalSagas = sagaStateRepository.count();
        
        List<OrderSagaState.SagaStatus> failedStatuses = List.of(
                OrderSagaState.SagaStatus.FAILED,
                OrderSagaState.SagaStatus.CANCELLED
        );
        
        long failedSagas = sagaStateRepository.findBySagaStatusIn(failedStatuses).size();
        
        List<OrderSagaState.SagaStatus> inProgressStatuses = List.of(
                OrderSagaState.SagaStatus.STARTED,
                OrderSagaState.SagaStatus.INVENTORY_RESERVING,
                OrderSagaState.SagaStatus.INVENTORY_RESERVED,
                OrderSagaState.SagaStatus.PAYMENT_PROCESSING,
                OrderSagaState.SagaStatus.PAYMENT_COMPLETED,
                OrderSagaState.SagaStatus.SHIPMENT_CREATING,
                OrderSagaState.SagaStatus.COMPENSATING
        );
        
        long inProgressSagas = sagaStateRepository.findBySagaStatusIn(inProgressStatuses).size();
        long completedSagas = sagaStateRepository.findBySagaStatus(OrderSagaState.SagaStatus.COMPLETED).size();

        return new RecoveryStats(totalSagas, completedSagas, inProgressSagas, failedSagas);
    }

    public record RecoveryStats(
            long totalSagas,
            long completedSagas,
            long inProgressSagas,
            long failedSagas
    ) {}
}
