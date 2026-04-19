package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CoreAiControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldPerformInference() throws Exception {
        AiMlDto.InferenceRequest request = new AiMlDto.InferenceRequest("user-123", null, "What is the weather today?");

        mockMvc.perform(post("/api/ai/inference")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelVersion").exists())
                .andExpect(jsonPath("$.result").exists())
                .andExpect(jsonPath("$.latencyMs").isNumber());
    }

    @Test
    void shouldRejectInferenceWithEmptyInput() throws Exception {
        AiMlDto.InferenceRequest request = new AiMlDto.InferenceRequest("user-123", null, "");

        mockMvc.perform(post("/api/ai/inference")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldPerformRagChat() throws Exception {
        AiMlDto.RagRequest request = new AiMlDto.RagRequest("user-123", "What products do you recommend?", 3);

        mockMvc.perform(post("/api/ai/rag/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").exists())
                .andExpect(jsonPath("$.context").isArray());
    }

    @Test
    void shouldPerformChatbotChat() throws Exception {
        AiMlDto.ChatRequest request = new AiMlDto.ChatRequest(
                "user-123", null, "heuristic", null, null, null, "Hello, how can you help me?"
        );

        mockMvc.perform(post("/api/ai/chatbot/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.provider").exists())
                .andExpect(jsonPath("$.reply").exists())
                .andExpect(jsonPath("$.conversationId").exists());
    }

    @Test
    void shouldCheckModeration() throws Exception {
        AiMlDto.ModerationRequest request = new AiMlDto.ModerationRequest("This is a nice product");

        mockMvc.perform(post("/api/ai/moderation/check")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowed").isBoolean())
                .andExpect(jsonPath("$.violations").isArray());
    }
}
