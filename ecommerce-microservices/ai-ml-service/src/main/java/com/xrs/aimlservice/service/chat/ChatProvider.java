package com.xrs.aimlservice.service.chat;

import com.xrs.aimlservice.dto.AiMlDto;

public interface ChatProvider {

    String providerName();

    boolean isConfigured();

    ChatProviderResult chat(AiMlDto.ChatRequest request, String conversationId);
}