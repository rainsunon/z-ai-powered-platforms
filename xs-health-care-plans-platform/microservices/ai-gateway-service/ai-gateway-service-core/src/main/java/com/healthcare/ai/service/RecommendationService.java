package com.healthcare.ai.service;

import com.healthcare.ai.common.constants.Verdict;
import com.healthcare.ai.common.dto.request.RecommendationRequest;
import com.healthcare.ai.common.dto.response.Citation;
import com.healthcare.ai.common.dto.response.Recommendation;
import com.healthcare.ai.common.dto.response.RecommendationResponse;
import com.healthcare.ai.rag.AbstentionService;
import com.healthcare.ai.rag.MMRDiversitySampler;
import com.healthcare.ai.rag.QueryProcessorService;
import com.healthcare.ai.rag.RetrievalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Recommendation Service - Orchestrates RAG pipeline for recommendations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final QueryProcessorService queryProcessor;
    private final RetrievalService retrievalService;
    private final MMRDiversitySampler mmrSampler;
    private final AbstentionService abstentionService;

    /**
     * Get personalized recommendations
     */
    public RecommendationResponse recommend(RecommendationRequest request) {
        log.info("Generating recommendations for customer: {}, context: {}", request.getCustomerId(), request.getContext());

        // Build query from context
        String query = buildQueryFromRequest(request);

        // Process query
        QueryProcessorService.QueryProcessingResult queryResult = queryProcessor.processQuery(
                com.healthcare.ai.common.dto.request.SearchRequest.builder()
                        .query(query)
                        .limit(5)
                        .build()
        );

        // Retrieve documents
        RetrievalService.RetrievalResult retrievalResult = retrievalService.retrieve(
                queryResult,
                18, // fetch_k for MMR
                0.3 // min similarity
        );

        // Apply MMR diversity sampling
        List<RetrievalService.RetrievedDocument> diversifiedDocs = mmrSampler.sample(
                retrievalResult.getDocuments(),
                6, // k
                0.7 // lambda
        );

        // Check abstention
        AbstentionService.AbstentionResult abstentionResult = abstentionService.checkAbstention(diversifiedDocs);

        if (abstentionResult.isShouldAbstain()) {
            log.info("Abstaining from recommendation: {}", abstentionResult.getReason());
            return RecommendationResponse.builder()
                    .verdict(Verdict.UNDECIDABLE)
                    .reason(abstentionResult.getReason())
                    .missingContext(abstentionResult.getMissingContext())
                    .suggestion("Consider adjusting your search criteria or contact a healthcare advisor")
                    .recommendations(List.of())
                    .alternatives(List.of())
                    .nextSteps(List.of())
                    .build();
        }

        // Build recommendations
        List<Recommendation> recommendations = diversifiedDocs.stream()
                .limit(3)
                .map(this::mapToRecommendation)
                .collect(Collectors.toList());

        // Build alternatives
        List<String> alternatives = diversifiedDocs.stream()
                .skip(3)
                .limit(3)
                .map(doc -> doc.getPlanId())
                .collect(Collectors.toList());

        // Build next steps
        List<String> nextSteps = generateNextSteps(recommendations);

        return RecommendationResponse.builder()
                .verdict(Verdict.RECOMMENDED)
                .recommendations(recommendations)
                .alternatives(alternatives)
                .nextSteps(nextSteps)
                .build();
    }

    /**
     * Build query from recommendation request
     */
    private String buildQueryFromRequest(RecommendationRequest request) {
        StringBuilder query = new StringBuilder();

        if (request.getContext() != null && !request.getContext().isEmpty()) {
            query.append(request.getContext());
        } else {
            query.append("healthcare plan recommendations");
        }

        return query.toString();
    }

    /**
     * Map retrieved document to recommendation
     */
    private Recommendation mapToRecommendation(RetrievalService.RetrievedDocument doc) {
        return Recommendation.builder()
                .planId(doc.getPlanId())
                .planName(extractPlanName(doc.getMetadata()))
                .matchScore(doc.getScore())
                .reasoning(generateReasoning(doc))
                .citations(extractCitations(doc))
                .build();
    }

    /**
     * Extract plan name from metadata
     */
    private String extractPlanName(java.util.Map<String, Object> metadata) {
        String planId = (String) metadata.get("plan_id");
        String metalTier = (String) metadata.get("metal_tier");

        if (planId != null) {
            return String.format("%s Plan (%s)", metalTier != null ? metalTier : "Health", planId);
        }
        return "Unknown Plan";
    }

    /**
     * Generate reasoning for recommendation
     */
    private String generateReasoning(RetrievalService.RetrievedDocument doc) {
        StringBuilder reasoning = new StringBuilder();

        String focusAreas = (String) doc.getMetadata().get("focus_areas");
        if (focusAreas != null) {
            reasoning.append("This plan focuses on ").append(focusAreas).append(". ");
        }

        String costTier = (String) doc.getMetadata().get("cost_tier");
        if (costTier != null) {
            reasoning.append("It offers ").append(costTier).append("-level coverage. ");
        }

        reasoning.append("Match score: ").append(String.format("%.2f", doc.getScore()));

        return reasoning.toString();
    }

    /**
     * Extract citations from document
     */
    private List<Citation> extractCitations(RetrievalService.RetrievedDocument doc) {
        List<Citation> citations = new ArrayList<>();

        String planId = doc.getPlanId();
        if (planId != null) {
            citations.add(Citation.builder()
                    .ref(planId + ".summary")
                    .value(doc.getSummary())
                    .build());
        }

        String focusAreas = (String) doc.getMetadata().get("focus_areas");
        if (focusAreas != null) {
            citations.add(Citation.builder()
                    .ref(planId + ".focus_areas")
                    .value(focusAreas)
                    .build());
        }

        return citations;
    }

    /**
     * Generate next steps for user
     */
    private List<String> generateNextSteps(List<Recommendation> recommendations) {
        List<String> nextSteps = new ArrayList<>();

        if (!recommendations.isEmpty()) {
            nextSteps.add("Compare the recommended plans in detail");
            nextSteps.add("Review in-network providers in your area");
            nextSteps.add("Check prescription drug coverage");
        }

        return nextSteps;
    }
}
