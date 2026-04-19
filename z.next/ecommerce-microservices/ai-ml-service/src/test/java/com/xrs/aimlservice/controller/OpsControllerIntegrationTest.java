package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OpsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRegisterModel() throws Exception {
        AiMlDto.ModelRegisterRequest request = new AiMlDto.ModelRegisterRequest(
                "model-v3", "openai", "https://api.openai.com/v1"
        );

        mockMvc.perform(post("/api/ai/ops/models/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value("model-v3"))
                .andExpect(jsonPath("$.provider").value("openai"));
    }

    @Test
    void shouldSetActiveModels() throws Exception {
        AiMlDto.AbConfigRequest request = new AiMlDto.AbConfigRequest("model-v1", "model-v2", 50);

        mockMvc.perform(put("/api/ai/ops/models/active")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelA").exists())
                .andExpect(jsonPath("$.modelB").exists());
    }

    @Test
    void shouldSetAbTestSplit() throws Exception {
        AiMlDto.AbConfigRequest request = new AiMlDto.AbConfigRequest("model-v1", "model-v2", 75);

        mockMvc.perform(put("/api/ai/ops/ab-test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.splitPercentage").value(75));
    }

    @Test
    void shouldGetAllModels() throws Exception {
        mockMvc.perform(get("/api/ai/ops/models"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap());
    }

    @Test
    void shouldRejectInvalidSplitPercentage() throws Exception {
        AiMlDto.AbConfigRequest request = new AiMlDto.AbConfigRequest("model-v1", "model-v2", 150);

        mockMvc.perform(put("/api/ai/ops/ab-test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectModelRegistrationWithEmptyVersion() throws Exception {
        AiMlDto.ModelRegisterRequest request = new AiMlDto.ModelRegisterRequest(
                "", "openai", "https://api.openai.com/v1"
        );

        mockMvc.perform(post("/api/ai/ops/models/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
