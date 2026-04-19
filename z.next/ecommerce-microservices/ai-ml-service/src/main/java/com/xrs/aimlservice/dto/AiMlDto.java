package com.xrs.aimlservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public final class AiMlDto {

    private AiMlDto() {
    }

    public record IngestRequest(
            @NotBlank(message = "source is required") String source,
            @NotNull(message = "records are required") List<Map<String, Object>> records
    ) {
    }

    public record IngestResponse(int recordsIngested, List<String> vectorIds) {
    }

    public record PreprocessRequest(String text, Map<String, Double> numericFeatures) {
    }

    public record PreprocessResponse(String cleanedText, Map<String, Double> normalizedFeatures) {
    }

    public record VectorUpsertRequest(
            @NotBlank(message = "id is required") String id,
            @NotBlank(message = "text is required") String text,
            Map<String, Object> metadata
    ) {
    }

    public record VectorSearchRequest(
            @NotBlank(message = "query is required") String query,
            Integer topK
    ) {
    }

    public record VectorMatch(String id, double score, String text, Map<String, Object> metadata) {
    }

    public record VectorSearchResponse(List<VectorMatch> matches) {
    }

    public record VectorUpsertResponse(String id, String status) {
    }

    public record InferenceRequest(String userId, String modelVersion, @NotBlank(message = "input is required") String input) {
    }

    public record InferenceResponse(String modelVersion, String variant, String result, long latencyMs) {
    }

    public record RagRequest(String userId, @NotBlank(message = "question is required") String question, Integer topK) {
    }

    public record RagResponse(String answer, List<VectorMatch> context) {
    }

    public record ChatMessage(String role, @NotBlank(message = "content is required") String content) {
    }

    public record ChatRequest(
            String userId,
            String conversationId,
            String provider,
            String model,
            String systemPrompt,
            List<ChatMessage> history,
            @NotBlank(message = "message is required") String message
    ) {
    }

    public record ChatResponse(
            String provider,
            String model,
            String conversationId,
            String reply,
            Map<String, Object> metadata
    ) {
    }

    public record ModerationRequest(@NotBlank(message = "content is required") String content) {
    }

    public record ModerationResponse(boolean allowed, List<String> violations) {
    }

    public record RecommendationRequest(
            String userId,
            List<String> clickHistory,
            List<String> catalogItems,
            Integer limit
    ) {
    }

    public record RecommendationResponse(List<String> recommended) {
    }

    public record ForecastRequest(
            @NotBlank(message = "seriesName is required") String seriesName,
            @NotNull(message = "history is required") List<Double> history,
            Integer horizon
    ) {
    }

    public record ForecastResponse(String seriesName, List<Double> forecast) {
    }

    public record AsyncTaskRequest(
            String userId,
            @NotBlank(message = "taskType is required") String taskType,
            Map<String, Object> payload
    ) {
    }

    public record AsyncTaskResponse(String taskId, String status) {
    }

    public record AsyncTaskStatusResponse(String taskId, String status, Map<String, Object> output) {
    }

    public record ModelRegisterRequest(
            @NotBlank(message = "version is required") String version,
            String provider,
            String endpoint
    ) {
    }

    public record AbConfigRequest(
            @NotBlank(message = "modelA is required") String modelA,
            @NotBlank(message = "modelB is required") String modelB,
            Integer splitPercentage
    ) {
    }
}