package com.xrs.orderservice.repository;

import com.xrs.orderservice.entity.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    /**
     * Find unpublished events ordered by creation time
     */
    List<OutboxEvent> findByPublishedFalseOrderByCreatedAtAsc();

    /**
     * Find unpublished events that haven't exceeded max retries
     */
    @Query("SELECT o FROM OutboxEvent o WHERE o.published = false AND o.retryCount < 3 ORDER BY o.createdAt ASC")
    List<OutboxEvent> findUnpublishedEventsForRetry();

    /**
     * Find events older than specified time (for cleanup)
     */
    List<OutboxEvent> findByPublishedTrueAndPublishedAtBefore(LocalDateTime dateTime);

    /**
     * Check if event already exists (for idempotency)
     */
    boolean existsByEventId(String eventId);
}
