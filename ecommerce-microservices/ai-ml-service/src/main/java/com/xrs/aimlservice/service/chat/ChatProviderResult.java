package com.xrs.aimlservice.service.chat;

import java.util.Map;

public record ChatProviderResult(String provider, String model, String reply, Map<String, Object> metadata) {
}