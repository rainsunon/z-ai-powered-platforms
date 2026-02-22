package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SmartFeaturesControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetRecommendations() throws Exception {
        AiMlDto.RecommendationRequest request = new AiMlDto.RecommendationRequest(
                "user-123",
                List.of("product-1", "product-2"),
                List.of("product-1", "product-2", "product-3", "product-4", "product-5"),
                3
        );

        mockMvc.perform(post("/api/ai/personalization/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommended").isArray());
    }

    @Test
    void shouldGetForecast() throws Exception {
        AiMlDto.ForecastRequest request = new AiMlDto.ForecastRequest(
                "sales",
                List.of(100.0, 110.0, 105.0, 115.0, 120.0),
                3
        );

        mockMvc.perform(post("/api/ai/predictive/forecast")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seriesName").value("sales"))
                .andExpect(jsonPath("$.forecast").isArray())
                .andExpect(jsonPath("$.forecast", hasSize(3)));
    }

    @Test
    void shouldSubmitAsyncTask() throws Exception {
        AiMlDto.AsyncTaskRequest request = new AiMlDto.AsyncTaskRequest(
                "user-123",
                "data-processing",
                null
        );

        mockMvc.perform(post("/api/ai/async/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").exists())
                .andExpect(jsonPath("$.status").value("QUEUED"));
    }

    @Test
    void shouldGetAsyncTaskStatus() throws Exception {
        // First submit a task
        AiMlDto.AsyncTaskRequest request = new AiMlDto.AsyncTaskRequest(
                "user-123",
                "data-processing",
                null
        );

        String response = mockMvc.perform(post("/api/ai/async/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract taskId from response
        String taskId = objectMapper.readTree(response).get("taskId").asText();

        // Then get task status
        mockMvc.perform(get("/api/ai/async/tasks/" + taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(taskId))
                .andExpect(jsonPath("$.status").exists());
    }

    @Test
    void shouldHandleEmptyHistoryForForecast() throws Exception {
        AiMlDto.ForecastRequest request = new AiMlDto.ForecastRequest(
                "sales",
                List.of(),
                3
        );

        mockMvc.perform(post("/api/ai/predictive/forecast")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seriesName").value("sales"))
                .andExpect(jsonPath("$.forecast").isArray());
    }

    @Test
    void shouldRejectAsyncTaskWithEmptyType() throws Exception {
        AiMlDto.AsyncTaskRequest request = new AiMlDto.AsyncTaskRequest(
                "user-123",
                "",
                null
        );

        mockMvc.perform(post("/api/ai/async/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectForecastWithEmptySeriesName() throws Exception {
        AiMlDto.ForecastRequest request = new AiMlDto.ForecastRequest(
                "",
                List.of(100.0, 110.0),
                3
        );

        mockMvc.perform(post("/api/ai/predictive/forecast")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
