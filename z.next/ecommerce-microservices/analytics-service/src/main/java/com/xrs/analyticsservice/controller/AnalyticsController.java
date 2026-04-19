package com.xrs.analyticsservice.controller;

import com.xrs.analyticsservice.dto.AnalyticsEventRequest;
import com.xrs.analyticsservice.dto.AnalyticsSummaryResponse;
import com.xrs.analyticsservice.service.AnalyticsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/events")
    public ResponseEntity<Void> trackEvent(@Valid @RequestBody AnalyticsEventRequest request) {
        analyticsService.track(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary(
            @RequestParam(name = "productId", required = false) String productId
    ) {
        return ResponseEntity.ok(analyticsService.summary(productId));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}