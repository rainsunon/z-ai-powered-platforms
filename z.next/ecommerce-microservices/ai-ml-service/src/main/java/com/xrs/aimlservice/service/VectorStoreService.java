package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.model.VectorDocument;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VectorStoreService {

    private final Map<String, VectorDocument> store = new ConcurrentHashMap<>();
    private final EmbeddingService embeddingService;
    private final PreprocessingService preprocessingService;

    public VectorStoreService(EmbeddingService embeddingService, PreprocessingService preprocessingService) {
        this.embeddingService = embeddingService;
        this.preprocessingService = preprocessingService;
    }

    public void upsert(String id, String text, Map<String, Object> metadata) {
        String cleaned = preprocessingService.cleanText(text);
        float[] vector = embeddingService.embed(cleaned);
        VectorDocument document = new VectorDocument(id, cleaned, vector, metadata == null ? Map.of() : metadata);
        store.put(id, document);
    }

    public List<AiMlDto.VectorMatch> search(String query, int topK) {
        String cleanedQuery = preprocessingService.cleanText(query);
        float[] queryVector = embeddingService.embed(cleanedQuery);

        List<AiMlDto.VectorMatch> matches = new ArrayList<>();
        for (VectorDocument document : store.values()) {
            double score = cosineSimilarity(queryVector, document.vector());
            matches.add(new AiMlDto.VectorMatch(document.id(), score, document.text(), document.metadata()));
        }

        matches.sort(Comparator.comparingDouble(AiMlDto.VectorMatch::score).reversed());
        return matches.stream().limit(Math.max(1, topK)).toList();
    }

    public int size() {
        return store.size();
    }

    private double cosineSimilarity(float[] left, float[] right) {
        double dot = 0.0;
        double leftNorm = 0.0;
        double rightNorm = 0.0;
        int dimension = Math.min(left.length, right.length);
        for (int index = 0; index < dimension; index++) {
            dot += left[index] * right[index];
            leftNorm += left[index] * left[index];
            rightNorm += right[index] * right[index];
        }
        if (leftNorm == 0.0 || rightNorm == 0.0) {
            return 0.0;
        }
        return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
    }
}