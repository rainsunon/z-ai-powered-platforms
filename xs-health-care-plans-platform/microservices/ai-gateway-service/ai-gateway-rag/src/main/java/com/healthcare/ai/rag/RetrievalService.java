package com.healthcare.ai.rag;

import com.healthcare.ai.rag.QueryProcessorService.QueryProcessingResult;
import com.healthcare.ai.rag.client.BedrockEmbeddingClient;
import com.healthcare.ai.rag.client.OpenSearchVectorClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Retrieval Service - Performs semantic search in OpenSearch
 * Implements ReGAIN Semantic Search component
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RetrievalService {

    private final BedrockEmbeddingClient embeddingClient;
    private final OpenSearchVectorClient openSearchClient;

    /**
     * Retrieve relevant documents using semantic search
     */
    public RetrievalResult retrieve(QueryProcessingResult queryResult, int limit, double minSimilarity) {
        long startTime = System.currentTimeMillis();

        log.debug("Retrieving documents for query: {}", queryResult.getOriginalQuery());

        // Generate embedding for the query
        float[] queryEmbedding = embeddingClient.generateEmbedding(queryResult.getOriginalQuery());

        // Perform k-NN search in OpenSearch
        List<RetrievedDocument> documents = openSearchClient.knnSearch(
                queryEmbedding,
                queryResult.getMetadataFilter(),
                limit * 3, // Fetch more for MMR
                minSimilarity
        );

        long retrievalTime = System.currentTimeMillis() - startTime;

        log.debug("Retrieved {} documents in {}ms", documents.size(), retrievalTime);

        return RetrievalResult.builder()
                .documents(documents)
                .totalCandidates(documents.size())
                .retrievalTimeMs(retrievalTime)
                .queryEmbedding(queryEmbedding)
                .build();
    }

    /**
     * Result of retrieval
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RetrievalResult {
        private List<RetrievedDocument> documents;
        private int totalCandidates;
        private long retrievalTimeMs;
        private float[] queryEmbedding;
    }

    /**
     * Retrieved document from OpenSearch
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RetrievedDocument {
        private String id;
        private String planId;
        private String summary;
        private float[] embedding;
        private double score;
        private Map<String, Object> metadata;
    }
}
