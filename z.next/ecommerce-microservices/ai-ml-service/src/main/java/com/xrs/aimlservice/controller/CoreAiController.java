package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.service.InferenceService;
import com.xrs.aimlservice.service.ModerationService;
import com.xrs.aimlservice.service.RagService;
import com.xrs.aimlservice.service.chat.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class CoreAiController {

    private final InferenceService inferenceService;
    private final RagService ragService;
    private final ModerationService moderationService;
    private final ChatbotService chatbotService;

    public CoreAiController(InferenceService inferenceService,
                            RagService ragService,
                            ModerationService moderationService,
                            ChatbotService chatbotService) {
        this.inferenceService = inferenceService;
        this.ragService = ragService;
        this.moderationService = moderationService;
        this.chatbotService = chatbotService;
    }

    @PostMapping("/inference")
    public AiMlDto.InferenceResponse infer(@Valid @RequestBody AiMlDto.InferenceRequest request) {
        return inferenceService.infer(request);
    }

    @PostMapping("/rag/chat")
    public AiMlDto.RagResponse rag(@Valid @RequestBody AiMlDto.RagRequest request) {
        return ragService.chat(request);
    }

    @PostMapping("/chatbot/chat")
    public AiMlDto.ChatResponse chat(@Valid @RequestBody AiMlDto.ChatRequest request) {
        return chatbotService.chat(request);
    }

    @PostMapping("/moderation/check")
    public AiMlDto.ModerationResponse moderation(@Valid @RequestBody AiMlDto.ModerationRequest request) {
        return moderationService.check(request);
    }
}