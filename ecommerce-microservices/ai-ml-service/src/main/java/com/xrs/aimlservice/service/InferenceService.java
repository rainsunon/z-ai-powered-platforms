package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.commonlib.exception.BadRequestException;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class InferenceService {

    private static final Logger log = LoggerFactory.getLogger(InferenceService.class);

    private final ModelRegistryService modelRegistryService;
    private final AbTestingService abTestingService;
    private final PreprocessingService preprocessingService;
    private final MeterRegistry meterRegistry;
    private final AtomicLong lastLatencyMs = new AtomicLong(0);

    public InferenceService(ModelRegistryService modelRegistryService,
                            AbTestingService abTestingService,
                            PreprocessingService preprocessingService,
                            MeterRegistry meterRegistry) {
        this.modelRegistryService = modelRegistryService;
        this.abTestingService = abTestingService;
        this.preprocessingService = preprocessingService;
        this.meterRegistry = meterRegistry;
    }

    public AiMlDto.InferenceResponse infer(AiMlDto.InferenceRequest request) {
        if (request == null || request.input() == null || request.input().isBlank()) {
            log.warn("Invalid inference request: input is required");
            throw new BadRequestException("Input is required for inference");
        }

        long startTime = System.nanoTime();

        String variant = abTestingService.pickVariant(request.userId());
        String selectedVersion = request.modelVersion();
        if (selectedVersion == null || selectedVersion.isBlank()) {
            selectedVersion = "A".equals(variant)
                    ? modelRegistryService.getActivePrimary()
                    : modelRegistryService.getActiveSecondary();
        }

        log.debug("Running inference for user: {}, variant: {}, model: {}", 
                request.userId(), variant, selectedVersion);

        try {
            String cleanedInput = preprocessingService.cleanText(request.input());
            String result = buildHeuristicResult(cleanedInput);

            long latencyMs = (System.nanoTime() - startTime) / 1_000_000;
            lastLatencyMs.set(latencyMs);
            meterRegistry.timer("aiml.inference.latency").record(latencyMs, java.util.concurrent.TimeUnit.MILLISECONDS);

            log.info("Inference completed for user: {}, latency: {}ms, model: {}", 
                    request.userId(), latencyMs, selectedVersion);

            return new AiMlDto.InferenceResponse(selectedVersion, variant, result, latencyMs);
        } catch (Exception e) {
            log.error("Error during inference for user: {}, model: {}", 
                    request.userId(), selectedVersion, e);
            throw e;
        }
    }

    public long getLastLatencyMs() {
        return lastLatencyMs.get();
    }

    private String buildHeuristicResult(String input) {
        if (input.contains("summarize") || input.length() > 120) {
            String summary = input.length() > 160 ? input.substring(0, 160) : input;
            return "Summary: " + summary;
        }
        if (input.contains("sentiment") || input.contains("review")) {
            String sentiment = input.contains("bad") || input.contains("hate") ? "NEGATIVE" : "POSITIVE";
            return "Classification: sentiment=" + sentiment;
        }
        return "Inference output: " + input.toUpperCase(Locale.ROOT);
    }
}