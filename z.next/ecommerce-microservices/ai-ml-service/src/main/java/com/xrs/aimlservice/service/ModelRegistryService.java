package com.xrs.aimlservice.service;

import com.xrs.aimlservice.model.ModelDescriptor;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ModelRegistryService {

    private final Map<String, ModelDescriptor> registry = new ConcurrentHashMap<>();
    private volatile String activePrimary;
    private volatile String activeSecondary;

    @Value("${ai.model.active-primary:model-v1}")
    private String configuredPrimary;

    @Value("${ai.model.active-secondary:model-v2}")
    private String configuredSecondary;

    @PostConstruct
    void initialize() {
        registry.put("model-v1", new ModelDescriptor("model-v1", "ollama", "local://llama3"));
        registry.put("model-v2", new ModelDescriptor("model-v2", "openai-compatible", "https://api.provider/v1"));
        activePrimary = configuredPrimary;
        activeSecondary = configuredSecondary;
    }

    public ModelDescriptor register(String version, String provider, String endpoint) {
        ModelDescriptor descriptor = new ModelDescriptor(version, provider == null ? "custom" : provider,
                endpoint == null ? "local://custom" : endpoint);
        registry.put(version, descriptor);
        return descriptor;
    }

    public ModelDescriptor get(String version) {
        return registry.get(version);
    }

    public Map<String, ModelDescriptor> all() {
        return registry;
    }

    public String getActivePrimary() {
        return activePrimary;
    }

    public String getActiveSecondary() {
        return activeSecondary;
    }

    public void setActiveModels(String modelA, String modelB) {
        if (!registry.containsKey(modelA) || !registry.containsKey(modelB)) {
            throw new IllegalArgumentException("Both model versions must be registered before activation");
        }
        this.activePrimary = modelA;
        this.activeSecondary = modelB;
    }
}