package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PersonalizationService {

    private final PreprocessingService preprocessingService;

    public PersonalizationService(PreprocessingService preprocessingService) {
        this.preprocessingService = preprocessingService;
    }

    public AiMlDto.RecommendationResponse recommend(AiMlDto.RecommendationRequest request) {
        List<String> clickHistory = request.clickHistory() == null ? List.of() : request.clickHistory();
        List<String> catalogItems = request.catalogItems() == null ? List.of() : request.catalogItems();
        int limit = request.limit() == null ? 5 : Math.max(1, request.limit());

        Map<String, Integer> scoreByItem = new HashMap<>();
        for (String item : catalogItems) {
            String normalizedItem = preprocessingService.cleanText(item);
            int score = 0;
            for (String clicked : clickHistory) {
                String normalizedClicked = preprocessingService.cleanText(clicked);
                if (normalizedClicked.contains(normalizedItem) || normalizedItem.contains(normalizedClicked)) {
                    score += 3;
                }
                if (!normalizedClicked.isBlank() && !normalizedItem.isBlank()) {
                    String[] clickedTokens = normalizedClicked.split(" ");
                    for (String token : clickedTokens) {
                        if (!token.isBlank() && normalizedItem.contains(token)) {
                            score += 1;
                        }
                    }
                }
            }
            scoreByItem.put(item, score);
        }

        List<String> ranked = catalogItems.stream()
                .sorted((left, right) -> Integer.compare(scoreByItem.getOrDefault(right, 0), scoreByItem.getOrDefault(left, 0)))
                .limit(limit)
                .toList();

        return new AiMlDto.RecommendationResponse(ranked.isEmpty() ? Collections.emptyList() : ranked);
    }
}