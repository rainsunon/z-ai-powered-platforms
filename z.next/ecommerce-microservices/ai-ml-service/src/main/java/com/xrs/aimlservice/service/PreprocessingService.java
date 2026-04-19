package com.xrs.aimlservice.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PreprocessingService {

    public String cleanText(String text) {
        if (text == null) {
            return "";
        }
        return text
                .replaceAll("\\p{Cntrl}", " ")
                .replaceAll("\\s+", " ")
                .trim()
                .toLowerCase();
    }

    public Map<String, Double> normalizeFeatures(Map<String, Double> features) {
        Map<String, Double> normalized = new HashMap<>();
        if (features == null) {
            return normalized;
        }
        for (Map.Entry<String, Double> entry : features.entrySet()) {
            Double value = entry.getValue() == null ? 0.0 : entry.getValue();
            double normalizedValue = value / (1.0 + Math.abs(value));
            normalized.put(entry.getKey(), normalizedValue);
        }
        return normalized;
    }
}