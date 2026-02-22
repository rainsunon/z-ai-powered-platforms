package com.xrs.analyticsservice.service;

import com.xrs.analyticsservice.dto.AnalyticsEventRequest;
import com.xrs.analyticsservice.dto.AnalyticsSummaryResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AnalyticsServiceTest {

    private final AnalyticsService analyticsService = new AnalyticsService();

    @Test
    void shouldTrackProductAndSearchEvents() {
        analyticsService.track(new AnalyticsEventRequest("PRODUCT_VIEW", "P-001", "U-1", null, null));
        analyticsService.track(new AnalyticsEventRequest("PRODUCT_PURCHASE", "P-001", "U-1", null, 1));
        analyticsService.track(new AnalyticsEventRequest("SEARCH_QUERY", null, "U-1", "laptop", null));
        analyticsService.track(new AnalyticsEventRequest("SEARCH_QUERY", null, "U-2", "laptop", null));

        AnalyticsSummaryResponse summary = analyticsService.summary("P-001");

        assertEquals(4, summary.totalEvents());
        assertEquals(1, summary.totalProductViews());
        assertEquals(1, summary.totalProductPurchases());
        assertEquals(2, summary.topQueries().get("laptop"));
        assertEquals(1, summary.product().views());
        assertEquals(1, summary.product().purchases());
    }

    @Test
    void shouldRejectUnsupportedEventType() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> analyticsService.track(new AnalyticsEventRequest("CLICK", "P-001", "U-1", null, null)));

        assertEquals("Unsupported eventType: CLICK", exception.getMessage());
    }
}