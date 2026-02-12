package com.healthcare.ai.common.dto.response;

import com.healthcare.ai.common.constants.Verdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response for plan recommendations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private Verdict verdict;
    private List<Recommendation> recommendations;
    private List<String> alternatives;
    private List<String> nextSteps;
    private String reason;
    private List<String> missingContext;
    private String suggestion;
}
