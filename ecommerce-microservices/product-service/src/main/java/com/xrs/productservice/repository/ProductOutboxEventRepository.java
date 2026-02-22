package com.xrs.productservice.repository;

import com.xrs.productservice.entity.ProductOutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProductOutboxEvent entities.
 * Extends JpaRepository for standard CRUD operations.
 */
@Repository
public interface ProductOutboxEventRepository extends JpaRepository<ProductOutboxEvent, Long> {
    
    /**
     * Find unpublished events for retry.
     * Orders by creation date to ensure FIFO processing.
     */
    List<ProductOutboxEvent> findUnpublishedEventsForRetry();
    
    /**
     * Find published events older than specified date.
     * Used for cleanup of old events.
     */
    List<ProductOutboxEvent> findByPublishedTrueAndPublishedAtBefore(java.time.LocalDateTime cutoffDate);
    
    /**
     * Check if an event with the given ID exists.
     * Used for idempotency checks.
     */
    Optional<ProductOutboxEvent> findByEventId(String eventId);
    
    /**
     * Find events by aggregate ID and type.
     * Useful for tracking all events related to a specific aggregate.
     */
    List<ProductOutboxEvent> findByAggregateIdAndAggregateType(String aggregateId, String aggregateType);
    
    /**
     * Find events by correlation ID.
     * Useful for tracing related events across services.
     */
    List<ProductOutboxEvent> findByCorrelationId(String correlationId);
    
    /**
     * Count unpublished events.
     * Useful for monitoring outbox backlog.
     */
    long countByPublishedFalse();
}
