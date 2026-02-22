package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IngestPrepService {

    private final VectorStoreService vectorStoreService;
    private final PreprocessingService preprocessingService;

    public IngestPrepService(VectorStoreService vectorStoreService, PreprocessingService preprocessingService) {
        this.vectorStoreService = vectorStoreService;
        this.preprocessingService = preprocessingService;
    }

    public AiMlDto.IngestResponse ingest(AiMlDto.IngestRequest request) {
        List<String> vectorIds = new ArrayList<>();
        for (Map<String, Object> record : request.records()) {
            String vectorId = request.source() + "-" + UUID.randomUUID();
            String text = record.values().stream().map(String::valueOf).reduce("", (left, right) -> left + " " + right);
            String cleaned = preprocessingService.cleanText(text);
            vectorStoreService.upsert(vectorId, cleaned, record);
            vectorIds.add(vectorId);
        }
        return new AiMlDto.IngestResponse(request.records().size(), vectorIds);
    }

    public AiMlDto.PreprocessResponse preprocess(AiMlDto.PreprocessRequest request) {
        String cleaned = preprocessingService.cleanText(request.text());
        return new AiMlDto.PreprocessResponse(cleaned, preprocessingService.normalizeFeatures(request.numericFeatures()));
    }
}