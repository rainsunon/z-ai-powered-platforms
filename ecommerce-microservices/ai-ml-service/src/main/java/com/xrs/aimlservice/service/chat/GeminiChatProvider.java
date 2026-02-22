package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.config.ChatProviderProperties;
import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiChatProvider implements ChatProvider {

    private final RestClient restClient;
    private final ChatProviderProperties properties;

    public GeminiChatProvider(RestClient.Builder restClientBuilder, ChatProviderProperties properties) {
        this.restClient = restClientBuilder.build();
        this.properties = properties;
    }

    @Override
    public String providerName() {
        return "gemini";
    }

    @Override
    public boolean isConfigured() {
        return properties.getGemini().isEnabled()
                && properties.getGemini().getApiKey() != null
                && !properties.getGemini().getApiKey().isBlank();
    }

    @Override
    @SuppressWarnings("unchecked")
    public ChatProviderResult chat(AiMlDto.ChatRequest request, String conversationId) {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini provider is not configured. Set ai.chat.gemini.api-key.");
        }

        String model = (request.model() == null || request.model().isBlank())
                ? properties.getGemini().getModel()
                : request.model();

        String endpoint = properties.getGemini().getEndpointTemplate().replace("{model}", model)
                + "?key=" + properties.getGemini().getApiKey();

        Map<String, Object> payload = new HashMap<>();
        if (request.systemPrompt() != null && !request.systemPrompt().isBlank()) {
            payload.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", request.systemPrompt()))
            ));
        }

        List<Map<String, Object>> contents = new ArrayList<>();
        if (request.history() != null) {
            for (AiMlDto.ChatMessage message : request.history()) {
                if (message != null && message.content() != null && !message.content().isBlank()) {
                    String role = normalizeRole(message.role());
                    contents.add(Map.of(
                            "role", role,
                            "parts", List.of(Map.of("text", message.content()))
                    ));
                }
            }
        }
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", request.message()))
        ));
        payload.put("contents", contents);

        Map<String, Object> response = restClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(Map.class);

        String reply = extractGeminiText(response);
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("conversationId", conversationId);
        metadata.put("candidateCount", getCandidateCount(response));

        return new ChatProviderResult(providerName(), model, reply, metadata);
    }

    @SuppressWarnings("unchecked")
    private int getCandidateCount(Map<String, Object> response) {
        if (response == null) {
            return 0;
        }
        Object candidates = response.get("candidates");
        if (candidates instanceof List<?> list) {
            return list.size();
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> response) {
        if (response == null) {
            return "";
        }
        Object candidatesObj = response.get("candidates");
        if (!(candidatesObj instanceof List<?> candidates) || candidates.isEmpty()) {
            return "";
        }

        Object firstObj = candidates.getFirst();
        if (!(firstObj instanceof Map<?, ?> first)) {
            return "";
        }

        Object contentObj = first.get("content");
        if (!(contentObj instanceof Map<?, ?> content)) {
            return "";
        }

        Object partsObj = content.get("parts");
        if (!(partsObj instanceof List<?> parts) || parts.isEmpty()) {
            return "";
        }

        StringBuilder builder = new StringBuilder();
        for (Object partObj : parts) {
            if (partObj instanceof Map<?, ?> part) {
                Object textObj = part.get("text");
                if (textObj instanceof String text && !text.isBlank()) {
                    if (builder.length() > 0) {
                        builder.append('\n');
                    }
                    builder.append(text);
                }
            }
        }
        return builder.toString();
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "user";
        }
        String normalized = role.trim().toLowerCase();
        if ("assistant".equals(normalized) || "model".equals(normalized)) {
            return "model";
        }
        return "user";
    }
}