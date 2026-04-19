package com.xrs.analyticsservice.service;

import com.xrs.analyticsservice.dto.AnalyticsEventRequest;
import com.xrs.analyticsservice.dto.AnalyticsSummaryResponse;
import com.xrs.analyticsservice.model.AnalyticsEventType;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

@Service
public class AnalyticsService {

    private final LongAdder totalEvents = new LongAdder();
    private final LongAdder totalProductViews = new LongAdder();
    private final LongAdder totalProductPurchases = new LongAdder();

    private final Map<String, LongAdder> productViews = new ConcurrentHashMap<>();
    private final Map<String, LongAdder> productPurchases = new ConcurrentHashMap<>();
    private final Map<String, LongAdder> searchQueries = new ConcurrentHashMap<>();

    public void track(AnalyticsEventRequest request) {
        AnalyticsEventType eventType = parseEventType(request.eventType());
        totalEvents.increment();

        switch (eventType) {
            case PRODUCT_VIEW -> {
                String productId = required(request.productId(), "productId is required for PRODUCT_VIEW");
                productViews.computeIfAbsent(productId, key -> new LongAdder()).increment();
                totalProductViews.increment();
            }
            case PRODUCT_PURCHASE -> {
                String productId = required(request.productId(), "productId is required for PRODUCT_PURCHASE");
                productPurchases.computeIfAbsent(productId, key -> new LongAdder()).increment();
                totalProductPurchases.increment();
            }
            case SEARCH_QUERY -> {
                String query = required(request.query(), "query is required for SEARCH_QUERY");
                searchQueries.computeIfAbsent(query.toLowerCase(), key -> new LongAdder()).increment();
            }
        }
    }

    public AnalyticsSummaryResponse summary(String productId) {
        AnalyticsSummaryResponse.ProductSummary productSummary = null;
        if (productId != null && !productId.isBlank()) {
            long views = getCount(productViews, productId);
            long purchases = getCount(productPurchases, productId);
            productSummary = new AnalyticsSummaryResponse.ProductSummary(productId, views, purchases);
        }

        return new AnalyticsSummaryResponse(
                totalEvents.sum(),
                totalProductViews.sum(),
                totalProductPurchases.sum(),
                topQueries(10),
                productSummary
        );
    }

    private AnalyticsEventType parseEventType(String eventType) {
        if (eventType == null || eventType.isBlank()) {
            throw new IllegalArgumentException("eventType is required");
        }
        try {
            return AnalyticsEventType.valueOf(eventType.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Unsupported eventType: " + eventType);
        }
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }

    private long getCount(Map<String, LongAdder> source, String key) {
        LongAdder counter = source.get(key);
        return counter == null ? 0L : counter.sum();
    }

    private Map<String, Long> topQueries(int limit) {
        return searchQueries.entrySet().stream()
                .sorted(Comparator.comparingLong((Map.Entry<String, LongAdder> entry) -> entry.getValue().sum()).reversed())
                .limit(limit)
                .collect(LinkedHashMap::new,
                        (result, entry) -> result.put(entry.getKey(), entry.getValue().sum()),
                        Map::putAll);
    }
}