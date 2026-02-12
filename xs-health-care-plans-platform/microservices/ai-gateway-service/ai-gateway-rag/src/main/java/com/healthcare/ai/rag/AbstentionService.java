package com.healthcare.ai.rag;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Abstention Service - Quality gate before LLM reasoning
 * Implements ReGAIN Abstention Mechanism component
 */
@Slf4j
@Service
public class AbstentionService {

    private static final int MIN_EVIDENCE_COUNT = 2;
    private static final double HIGH_CONFIDENCE_THRESHOLD = 0.5;

    /**
     * Check if we should abstain from providing a recommendation
     *
     * @param documents Retrieved documents
     * @return Abstention result
     */
    public AbstentionResult checkAbstention(List<RetrievalService.RetrievedDocument> documents) {
        log.debug("Checking abstention conditions with {} documents", documents.size());

        AbstentionResult result = AbstentionResult.builder()
                .shouldAbstain(false)
                .reason(null)
                .missingContext(List.of())
                .build();

        // Check minimum evidence count
        if (documents.size() < MIN_EVIDENCE_COUNT) {
            result.setShouldAbstain(true);
            result.setReason("Insufficient matching plans for specified criteria");
            result.setMissingContext(List.of("Need at least " + MIN_EVIDENCE_COUNT + " matching plans"));
            log.debug("Abstaining: insufficient evidence count ({})", documents.size());
            return result;
        }

        // Check high confidence threshold
        double maxScore = documents.stream()
                .mapToDouble(RetrievalService.RetrievedDocument::getScore)
                .max()
                .orElse(0.0);

        if (maxScore < HIGH_CONFIDENCE_THRESHOLD) {
            result.setShouldAbstain(true);
            result.setReason("Low confidence in matching plans");
            result.setMissingContext(List.of("No highly relevant plans found (max score: " + String.format("%.2f", maxScore) + ")"));
            log.debug("Abstaining: low confidence (max score: {})", maxScore);
            return result;
        }

        // Check for conflicting evidence
        if (hasConflictingEvidence(documents)) {
            result.setShouldAbstain(true);
            result.setReason("Conflicting evidence in retrieved plans");
            result.setMissingContext(List.of("Plans have conflicting coverage information"));
            log.debug("Abstaining: conflicting evidence");
            return result;
        }

        log.debug("No abstention required");
        return result;
    }

    /**
     * Check for conflicting evidence in retrieved documents
     */
    private boolean hasConflictingEvidence(List<RetrievalService.RetrievedDocument> documents) {
        // Check for conflicting cost tiers
        Set<String> costTiers = new java.util.HashSet<>();
        for (RetrievalService.RetrievedDocument doc : documents) {
            String costTier = (String) doc.getMetadata().get("cost_tier");
            if (costTier != null) {
                costTiers.add(costTier);
            }
        }

        // If we have both very low and very high cost tiers, consider it conflicting
        return costTiers.contains("bronze") && costTiers.contains("platinum");
    }

    /**
     * Result of abstention check
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AbstentionResult {
        private boolean shouldAbstain;
        private String reason;
        private List<String> missingContext;
    }
}
