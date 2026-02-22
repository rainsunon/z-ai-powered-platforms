package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.service.PreprocessingService;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class HeuristicChatProvider implements ChatProvider {

    private final PreprocessingService preprocessingService;

    public HeuristicChatProvider(PreprocessingService preprocessingService) {
        this.preprocessingService = preprocessingService;
    }

    @Override
    public String providerName() {
        return "heuristic";
    }

    @Override
    public boolean isConfigured() {
        return true;
    }

    @Override
    public ChatProviderResult chat(AiMlDto.ChatRequest request, String conversationId) {
        String cleaned = preprocessingService.cleanText(request.message());
        String reply;
        if (cleaned.contains("hello") || cleaned.contains("hi")) {
            reply = "Hello! I can help with product insights, recommendations, and order-related questions.";
        } else if (cleaned.contains("recommend")) {
            reply = "Try asking for recommendations with your category or preferences, and I can tailor suggestions.";
        } else if (cleaned.contains("order")) {
            reply = "To help with orders, provide an order id and what you want to check (status, payment, shipping).";
        } else {
            reply = "Heuristic response: " + request.message().toUpperCase(Locale.ROOT);
        }

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("conversationId", conversationId);
        metadata.put("historyCount", request.history() == null ? 0 : request.history().size());
        metadata.put("fallback", true);
        return new ChatProviderResult(providerName(), "heuristic-v1", reply, metadata);
    }
}