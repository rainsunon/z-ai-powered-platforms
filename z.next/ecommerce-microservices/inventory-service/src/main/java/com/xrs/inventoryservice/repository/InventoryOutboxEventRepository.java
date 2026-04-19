package com.xrs.inventoryservice.repository;

import com.xrs.inventoryservice.entity.InventoryOutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for InventoryOutboxEvent.
 * Extends JpaRepository with custom query methods.
 */
@Repository
public interface InventoryOutboxEventRepository extends JpaRepository<InventoryOutboxEvent, Long> {
    
    /**
     * Find unpublished outbox events.
     */
    @Query("SELECT e FROM InventoryOutboxEvent e WHERE e.published = false ORDER BY e.createdAt ASC")
    List<InventoryOutboxEvent> findUnpublishedEvents();
    
    /**
     * Find outbox events by aggregate ID.
     */
    @Query("SELECT e FROM InventoryOutboxEvent e WHERE e.aggregateId = :aggregateId ORDER BY e.createdAt DESC")
    List<InventoryOutboxEvent> findByAggregateId(@Param("aggregateId") String aggregateId);
    
    /**
     * Find outbox events by correlation ID.
     */
    @Query("SELECT e FROM InventoryOutboxEvent e WHERE e.correlationId = :correlationId ORDER BY e.createdAt DESC")
    List<InventoryOutboxEvent> findByCorrelationId(@Param("correlationId") String correlationId);
    
    /**
     * Delete old published events.
     */
    @Query("DELETE FROM InventoryOutboxEvent e WHERE e.published = true AND e.publishedAt < :cutoffDate")
    int deleteOldPublishedEvents(@Param("cutoffDate") LocalDateTime cutoffDate);
}
