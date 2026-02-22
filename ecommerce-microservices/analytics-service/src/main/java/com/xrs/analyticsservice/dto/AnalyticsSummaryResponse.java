package com.xrs.analyticsservice.dto;

import java.util.Map;

public record AnalyticsSummaryResponse(
        long totalEvents,
        long totalProductViews,
        long totalProductPurchases,
        Map<String, Long> topQueries,
        ProductSummary product
) {

    public record ProductSummary(String productId, long views, long purchases) {
    }
}