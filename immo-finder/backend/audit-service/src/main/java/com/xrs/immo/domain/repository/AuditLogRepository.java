package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findByEventTypeOrderByProcessedAtDesc(String eventType);

    List<AuditLog> findByAggregateIdOrderByProcessedAtDesc(String aggregateId);

    List<AuditLog> findByProcessedAtBetweenOrderByProcessedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    List<AuditLog> findByEventTypeAndProcessedAtBetweenOrderByProcessedAtDesc(
            String eventType, LocalDateTime startDate, LocalDateTime endDate);

    long countByEventType(String eventType);

    long countByProcessedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
