package com.xrs.orderservice.repository;

import com.xrs.orderservice.entity.OrderSagaState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderSagaStateRepository extends JpaRepository<OrderSagaState, Long> {

    /**
     * Find saga by order ID
     */
    Optional<OrderSagaState> findByOrderId(Integer orderId);

    /**
     * Find sagas in specific status (for monitoring/recovery)
     */
    List<OrderSagaState> findBySagaStatus(OrderSagaState.SagaStatus sagaStatus);

    /**
     * Find stuck sagas that have been in progress too long (for recovery)
     */
    List<OrderSagaState> findBySagaStatusInAndRetryCountLessThan(
            List<OrderSagaState.SagaStatus> statuses, 
            Integer maxRetries
    );

    /**
     * Check if saga exists for order
     */
    boolean existsByOrderId(Integer orderId);

    /**
     * Find sagas with statuses in the given list
     */
    List<OrderSagaState> findBySagaStatusIn(List<OrderSagaState.SagaStatus> statuses);
}
