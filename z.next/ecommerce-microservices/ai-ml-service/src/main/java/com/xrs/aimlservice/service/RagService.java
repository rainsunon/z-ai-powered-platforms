package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RagService {

    private final VectorStoreService vectorStoreService;
    private final PreprocessingService preprocessingService;

    public RagService(VectorStoreService vectorStoreService, PreprocessingService preprocessingService) {
        this.vectorStoreService = vectorStoreService;
        this.preprocessingService = preprocessingService;
    }

    public AiMlDto.RagResponse chat(AiMlDto.RagRequest request) {
        int topK = request.topK() == null ? 3 : Math.max(1, request.topK());
        String cleanedQuestion = preprocessingService.cleanText(request.question());
        List<AiMlDto.VectorMatch> context = vectorStoreService.search(cleanedQuestion, topK);

        String combinedContext = context.stream()
                .map(AiMlDto.VectorMatch::text)
                .reduce("", (left, right) -> left + " " + right)
                .trim();

        String answer;
        if (combinedContext.isBlank()) {
            answer = "I could not find enough contextual data. Please ingest more domain documents.";
        } else {
            String conciseContext = combinedContext.length() > 220 ? combinedContext.substring(0, 220) : combinedContext;
            answer = "Based on retrieved context: " + conciseContext;
        }

        return new AiMlDto.RagResponse(answer, context);
    }
}