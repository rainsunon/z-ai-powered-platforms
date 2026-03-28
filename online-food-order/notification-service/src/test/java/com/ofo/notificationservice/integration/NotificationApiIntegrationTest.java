package com.ofo.notificationservice.integration;

import com.ofo.notificationservice.domain.model.Notification;
import com.ofo.notificationservice.domain.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class NotificationApiIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    NotificationRepository notificationRepository;

    @Test
    void searchEndpointReturnsOk() throws Exception {
        Notification notification = Notification.builder()
                .userId("U-1")
                .recipientEmail("dev@ofo.local")
                .type(Notification.NotificationType.ORDER_CONFIRMATION)
                .channel(Notification.NotificationChannel.EMAIL)
                .templateName("order-created")
                .status(Notification.NotificationStatus.SENT)
                .build();
        notificationRepository.save(notification);

        mockMvc.perform(get("/notifications")
                        .param("userId", "U-1")
                        .param("status", "SENT"))
                .andExpect(status().isOk());
    }
}

