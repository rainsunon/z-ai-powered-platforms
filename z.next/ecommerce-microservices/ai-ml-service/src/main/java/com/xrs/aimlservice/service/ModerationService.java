package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ModerationService {

    private final List<String> blockedKeywords;
    private final PreprocessingService preprocessingService;

    public ModerationService(@Value("${ai.moderation.blocked-keywords:violence,terrorism,hate,nsfw,abuse}") String blockedKeywords,
                             PreprocessingService preprocessingService) {
        this.blockedKeywords = List.of(blockedKeywords.split(","));
        this.preprocessingService = preprocessingService;
    }

    public AiMlDto.ModerationResponse check(AiMlDto.ModerationRequest request) {
        String content = preprocessingService.cleanText(request.content());
        List<String> violations = new ArrayList<>();
        for (String keyword : blockedKeywords) {
            String normalizedKeyword = preprocessingService.cleanText(keyword);
            if (!normalizedKeyword.isBlank() && content.contains(normalizedKeyword)) {
                violations.add(normalizedKeyword);
            }
        }
        return new AiMlDto.ModerationResponse(violations.isEmpty(), violations);
    }
}