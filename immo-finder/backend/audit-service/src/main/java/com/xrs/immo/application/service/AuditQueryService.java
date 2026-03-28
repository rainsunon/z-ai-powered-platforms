package com.xrs.immo.application.service;

import com.xrs.immo.domain.model.AuditLog;
import com.xrs.immo.domain.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditQueryService {

    private final AuditLogRepository repository;

    public Page<AuditLog> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<AuditLog> findByEventType(String eventType) {
        return repository.findByEventTypeOrderByProcessedAtDesc(eventType);
    }

    public List<AuditLog> findByAggregateId(String aggregateId) {
        return repository.findByAggregateIdOrderByProcessedAtDesc(aggregateId);
    }

    public List<AuditLog> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return repository.findByProcessedAtBetweenOrderByProcessedAtDesc(startDate, endDate);
    }

    public List<AuditLog> findByEventTypeAndDateRange(String eventType, LocalDateTime startDate, LocalDateTime endDate) {
        return repository.findByEventTypeAndProcessedAtBetweenOrderByProcessedAtDesc(eventType, startDate, endDate);
    }

    public AuditLog findById(String id) {
        return repository.findById(id).orElse(null);
    }

    public long countByEventType(String eventType) {
        return repository.countByEventType(eventType);
    }

    public long countByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return repository.countByProcessedAtBetween(startDate, endDate);
    }
}
