package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ModerationServiceTest {

    @Autowired
    private ModerationService moderationService;

    @Test
    void shouldRejectBlockedKeywords() {
        AiMlDto.ModerationResponse response = moderationService.check(new AiMlDto.ModerationRequest("I hate this content"));

        assertFalse(response.allowed());
        assertTrue(response.violations().contains("hate"));
    }

    @Test
    void shouldAllowCleanContent() {
        AiMlDto.ModerationResponse response = moderationService.check(new AiMlDto.ModerationRequest("This is a nice product"));

        assertTrue(response.allowed());
        assertTrue(response.violations().isEmpty());
    }

    @Test
    void shouldDetectMultipleViolations() {
        AiMlDto.ModerationResponse response = moderationService.check(new AiMlDto.ModerationRequest("This content has violence and terrorism"));

        assertFalse(response.allowed());
        assertTrue(response.violations().contains("violence") || response.violations().contains("terrorism"));
    }
}