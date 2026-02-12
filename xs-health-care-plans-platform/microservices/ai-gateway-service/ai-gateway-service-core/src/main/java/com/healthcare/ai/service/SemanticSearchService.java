package com.healthcare.ai.service;

import com.healthcare.ai.common.dto.request.SearchRequest;
import com.healthcare.ai.common.dto.response.SearchResponse;
import com.healthcare.ai.common.dto.response.SearchResult;
import com.healthcare.ai.rag.AbstentionService;
import com.healthcare.ai.rag.MMRDiversitySampler;
import com.healthcare.ai.rag.QueryProcessorService;
import com.healthcare.ai.rag.RetrievalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Semantic Search Service - Orchestrates the RAG pipeline for search
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SemanticSearchService {

    private final QueryProcessorService queryProcessor;
    private final RetrievalService retrievalService;
    private final MMRDiversitySampler mmrSampler;
    private final AbstentionService abstentionService;

    /**
     * Perform semantic search
     */
    public SearchResponse search(SearchRequest request) {
        log.info("Performing semantic search: query='{}', limit={}", request.getQuery(), request.getLimit());

        // Step 1: Process query
        QueryProcessorService.QueryProcessingResult queryResult = queryProcessor.processQuery(request);

        // Step 2: Retrieve documents
        RetrievalService.RetrievalResult retrievalResult = retrievalService.retrieve(
                queryResult,
                request.getLimit() * 3, // Fetch more for MMR
                request.getMinSimilarity()
        );

        // Step 3: Apply MMR diversity sampling
        List<RetrievalService.RetrievedDocument> diversifiedDocs = mmrSampler.sample(
                retrievalResult.getDocuments(),
                request.getLimit(),
                0.7 // lambda
        );

        // Step 4: Build response
        List<SearchResult> results = diversifiedDocs.stream()
                .map(this::mapToSearchResult)
                .collect(Collectors.toList());

        return SearchResponse.builder()
                .results(results)
                .searchMetadata(com.healthcare.ai.common.dto.response.SearchMetadata.builder()
                        .totalCandidates(retrievalResult.getTotalCandidates())
                        .filteredCandidates(diversifiedDocs.size())
                        .retrievalTimeMs(retrievalResult.getRetrievalTimeMs())
                        .build())
                .build();
    }

    /**
     * Map retrieved document to search result
     */
    private SearchResult mapToSearchResult(RetrievalService.RetrievedDocument doc) {
        return SearchResult.builder()
                .planId(doc.getPlanId())
                .planName(extractPlanName(doc.getMetadata()))
                .score(doc.getScore())
                .matchReasons(extractMatchReasons(doc.getMetadata()))
                .build();
    }

    /**
     * Extract plan name from metadata
     */
    private String extractPlanName(java.util.Map<String, Object> metadata) {
        String planId = (String) metadata.get("plan_id");
        String state = (String) metadata.get("state");
        String metalTier = (String) metadata.get("metal_tier");

        if (planId != null) {
            return String.format("%s Plan (%s)", metalTier != null ? metalTier : "Health", planId);
        }
        return "Unknown Plan";
    }

    /**
     * Extract match reasons from metadata
     */
    private List<String> extractMatchReasons(java.util.Map<String, Object> metadata) {
        List<String> reasons = new java.util.ArrayList<>();

        if (metadata.containsKey("focus_areas")) {
            reasons.add("matches focus areas");
        }
        if (metadata.containsKey("age_groups")) {
            reasons.add("matches age group");
        }
        if (metadata.containsKey("state")) {
            reasons.add("matches location");
        }

        return reasons;
    }
}
