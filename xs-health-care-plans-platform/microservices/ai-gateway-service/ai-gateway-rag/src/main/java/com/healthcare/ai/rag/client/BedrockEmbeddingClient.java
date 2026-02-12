package com.healthcare.ai.rag.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

import java.nio.charset.StandardCharsets;

/**
 * Bedrock Embedding Client - Generates embeddings using AWS Bedrock Titan
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BedrockEmbeddingClient {

    @Value("${aws.bedrock.region:us-east-1}")
    private String region;

    @Value("${aws.bedrock.embedding-model:amazon.titan-embed-text-v2:0}")
    private String embeddingModel;

    private final ObjectMapper objectMapper;
    private BedrockRuntimeClient bedrockClient;

    /**
     * Generate embedding for text
     */
    public float[] generateEmbedding(String text) {
        try {
            log.debug("Generating embedding for text (length: {})", text.length());

            if (bedrockClient == null) {
                initializeClient();
            }

            // Build request body for Titan Embeddings
            String requestBody = objectMapper.createObjectNode()
                    .put("inputText", text)
                    .toString();

            InvokeModelRequest request = InvokeModelRequest.builder()
                    .modelId(embeddingModel)
                    .body(SdkBytes.fromUtf8String(requestBody))
                    .build();

            InvokeModelResponse response = bedrockClient.invokeModel(request);
            String responseBody = response.body().asUtf8String();

            // Parse response to extract embedding
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            JsonNode embeddingNode = jsonNode.get("embedding");

            float[] embedding = new float[embeddingNode.size()];
            for (int i = 0; i < embeddingNode.size(); i++) {
                embedding[i] = (float) embeddingNode.get(i).asDouble();
            }

            log.debug("Generated embedding with {} dimensions", embedding.length);
            return embedding;

        } catch (Exception e) {
            log.error("Error generating embedding", e);
            throw new RuntimeException("Failed to generate embedding", e);
        }
    }

    /**
     * Initialize Bedrock client
     */
    private void initializeClient() {
        bedrockClient = BedrockRuntimeClient.builder()
                .region(Region.of(region))
                .build();
        log.info("Bedrock Runtime client initialized for region: {}", region);
    }
}
