package com.xrs.aimlservice.model;

import java.util.Map;

public record VectorDocument(String id, String text, float[] vector, Map<String, Object> metadata) {
}