package com.ofo.notificationservice.application.service;

import com.ofo.notificationservice.domain.model.NotificationTemplate;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NotificationContentBuilderTest {

    @Test
    void buildsSubjectAndBodyWithVariables() {
        NotificationTemplate template = NotificationTemplate.builder()
                .templateName("order-created")
                .subject("Order {{orderId}} received")
                .body("Your order {{orderId}} total is {{amount}} {{currency}}")
                .build();

        NotificationContentBuilder builder = new NotificationContentBuilder();
        Map<String, Object> vars = Map.of("orderId", "O-123", "amount", 42, "currency", "USD");

        assertEquals("Order O-123 received", builder.buildSubject(template, vars));
        assertEquals("Your order O-123 total is 42 USD", builder.buildBody(template, vars));
    }
}

