package com.healthcare.ai.rag;

import com.healthcare.ai.common.dto.request.SearchRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Query Processing Service - Extracts entities and builds metadata filters
 * Implements ReGAIN Query Processing component
 */
@Slf4j
@Service
public class QueryProcessorService {

    private static final Pattern AGE_PATTERN = Pattern.compile("(\\d+)\\s*(years? old|yrs? old|age|years?)", Pattern.CASE_INSENSITIVE);
    private static final Pattern STATE_PATTERN = Pattern.compile("\\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\\b");
    private static final Pattern CONDITION_PATTERN = Pattern.compile("(diabetes|cancer|heart|asthma|arthritis|depression|anxiety|hypertension|cholesterol)", Pattern.CASE_INSENSITIVE);

    /**
     * Process query and extract entities
     */
    public QueryProcessingResult processQuery(SearchRequest request) {
        log.debug("Processing query: {}", request.getQuery());

        QueryProcessingResult result = QueryProcessingResult.builder()
                .originalQuery(request.getQuery())
                .extractedEntities(new HashMap<>())
                .metadataFilter(new HashMap<>())
                .build();

        // Extract entities from query
        extractEntities(request.getQuery(), result.getExtractedEntities());

        // Build metadata filter from extracted entities and request filters
        buildMetadataFilter(result.getExtractedEntities(), request.getFilters(), result.getMetadataFilter());

        log.debug("Extracted entities: {}, Metadata filter: {}", result.getExtractedEntities(), result.getMetadataFilter());

        return result;
    }

    /**
     * Extract entities from natural language query
     */
    private void extractEntities(String query, Map<String, Object> entities) {
        // Extract age
        Matcher ageMatcher = AGE_PATTERN.matcher(query);
        if (ageMatcher.find()) {
            int age = Integer.parseInt(ageMatcher.group(1));
            entities.put("age", age);
            entities.put("ageGroup", determineAgeGroup(age));
        }

        // Extract state
        Matcher stateMatcher = STATE_PATTERN.matcher(query);
        if (stateMatcher.find()) {
            entities.put("state", stateMatcher.group(1));
        }

        // Extract conditions
        Matcher conditionMatcher = CONDITION_PATTERN.matcher(query);
        while (conditionMatcher.find()) {
            String condition = conditionMatcher.group(1).toLowerCase();
            entities.put("condition", condition);
        }

        // Extract cost preferences
        if (query.toLowerCase().contains("affordable") || query.toLowerCase().contains("cheap") || query.toLowerCase().contains("low cost")) {
            entities.put("costPreference", "low");
        } else if (query.toLowerCase().contains("premium") || query.toLowerCase().contains("comprehensive") || query.toLowerCase().contains("best")) {
            entities.put("costPreference", "high");
        }
    }

    /**
     * Determine age group based on age
     */
    private String determineAgeGroup(int age) {
        if (age < 26) return "0-25";
        if (age < 46) return "26-45";
        if (age < 65) return "46-64";
        return "65+";
    }

    /**
     * Build metadata filter for OpenSearch
     */
    private void buildMetadataFilter(Map<String, Object> entities, Map<String, Object> requestFilters, Map<String, Object> metadataFilter) {
        // Add extracted entities
        if (entities.containsKey("state")) {
            metadataFilter.put("state", entities.get("state"));
        }
        if (entities.containsKey("ageGroup")) {
            metadataFilter.put("age_groups", entities.get("ageGroup"));
        }
        if (entities.containsKey("condition")) {
            metadataFilter.put("focus_areas", entities.get("condition"));
        }

        // Add request filters (override extracted entities)
        if (requestFilters != null) {
            metadataFilter.putAll(requestFilters);
        }
    }

    /**
     * Result of query processing
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class QueryProcessingResult {
        private String originalQuery;
        private Map<String, Object> extractedEntities;
        private Map<String, Object> metadataFilter;
    }
}
