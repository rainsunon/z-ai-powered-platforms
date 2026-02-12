package com.healthcare.ai.common.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request for semantic plan search
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {

    @NotBlank(message = "Query is required")
    private String query;

    @Builder.Default
    private Map<String, Object> filters = Map.of();

    @Builder.Default
    private Integer limit = 5;

    @Builder.Default
    private Double minSimilarity = 0.3;
}
