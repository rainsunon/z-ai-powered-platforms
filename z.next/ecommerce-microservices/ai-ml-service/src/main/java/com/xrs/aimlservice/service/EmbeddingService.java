package com.xrs.aimlservice.service;

import org.springframework.stereotype.Service;

@Service
public class EmbeddingService {

    private static final int DIMENSION = 32;

    public float[] embed(String text) {
        String safeText = text == null ? "" : text;
        float[] vector = new float[DIMENSION];
        int hash = safeText.hashCode();
        for (int index = 0; index < DIMENSION; index++) {
            int mixed = hash ^ (index * 0x9E3779B9);
            vector[index] = (float) Math.sin(mixed * 0.0001);
        }
        return normalize(vector);
    }

    private float[] normalize(float[] vector) {
        double magnitude = 0.0;
        for (float value : vector) {
            magnitude += value * value;
        }
        magnitude = Math.sqrt(magnitude);
        if (magnitude == 0.0) {
            return vector;
        }
        for (int index = 0; index < vector.length; index++) {
            vector[index] = (float) (vector[index] / magnitude);
        }
        return vector;
    }
}