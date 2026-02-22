package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.config.ChatProviderProperties;
import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class McpChatProvider implements ChatProvider {

    private final RestClient restClient;
    private final ChatProviderProperties properties;

    public McpChatProvider(RestClient.Builder restClientBuilder, ChatProviderProperties properties) {
        this.restClient = restClientBuilder.build();
        this.properties = properties;
    }

    @Override
    public String providerName() {
        return "mcp";
    }

    @Override
    public boolean isConfigured() {
        return properties.getMcp().isEnabled()
                && properties.getMcp().getEndpoint() != null
                && !properties.getMcp().getEndpoint().isBlank();
    }

    @Override
    @SuppressWarnings("unchecked")
    public ChatProviderResult chat(AiMlDto.ChatRequest request, String conversationId) {
        if (!isConfigured()) {
            throw new IllegalStateException("MCP provider is not configured. Set ai.chat.mcp.endpoint.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("conversationId", conversationId);
        payload.put("userId", request.userId());
        payload.put("message", request.message());
        payload.put("model", request.model());
        payload.put("systemPrompt", request.systemPrompt());
        payload.put("history", request.history() == null ? List.of() : request.history());

        RestClient.RequestBodySpec spec = restClient.post()
                .uri(properties.getMcp().getEndpoint())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

        if (properties.getMcp().getAuthToken() != null && !properties.getMcp().getAuthToken().isBlank()) {
            spec = spec.header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getMcp().getAuthToken());
        }
        if (properties.getMcp().getApiKey() != null && !properties.getMcp().getApiKey().isBlank()) {
            spec = spec.header(properties.getMcp().getApiKeyHeader(), properties.getMcp().getApiKey());
        }

        Map<String, Object> response = spec
                .body(payload)
                .retrieve()
                .body(Map.class);

        String reply = extractReply(response);
        String model = request.model() == null || request.model().isBlank() ? "mcp-default" : request.model();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("conversationId", conversationId);
        metadata.put("endpoint", properties.getMcp().getEndpoint());

        return new ChatProviderResult(providerName(), model, reply, metadata);
    }

    @SuppressWarnings("unchecked")
    private String extractReply(Map<String, Object> response) {
        if (response == null || response.isEmpty()) {
            return "";
        }
        Object directReply = response.get("reply");
        if (directReply instanceof String text && !text.isBlank()) {
            return text;
        }

        Object output = response.get("output");
        if (output instanceof String text && !text.isBlank()) {
            return text;
        }

        Object choicesObj = response.get("choices");
        if (choicesObj instanceof List<?> choices && !choices.isEmpty()) {
            Object first = choices.getFirst();
            if (first instanceof Map<?, ?> firstMap) {
                Object messageObj = firstMap.get("message");
                if (messageObj instanceof Map<?, ?> messageMap) {
                    Object content = messageMap.get("content");
                    if (content instanceof String text && !text.isBlank()) {
                        return text;
                    }
                }
            }
        }

        return String.valueOf(response);
    }
}