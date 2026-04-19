package com.xrs.aimlservice.health;

import com.xrs.aimlservice.service.InferenceService;
import com.xrs.aimlservice.service.ModelRegistryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("aiModel")
public class AiModelHealthIndicator implements HealthIndicator {

    private final InferenceService inferenceService;
    private final ModelRegistryService modelRegistryService;
    private final long thresholdMs;

    public AiModelHealthIndicator(InferenceService inferenceService,
                                  ModelRegistryService modelRegistryService,
                                  @Value("${ai.observability.inference-latency-threshold-ms:5000}") long thresholdMs) {
        this.inferenceService = inferenceService;
        this.modelRegistryService = modelRegistryService;
        this.thresholdMs = thresholdMs;
    }

    @Override
    public Health health() {
        long latency = inferenceService.getLastLatencyMs();
        boolean healthy = latency == 0 || latency <= thresholdMs;

        Health.Builder builder = healthy ? Health.up() : Health.down();
        return builder
                .withDetail("lastInferenceLatencyMs", latency)
                .withDetail("latencyThresholdMs", thresholdMs)
                .withDetail("activeModelA", modelRegistryService.getActivePrimary())
                .withDetail("activeModelB", modelRegistryService.getActiveSecondary())
                .withDetail("registeredModelCount", modelRegistryService.all().size())
                .build();
    }
}