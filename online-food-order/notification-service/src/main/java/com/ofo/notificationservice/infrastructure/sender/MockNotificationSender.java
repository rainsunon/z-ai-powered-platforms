package com.ofo.notificationservice.infrastructure.sender;

import com.ofo.notificationservice.domain.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@Slf4j
public class MockNotificationSender implements NotificationSender {
    @Override
    public void send(Notification notification, String body) {
        log.info("[DEV] Mock send to {} - subject='{}' body='{}'", notification.getRecipientEmail(), notification.getSubject(), body);
    }
}

