package com.healthcare.ai.rag;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * MMR (Maximal Marginal Relevance) Diversity Sampler
 * Implements ReGAIN MMR Sampling component
 * Balances relevance and diversity in search results
 */
@Slf4j
@Service
public class MMRDiversitySampler {

    private static final double DEFAULT_LAMBDA = 0.7; // Balance between relevance and diversity

    /**
     * Apply MMR sampling to retrieved documents
     *
     * @param documents Retrieved documents
     * @param k Number of results to return
     * @param lambda Relevance vs diversity balance (0-1)
     * @return Diversified results
     */
    public List<RetrievalService.RetrievedDocument> sample(
            List<RetrievalService.RetrievedDocument> documents,
            int k,
            double lambda) {

        if (documents.size() <= k) {
            return new ArrayList<>(documents);
        }

        log.debug("Applying MMR sampling: k={}, lambda={}, input size={}", k, lambda, documents.size());

        List<RetrievalService.RetrievedDocument> selected = new ArrayList<>();
        Set<String> selectedPlanIds = new HashSet<>();
        Set<String> selectedInsurers = new HashSet<>();

        // Sort by initial relevance score
        List<RetrievalService.RetrievedDocument> sorted = new ArrayList<>(documents);
        sorted.sort(Comparator.comparingDouble(RetrievalService.RetrievedDocument::getScore).reversed());

        // Greedy selection with diversity penalty
        while (selected.size() < k && !sorted.isEmpty()) {
            RetrievalService.RetrievedDocument best = null;
            double bestMmrScore = Double.NEGATIVE_INFINITY;

            for (RetrievalService.RetrievedDocument doc : sorted) {
                if (selectedPlanIds.contains(doc.getPlanId())) {
                    continue;
                }

                double mmrScore = calculateMMRScore(doc, selected, lambda, selectedInsurers);

                if (mmrScore > bestMmrScore) {
                    bestMmrScore = mmrScore;
                    best = doc;
                }
            }

            if (best != null) {
                selected.add(best);
                selectedPlanIds.add(best.getPlanId());
                String insurer = (String) best.getMetadata().get("insurer");
                if (insurer != null) {
                    selectedInsurers.add(insurer);
                }
                sorted.remove(best);
            } else {
                break;
            }
        }

        log.debug("MMR sampling complete: selected {} documents", selected.size());

        return selected;
    }

    /**
     * Calculate MMR score: λ * relevance - (1-λ) * max_similarity
     */
    private double calculateMMRScore(
            RetrievalService.RetrievedDocument doc,
            List<RetrievalService.RetrievedDocument> selected,
            double lambda,
            Set<String> selectedInsurers) {

        double relevance = doc.getScore();

        // Calculate diversity penalty
        double maxSimilarity = 0.0;
        String insurer = (String) doc.getMetadata().get("insurer");

        for (RetrievalService.RetrievedDocument selectedDoc : selected) {
            // Penalize same insurer
            String selectedInsurer = (String) selectedDoc.getMetadata().get("insurer");
            if (insurer != null && insurer.equals(selectedInsurer)) {
                maxSimilarity = Math.max(maxSimilarity, 0.5);
            }

            // Penalize same cost tier
            String costTier = (String) doc.getMetadata().get("cost_tier");
            String selectedCostTier = (String) selectedDoc.getMetadata().get("cost_tier");
            if (costTier != null && costTier.equals(selectedCostTier)) {
                maxSimilarity = Math.max(maxSimilarity, 0.3);
            }
        }

        return lambda * relevance - (1 - lambda) * maxSimilarity;
    }
}
