package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.config.ChatProviderProperties;
import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.service.PreprocessingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ChatbotServiceTest {

    @Autowired
    private ChatbotService chatbotService;

    @Test
    void shouldFallbackToHeuristicWhenAutoAndNoExternalProvidersConfigured() {
        ChatProviderProperties properties = new ChatProviderProperties();
        properties.setDefaultProvider("auto");
        properties.getGemini().setEnabled(false);
        properties.getMcp().setEnabled(false);

        HeuristicChatProvider heuristic = new HeuristicChatProvider(new PreprocessingService());
        ChatbotService testService = new ChatbotService(List.of(heuristic), properties, heuristic);

        AiMlDto.ChatResponse response = testService.chat(new AiMlDto.ChatRequest(
                "u-1", null, "auto", null, null, List.of(), "hello assistant"
        ));

        assertEquals("heuristic", response.provider());
        assertEquals("heuristic-v1", response.model());
    }

    @Test
    void shouldRejectUnknownProvider() {
        ChatProviderProperties properties = new ChatProviderProperties();
        HeuristicChatProvider heuristic = new HeuristicChatProvider(new PreprocessingService());
        ChatbotService testService = new ChatbotService(List.of(heuristic), properties, heuristic);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> testService.chat(new AiMlDto.ChatRequest(
                        "u-1", null, "not-a-provider", null, null, List.of(), "test"
                )));

        assertEquals("Unsupported chat provider: not-a-provider", ex.getMessage());
    }

    @Test
    void shouldGenerateConversationIdWhenNotProvided() {
        ChatProviderProperties properties = new ChatProviderProperties();
        properties.setDefaultProvider("heuristic");
        HeuristicChatProvider heuristic = new HeuristicChatProvider(new PreprocessingService());
        ChatbotService testService = new ChatbotService(List.of(heuristic), properties, heuristic);

        AiMlDto.ChatResponse response = testService.chat(new AiMlDto.ChatRequest(
                "u-1", null, null, null, null, List.of(), "hello"
        ));

        assertNotNull(response.conversationId());
        assertTrue(response.conversationId().startsWith("conv-"));
    }

    @Test
    void shouldUseProvidedConversationId() {
        ChatProviderProperties properties = new ChatProviderProperties();
        properties.setDefaultProvider("heuristic");
        HeuristicChatProvider heuristic = new HeuristicChatProvider(new PreprocessingService());
        ChatbotService testService = new ChatbotService(List.of(heuristic), properties, heuristic);

        String providedId = "my-conversation-123";
        AiMlDto.ChatResponse response = testService.chat(new AiMlDto.ChatRequest(
                "u-1", providedId, null, null, null, List.of(), "hello"
        ));

        assertEquals(providedId, response.conversationId());
    }
}