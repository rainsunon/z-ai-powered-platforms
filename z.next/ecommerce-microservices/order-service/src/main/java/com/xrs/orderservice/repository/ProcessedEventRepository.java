package com.xrs.orderservice.repository;

import com.xrs.orderservice.entity.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, Long> {

    /**
     * Find processed event by event ID (for idempotency check)
     */
    Optional<ProcessedEvent> findByEventId(String eventId);

    /**
     * Check if event was already processed
     */
    boolean existsByEventId(String eventId);

    /**
     * Find events for specific order
     */
    List<ProcessedEvent> findByOrderId(Integer orderId);

    /**
     * Find old events for cleanup
     */
    List<ProcessedEvent> findByProcessedAtBefore(LocalDateTime dateTime);
}
