package com.healthcare.ai.api.controller;

import com.healthcare.ai.common.dto.request.RecommendationRequest;
import com.healthcare.ai.common.dto.response.RecommendationResponse;
import com.healthcare.ai.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Recommendation Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "AI-powered personalized plan recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/recommend")
    @Operation(summary = "Get personalized recommendations", description = "Get AI-powered plan recommendations based on customer profile and context")
    public ResponseEntity<RecommendationResponse> recommend(@Valid @RequestBody RecommendationRequest request) {
        log.info("Received recommendation request: customerId='{}', context='{}'", request.getCustomerId(), request.getContext());
        RecommendationResponse response = recommendationService.recommend(request);
        return ResponseEntity.ok(response);
    }
}
