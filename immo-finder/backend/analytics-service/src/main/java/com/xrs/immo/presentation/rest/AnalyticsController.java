package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.service.AnalyticsService;
import com.xrs.immo.domain.model.PropertyViewEvent;
import com.xrs.immo.presentation.dto.PropertyViewEventRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics API for property views and statistics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/views")
    @Operation(summary = "Record a property view event")
    public ResponseEntity<PropertyViewEvent> recordView(@Valid @RequestBody PropertyViewEventRequest request) {
        PropertyViewEvent event = PropertyViewEvent.builder()
                .propertyId(request.getPropertyId())
                .propertyType(request.getPropertyType())
                .userId(request.getUserId())
                .sessionId(request.getSessionId())
                .source(request.getSource())
                .referrer(request.getReferrer())
                .userAgent(request.getUserAgent())
                .ipAddress(request.getIpAddress())
                .durationSeconds(request.getDurationSeconds())
                .build();
        
        PropertyViewEvent saved = analyticsService.recordView(event);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/views/property/{propertyId}")
    @Operation(summary = "Get all views for a specific property")
    public ResponseEntity<List<PropertyViewEvent>> getPropertyViews(
            @Parameter(description = "Property ID") @PathVariable String propertyId) {
        return ResponseEntity.ok(analyticsService.getPropertyViews(propertyId));
    }

    @GetMapping("/views/user/{userId}")
    @Operation(summary = "Get all views for a specific user")
    public ResponseEntity<List<PropertyViewEvent>> getUserViews(
            @Parameter(description = "User ID") @PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getUserViews(userId));
    }

    @GetMapping("/views/property/{propertyId}/count")
    @Operation(summary = "Get view count for a property since a specific date")
    public ResponseEntity<Map<String, Object>> getPropertyViewCount(
            @Parameter(description = "Property ID") @PathVariable String propertyId,
            @Parameter(description = "Since date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        long count = analyticsService.getPropertyViewCount(propertyId, since);
        return ResponseEntity.ok(Map.of(
            "propertyId", propertyId,
            "viewCount", count,
            "since", since
        ));
    }

    @GetMapping("/views/property/{propertyId}/unique-viewers")
    @Operation(summary = "Get unique viewer count for a property since a specific date")
    public ResponseEntity<Map<String, Object>> getUniqueViewerCount(
            @Parameter(description = "Property ID") @PathVariable String propertyId,
            @Parameter(description = "Since date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        long count = analyticsService.getUniqueViewerCount(propertyId, since);
        return ResponseEntity.ok(Map.of(
            "propertyId", propertyId,
            "uniqueViewers", count,
            "since", since
        ));
    }

    @GetMapping("/views/property/{propertyId}/analytics")
    @Operation(summary = "Get comprehensive analytics for a property")
    public ResponseEntity<Map<String, Object>> getPropertyAnalytics(
            @Parameter(description = "Property ID") @PathVariable String propertyId,
            @Parameter(description = "Since date (ISO format)") @RequestParam(required = false, defaultValue = "2024-01-01T00:00:00") 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        return ResponseEntity.ok(analyticsService.getPropertyAnalytics(propertyId, since));
    }

    @GetMapping("/reports/most-viewed")
    @Operation(summary = "Get most viewed properties in a date range")
    public ResponseEntity<List<Map<String, Object>>> getMostViewedProperties(
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getMostViewedProperties(startDate, endDate));
    }

    @GetMapping("/reports/by-property-type")
    @Operation(summary = "Get views grouped by property type in a date range")
    public ResponseEntity<List<Map<String, Object>>> getViewsByPropertyType(
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getViewsByPropertyType(startDate, endDate));
    }

    @GetMapping("/reports/by-date")
    @Operation(summary = "Get views grouped by date in a date range")
    public ResponseEntity<List<Map<String, Object>>> getViewsByDate(
            @Parameter(description = "Start date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getViewsByDate(startDate, endDate));
    }
}
