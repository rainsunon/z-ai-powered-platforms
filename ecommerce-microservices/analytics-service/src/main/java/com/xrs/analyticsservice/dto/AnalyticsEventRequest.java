package com.xrs.analyticsservice.dto;

import jakarta.validation.constraints.NotBlank;

public record AnalyticsEventRequest(
        @NotBlank(message = "eventType is required") String eventType,
        String productId,
        String userId,
        String query,
        Integer quantity
) {
}