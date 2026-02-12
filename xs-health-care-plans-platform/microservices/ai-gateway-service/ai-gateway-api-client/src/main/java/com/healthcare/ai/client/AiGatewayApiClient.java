package com.healthcare.ai.client;

import com.healthcare.ai.common.dto.request.SearchRequest;
import com.healthcare.ai.common.dto.request.RecommendationRequest;
import com.healthcare.ai.common.dto.response.SearchResponse;
import com.healthcare.ai.common.dto.response.RecommendationResponse;
import org.springframework.cloud.openfeign.FeignClient;

/**
 * AI Gateway API Client
 */
@FeignClient(name = "ai-gateway-service", url = "${ai.gateway.url:http://localhost:8085}")
public interface AiGatewayApiClient {

    /**
     * Semantic search
     */
    @org.springframework.web.bind.annotation.PostMapping("/api/v1/ai/search")
    SearchResponse search(SearchRequest request);

    /**
     * Get recommendations
     */
    @org.springframework.web.bind.annotation.PostMapping("/api/v1/ai/recommend")
    RecommendationResponse recommend(RecommendationRequest request);
}
