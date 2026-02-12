package com.healthcare.ai.stub;

import com.healthcare.ai.client.AiGatewayApiClient;
import com.healthcare.ai.common.dto.request.SearchRequest;
import com.healthcare.ai.common.dto.request.RecommendationRequest;
import com.healthcare.ai.common.dto.response.SearchResponse;
import com.healthcare.ai.common.dto.response.RecommendationResponse;
import com.healthcare.ai.common.dto.response.SearchResult;
import com.healthcare.ai.common.dto.response.SearchMetadata;
import com.healthcare.ai.common.dto.response.Recommendation;
import com.healthcare.ai.common.dto.response.Citation;
import com.healthcare.ai.common.constants.Verdict;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Stub implementation for AI Gateway API
 * Used for testing and development without full AI pipeline
 */
@Slf4j
@Component
public class AiGatewayApiStubImpl implements AiGatewayApiClient {

    @Override
    public SearchResponse search(SearchRequest request) {
        log.info("Stub search called with query: {}", request.getQuery());

        // Return mock search results
        List<SearchResult> results = new ArrayList<>();
        results.add(SearchResult.builder()
                .planId("GOLD-2025-TX-042")
                .planName("Texas Diabetes Care Gold")
                .score(0.92)
                .matchReasons(List.of("matches focus areas", "matches age group"))
                .build());

        results.add(SearchResult.builder()
                .planId("SILVER-2025-TX-018")
                .planName("Texas Basic Silver")
                .score(0.85)
                .matchReasons(List.of("matches location"))
                .build());

        return SearchResponse.builder()
                .results(results)
                .searchMetadata(SearchMetadata.builder()
                        .totalCandidates(150)
                        .filteredCandidates(45)
                        .retrievalTimeMs(120L)
                        .build())
                .build();
    }

    @Override
    public RecommendationResponse recommend(RecommendationRequest request) {
        log.info("Stub recommend called for customer: {}", request.getCustomerId());

        // Return mock recommendation
        List<Recommendation> recommendations = new ArrayList<>();
        recommendations.add(Recommendation.builder()
                .planId("GOLD-2025-TX-042")
                .planName("Texas Diabetes Care Gold")
                .matchScore(0.94)
                .reasoning("This plan specifically covers diabetes management [Citation: focus_areas] including insulin pumps and CGMs [Citation: inclusions.medical_devices].")
                .citations(List.of(
                        Citation.builder()
                                .ref("GOLD-2025-TX-042.focus_areas")
                                .value("diabetes_management")
                                .build(),
                        Citation.builder()
                                .ref("GOLD-2025-TX-042.inclusions")
                                .value("insulin pumps, CGM")
                                .build()
                ))
                .build());

        return RecommendationResponse.builder()
                .verdict(Verdict.RECOMMENDED)
                .recommendations(recommendations)
                .alternatives(List.of("SILVER-2025-TX-018", "BRONZE-2025-NAT-003"))
                .nextSteps(List.of(
                        "Compare in-network endocrinologists in your ZIP code",
                        "Review the diabetes management benefits document"
                ))
                .build();
    }
}
