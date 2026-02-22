package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.service.AsyncProcessingService;
import com.xrs.aimlservice.service.PersonalizationService;
import com.xrs.aimlservice.service.PredictiveAnalyticsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class SmartFeaturesController {

    private final PersonalizationService personalizationService;
    private final PredictiveAnalyticsService predictiveAnalyticsService;
    private final AsyncProcessingService asyncProcessingService;

    public SmartFeaturesController(PersonalizationService personalizationService,
                                   PredictiveAnalyticsService predictiveAnalyticsService,
                                   AsyncProcessingService asyncProcessingService) {
        this.personalizationService = personalizationService;
        this.predictiveAnalyticsService = predictiveAnalyticsService;
        this.asyncProcessingService = asyncProcessingService;
    }

    @PostMapping("/personalization/recommendations")
    public AiMlDto.RecommendationResponse recommend(@RequestBody AiMlDto.RecommendationRequest request) {
        return personalizationService.recommend(request);
    }

    @PostMapping("/predictive/forecast")
    public AiMlDto.ForecastResponse forecast(@Valid @RequestBody AiMlDto.ForecastRequest request) {
        return predictiveAnalyticsService.forecast(request);
    }

    @PostMapping("/async/tasks")
    public AiMlDto.AsyncTaskResponse submitTask(@Valid @RequestBody AiMlDto.AsyncTaskRequest request) {
        return asyncProcessingService.submit(request);
    }

    @GetMapping("/async/tasks/{taskId}")
    public AiMlDto.AsyncTaskStatusResponse getTask(@PathVariable String taskId) {
        return asyncProcessingService.status(taskId);
    }
}