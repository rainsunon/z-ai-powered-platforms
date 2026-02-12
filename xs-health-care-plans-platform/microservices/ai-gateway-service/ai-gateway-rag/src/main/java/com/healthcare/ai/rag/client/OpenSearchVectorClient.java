package com.healthcare.ai.rag.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.ai.rag.RetrievalService;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.query_dsl.Query;
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery;
import org.opensearch.client.opensearch.core.SearchRequest;
import org.opensearch.client.opensearch.core.SearchResponse;
import org.opensearch.client.opensearch.core.search.Hit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * OpenSearch Vector Client - Performs k-NN search
 */
@Slf4j
@Component
public class OpenSearchVectorClient {

    @Value("${opensearch.endpoint}")
    private String endpoint;

    @Value("${opensearch.index:plans_collection}")
    private String indexName;

    private final OpenSearchClient openSearchClient;
    private final ObjectMapper objectMapper;

    public OpenSearchVectorClient(OpenSearchClient openSearchClient, ObjectMapper objectMapper) {
        this.openSearchClient = openSearchClient;
        this.objectMapper = objectMapper;
    }

    /**
     * Perform k-NN search with metadata filters
     */
    public List<RetrievalService.RetrievedDocument> knnSearch(
            float[] queryEmbedding,
            Map<String, Object> metadataFilter,
            int k,
            double minSimilarity) {

        try {
            log.debug("Performing k-NN search: k={}, minSimilarity={}, filters={}", k, minSimilarity, metadataFilter);

            // Build k-NN query
            Query knnQuery = Query.of(q -> q
                    .knn(knn -> knn
                            .field("embedding")
                            .queryVector(toFloatList(queryEmbedding))
                            .k(k)
                            .numCandidates(k * 10)
                    )
            );

            // Add metadata filters if provided
            Query finalQuery = knnQuery;
            if (metadataFilter != null && !metadataFilter.isEmpty()) {
                BoolQuery.Builder boolBuilder = new BoolQuery.Builder()
                        .must(knnQuery);

                for (Map.Entry<String, Object> entry : metadataFilter.entrySet()) {
                    boolBuilder.must(Query.of(q -> q
                            .term(t -> t
                                    .field("metadata." + entry.getKey())
                                    .value(entry.getValue().toString())
                            )
                    ));
                }

                finalQuery = Query.of(q -> q.bool(boolBuilder.build()));
            }

            // Build search request
            SearchRequest searchRequest = SearchRequest.of(s -> s
                    .index(indexName)
                    .query(finalQuery)
                    .size(k)
                    .minScore(minSimilarity)
            );

            // Execute search
            SearchResponse<JsonNode> response = openSearchClient.search(searchRequest, JsonNode.class);

            // Parse results
            List<RetrievalService.RetrievedDocument> documents = new ArrayList<>();
            for (Hit<JsonNode> hit : response.hits().hits()) {
                JsonNode source = hit.source();
                JsonNode metadata = source.has("metadata") ? source.get("metadata") : objectMapper.createObjectNode();

                RetrievalService.RetrievedDocument doc = RetrievalService.RetrievedDocument.builder()
                        .id(hit.id())
                        .planId(metadata.has("plan_id") ? metadata.get("plan_id").asText() : null)
                        .summary(source.has("summary") ? source.get("summary").asText() : null)
                        .score(hit.score() != null ? hit.score() : 0.0)
                        .metadata(parseMetadata(metadata))
                        .build();

                documents.add(doc);
            }

            log.debug("k-NN search returned {} documents", documents.size());
            return documents;

        } catch (Exception e) {
            log.error("Error performing k-NN search", e);
            throw new RuntimeException("Failed to perform k-NN search", e);
        }
    }

    /**
     * Convert float array to List<Float>
     */
    private List<Float> toFloatList(float[] array) {
        List<Float> list = new ArrayList<>(array.length);
        for (float value : array) {
            list.add(value);
        }
        return list;
    }

    /**
     * Parse metadata from JSON node
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseMetadata(JsonNode metadataNode) {
        try {
            return objectMapper.treeToValue(metadataNode, Map.class);
        } catch (Exception e) {
            log.warn("Failed to parse metadata", e);
            return Map.of();
        }
    }
}
