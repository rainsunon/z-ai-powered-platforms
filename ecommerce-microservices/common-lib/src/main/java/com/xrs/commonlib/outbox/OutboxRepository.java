package com.xrs.commonlib.outbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for OutboxEvent entities.
 * Provides methods for querying and managing outbox events.
 */
@Repository
public interface OutboxRepository extends JpaRepository<OutboxEvent, Long> {
    
    /**
     * Find unpublished events for retry.
     * Orders by creation date to ensure FIFO processing.
     * 
     * @return list of unpublished events
     */
    @Query("SELECT e FROM OutboxEvent e WHERE e.published = false ORDER BY e.createdAt ASC")
    List<OutboxEvent> findUnpublishedEventsForRetry();
    
    /**
     * Find unpublished events with retry count below threshold.
     * 
     * @param maxRetries maximum retry count
     * @return list of unpublished events
     */
    @Query("SELECT e FROM OutboxEvent e WHERE e.published = false AND e.retryCount < :maxRetries ORDER BY e.createdAt ASC")
    List<OutboxEvent> findUnpublishedEventsBelowRetryThreshold(@Param("maxRetries") int maxRetries);
    
    /**
     * Find published events older than specified date.
     * Used for cleanup of old published events.
     * 
     * @param cutoffDate the cutoff date
     * @return list of old published events
     */
    @Query("SELECT e FROM OutboxEvent e WHERE e.published = true AND e.publishedAt < :cutoffDate")
    List<OutboxEvent> findByPublishedTrueAndPublishedAtBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    /**
     * Check if an event with the given event ID exists.
     * Used for idempotency checks.
     * 
     * @param eventId the event ID
     * @return true if event exists, false otherwise
     */
    boolean existsByEventId(String eventId);
    
    /**
     * Find an event by its event ID.
     * 
     * @param eventId the event ID
     * @return optional containing the event if found
     */
    Optional<OutboxEvent> findByEventId(String eventId);
    
    /**
     * Find events by aggregate ID and type.
     * Useful for tracking all events related to a specific aggregate.
     * 
     * @param aggregateId the aggregate ID
     * @param aggregateType the aggregate type
     * @return list of events
     */
    @Query("SELECT e FROM OutboxEvent e WHERE e.aggregateId = :aggregateId AND e.aggregateType = :aggregateType ORDER BY e.createdAt DESC")
    List<OutboxEvent> findByAggregateIdAndAggregateType(
        @Param("aggregateId") String aggregateId,
        @Param("aggregateType") String aggregateType
    );
    
    /**
     * Find events by correlation ID.
     * Useful for tracing related events across services.
     * 
     * @param correlationId the correlation ID
     * @return list of events
     */
    List<OutboxEvent> findByCorrelationId(String correlationId);
    
    /**
     * Delete published events older than specified date.
     * 
     * @param cutoffDate the cutoff date
     * @return number of deleted events
     */
    @Modifying
    @Query("DELETE FROM OutboxEvent e WHERE e.published = true AND e.publishedAt < :cutoffDate")
    int deletePublishedEventsOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    /**
     * Count unpublished events.
     * Useful for monitoring outbox backlog.
     * 
     * @return count of unpublished events
     */
    long countByPublishedFalse();
}
