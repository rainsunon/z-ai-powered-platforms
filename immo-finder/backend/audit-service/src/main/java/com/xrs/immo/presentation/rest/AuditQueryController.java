package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.service.AuditQueryService;
import com.xrs.immo.domain.model.AuditLog;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Audit", description = "Audit log query API")
public class AuditQueryController {

    private final AuditQueryService auditQueryService;

    @GetMapping
    @Operation(summary = "Get all audit logs with pagination")
    public ResponseEntity<Page<AuditLog>> getAllAuditLogs(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "processedAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return ResponseEntity.ok(auditQueryService.findAll(pageable));
    }

    @GetMapping("/event-type/{eventType}")
    @Operation(summary = "Get audit logs by event type")
    public ResponseEntity<List<AuditLog>> getByEventType(
            @Parameter(description = "Event type") @PathVariable String eventType) {
        return ResponseEntity.ok(auditQueryService.findByEventType(eventType));
    }

    @GetMapping("/aggregate/{aggregateId}")
    @Operation(summary = "Get audit logs by aggregate ID")
    public ResponseEntity<List<AuditLog>> getByAggregateId(
            @Parameter(description = "Aggregate ID") @PathVariable String aggregateId) {
        return ResponseEntity.ok(auditQueryService.findByAggregateId(aggregateId));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get audit logs by date range")
    public ResponseEntity<List<AuditLog>> getByDateRange(
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(auditQueryService.findByDateRange(startDate, endDate));
    }

    @GetMapping("/event-type/{eventType}/date-range")
    @Operation(summary = "Get audit logs by event type and date range")
    public ResponseEntity<List<AuditLog>> getByEventTypeAndDateRange(
            @Parameter(description = "Event type") @PathVariable String eventType,
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(auditQueryService.findByEventTypeAndDateRange(eventType, startDate, endDate));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get audit log by ID")
    public ResponseEntity<AuditLog> getById(@Parameter(description = "Audit log ID") @PathVariable String id) {
        AuditLog auditLog = auditQueryService.findById(id);
        if (auditLog == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(auditLog);
    }

    @GetMapping("/stats/event-type/{eventType}/count")
    @Operation(summary = "Count audit logs by event type")
    public ResponseEntity<Map<String, Object>> countByEventType(
            @Parameter(description = "Event type") @PathVariable String eventType) {
        long count = auditQueryService.countByEventType(eventType);
        return ResponseEntity.ok(Map.of(
            "eventType", eventType,
            "count", count
        ));
    }

    @GetMapping("/stats/date-range/count")
    @Operation(summary = "Count audit logs by date range")
    public ResponseEntity<Map<String, Object>> countByDateRange(
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        long count = auditQueryService.countByDateRange(startDate, endDate);
        return ResponseEntity.ok(Map.of(
            "startDate", startDate,
            "endDate", endDate,
            "count", count
        ));
    }
}
