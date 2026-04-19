package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.model.ModelDescriptor;
import com.xrs.aimlservice.service.AbTestingService;
import com.xrs.aimlservice.service.ModelRegistryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai/ops")
public class OpsController {

    private final ModelRegistryService modelRegistryService;
    private final AbTestingService abTestingService;

    public OpsController(ModelRegistryService modelRegistryService, AbTestingService abTestingService) {
        this.modelRegistryService = modelRegistryService;
        this.abTestingService = abTestingService;
    }

    @PostMapping("/models/register")
    public ModelDescriptor register(@Valid @RequestBody AiMlDto.ModelRegisterRequest request) {
        return modelRegistryService.register(request.version(), request.provider(), request.endpoint());
    }

    @PutMapping("/models/active")
    public Map<String, String> setActive(@Valid @RequestBody AiMlDto.AbConfigRequest request) {
        modelRegistryService.setActiveModels(request.modelA(), request.modelB());
        return Map.of("modelA", modelRegistryService.getActivePrimary(), "modelB", modelRegistryService.getActiveSecondary());
    }

    @PutMapping("/ab-test")
    public Map<String, Integer> setAb(@Valid @RequestBody AiMlDto.AbConfigRequest request) {
        int split = request.splitPercentage() == null ? 50 : request.splitPercentage();
        abTestingService.setSplitPercentage(split);
        return Map.of("splitPercentage", abTestingService.getSplitPercentage());
    }

    @GetMapping("/models")
    public Map<String, ModelDescriptor> models() {
        return modelRegistryService.all();
    }
}