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
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class IngestPrepControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldIngestRecords() throws Exception {
        List<Map<String, Object>> records = List.of(
                Map.of("title", "Product A", "description", "Great product"),
                Map.of("title", "Product B", "description", "Excellent product")
        );
        AiMlDto.IngestRequest request = new AiMlDto.IngestRequest("test-source", records);

        mockMvc.perform(post("/api/ai/ingest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recordsIngested").value(2))
                .andExpect(jsonPath("$.vectorIds").isArray())
                .andExpect(jsonPath("$.vectorIds", hasSize(2)));
    }

    @Test
    void shouldPreprocessText() throws Exception {
        AiMlDto.PreprocessRequest request = new AiMlDto.PreprocessRequest(
                "  Hello   World!  ", Map.of("price", 100.0, "rating", 4.5)
        );

        mockMvc.perform(post("/api/ai/preprocess")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cleanedText").exists())
                .andExpect(jsonPath("$.normalizedFeatures").isMap());
    }

    @Test
    void shouldUpsertVector() throws Exception {
        AiMlDto.VectorUpsertRequest request = new AiMlDto.VectorUpsertRequest(
                "doc-123", "This is a test document", Map.of("category", "test")
        );

        mockMvc.perform(post("/api/ai/vectors/upsert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("doc-123"))
                .andExpect(jsonPath("$.status").value("UPSERTED"));
    }

    @Test
    void shouldSearchVectors() throws Exception {
        // First upsert some vectors
        AiMlDto.VectorUpsertRequest upsertRequest = new AiMlDto.VectorUpsertRequest(
                "doc-456", "running shoes for athletes", Map.of("category", "shoes")
        );
        mockMvc.perform(post("/api/ai/vectors/upsert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(upsertRequest)))
                .andExpect(status().isOk());

        // Then search
        AiMlDto.VectorSearchRequest searchRequest = new AiMlDto.VectorSearchRequest("athletic shoes", 5);
        mockMvc.perform(post("/api/ai/vectors/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.matches").isArray());
    }

    @Test
    void shouldRejectIngestWithEmptyRecords() throws Exception {
        AiMlDto.IngestRequest request = new AiMlDto.IngestRequest("test-source", List.of());

        mockMvc.perform(post("/api/ai/ingest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectUpsertWithEmptyId() throws Exception {
        AiMlDto.VectorUpsertRequest request = new AiMlDto.VectorUpsertRequest(
                "", "test text", Map.of()
        );

        mockMvc.perform(post("/api/ai/vectors/upsert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
