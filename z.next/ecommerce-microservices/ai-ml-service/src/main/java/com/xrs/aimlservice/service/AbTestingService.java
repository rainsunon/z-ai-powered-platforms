package com.xrs.aimlservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AbTestingService {

    private volatile int splitPercentage;

    public AbTestingService(@Value("${ai.ab-test.split-percentage:50}") int splitPercentage) {
        this.splitPercentage = splitPercentage;
    }

    public String pickVariant(String stableKey) {
        String safeKey = (stableKey == null || stableKey.isBlank()) ? "anonymous" : stableKey;
        int bucket = Math.abs(safeKey.hashCode()) % 100;
        return bucket < splitPercentage ? "A" : "B";
    }

    public void setSplitPercentage(int splitPercentage) {
        if (splitPercentage < 0 || splitPercentage > 100) {
            throw new IllegalArgumentException("splitPercentage must be between 0 and 100");
        }
        this.splitPercentage = splitPercentage;
    }

    public int getSplitPercentage() {
        return splitPercentage;
    }
}