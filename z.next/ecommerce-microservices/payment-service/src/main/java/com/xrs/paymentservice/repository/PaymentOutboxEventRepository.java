package com.xrs.paymentservice.repository;

import com.xrs.paymentservice.entity.PaymentOutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for PaymentOutboxEvent.
 * Extends JpaRepository with custom query methods.
 */
@Repository
public interface PaymentOutboxEventRepository extends JpaRepository<PaymentOutboxEvent, Long> {
    
    /**
     * Find unpublished outbox events.
     */
    @Query("SELECT e FROM PaymentOutboxEvent e WHERE e.published = false ORDER BY e.createdAt ASC")
    List<PaymentOutboxEvent> findUnpublishedEvents();
    
    /**
     * Find outbox events by aggregate ID.
     */
    @Query("SELECT e FROM PaymentOutboxEvent e WHERE e.aggregateId = :aggregateId ORDER BY e.createdAt DESC")
    List<PaymentOutboxEvent> findByAggregateId(@Param("aggregateId") String aggregateId);
    
    /**
     * Find outbox events by correlation ID.
     */
    @Query("SELECT e FROM PaymentOutboxEvent e WHERE e.correlationId = :correlationId ORDER BY e.createdAt DESC")
    List<PaymentOutboxEvent> findByCorrelationId(@Param("correlationId") String correlationId);
    
    /**
     * Delete old published events.
     */
    @Query("DELETE FROM PaymentOutboxEvent e WHERE e.published = true AND e.publishedAt < :cutoffDate")
    int deleteOldPublishedEvents(@Param("cutoffDate") LocalDateTime cutoffDate);
}
