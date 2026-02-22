package com.xrs.orderservice.repository;

import com.xrs.orderservice.entity.DeadLetterEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeadLetterEventRepository extends JpaRepository<DeadLetterEvent, Long> {

    /**
     * Find DLQ entry by event ID
     */
    Optional<DeadLetterEvent> findByEventId(String eventId);

    /**
     * Find all DLQ entries by status
     */
    List<DeadLetterEvent> findByStatus(DeadLetterEvent.DLQStatus status);

    /**
     * Find DLQ entries for a specific order
     */
    List<DeadLetterEvent> findByOrderId(Integer orderId);

    /**
     * Find DLQ entries by event type
     */
    List<DeadLetterEvent> findByEventType(String eventType);

    /**
     * Find pending DLQ entries created before a certain time (for cleanup)
     */
    List<DeadLetterEvent> findByStatusAndCreatedAtBefore(
            DeadLetterEvent.DLQStatus status, 
            LocalDateTime before
    );

    /**
     * Check if event exists in DLQ
     */
    boolean existsByEventId(String eventId);
}
