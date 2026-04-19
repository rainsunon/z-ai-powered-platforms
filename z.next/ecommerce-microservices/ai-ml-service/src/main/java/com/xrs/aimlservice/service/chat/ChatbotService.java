package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.config.ChatProviderProperties;
import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.commonlib.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class ChatbotService {

    private static final Logger log = LoggerFactory.getLogger(ChatbotService.class);

    private final Map<String, ChatProvider> providers;
    private final ChatProviderProperties properties;
    private final ChatProvider fallbackProvider;

    public ChatbotService(List<ChatProvider> providerList,
                          ChatProviderProperties properties,
                          HeuristicChatProvider fallbackProvider) {
        this.properties = properties;
        this.fallbackProvider = fallbackProvider;
        this.providers = new LinkedHashMap<>();
        for (ChatProvider provider : providerList) {
            this.providers.put(provider.providerName().toLowerCase(Locale.ROOT), provider);
        }
        log.info("Initialized ChatbotService with {} providers: {}", 
                providers.size(), providers.keySet());
    }

    public AiMlDto.ChatResponse chat(AiMlDto.ChatRequest request) {
        if (request == null || request.message() == null || request.message().isBlank()) {
            log.warn("Invalid chat request: message is required");
            throw new BadRequestException("Message is required for chat");
        }

        String conversationId = (request.conversationId() == null || request.conversationId().isBlank())
                ? "conv-" + UUID.randomUUID()
                : request.conversationId();

        log.debug("Processing chat request for user: {}, conversation: {}, provider: {}", 
                request.userId(), conversationId, request.provider());

        try {
            ChatProvider selected = resolveProvider(request.provider());
            log.info("Using chat provider: {} for conversation: {}", selected.providerName(), conversationId);
            
            ChatProviderResult result = selected.chat(request, conversationId);

            log.info("Chat response generated for conversation: {}, provider: {}, model: {}", 
                    conversationId, result.provider(), result.model());

            return new AiMlDto.ChatResponse(
                    result.provider(),
                    result.model(),
                    conversationId,
                    result.reply(),
                    result.metadata()
            );
        } catch (Exception e) {
            log.error("Error processing chat request for conversation: {}, provider: {}", 
                    conversationId, request.provider(), e);
            throw e;
        }
    }

    private ChatProvider resolveProvider(String requestedProvider) {
        String providerName = requestedProvider;
        if (providerName == null || providerName.isBlank()) {
            providerName = properties.getDefaultProvider();
        }
        String normalized = providerName == null ? "" : providerName.trim().toLowerCase(Locale.ROOT);

        log.debug("Resolving chat provider: {} (normalized: {})", requestedProvider, normalized);

        if ("auto".equals(normalized)) {
            ChatProvider gemini = providers.get("gemini");
            if (gemini != null && gemini.isConfigured()) {
                log.debug("Auto-selected provider: gemini");
                return gemini;
            }
            ChatProvider mcp = providers.get("mcp");
            if (mcp != null && mcp.isConfigured()) {
                log.debug("Auto-selected provider: mcp");
                return mcp;
            }
            log.debug("Auto-selected fallback provider: heuristic");
            return fallbackProvider;
        }

        ChatProvider provider = providers.get(normalized);
        if (provider == null) {
            log.warn("Unsupported chat provider requested: {}", providerName);
            throw new IllegalArgumentException("Unsupported chat provider: " + providerName);
        }

        if (!provider.isConfigured()) {
            if ("gemini".equals(normalized) || "mcp".equals(normalized)) {
                log.warn("Provider not configured: {}", normalized);
                throw new IllegalStateException("Provider not configured: " + normalized);
            }
            log.debug("Provider not configured, using fallback: {}", normalized);
            return fallbackProvider;
        }

        return provider;
    }
}