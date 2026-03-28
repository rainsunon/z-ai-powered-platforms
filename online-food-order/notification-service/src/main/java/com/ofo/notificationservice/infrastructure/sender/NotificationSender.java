package com.ofo.notificationservice.infrastructure.sender;

import com.ofo.notificationservice.domain.model.Notification;

public interface NotificationSender {
    void send(Notification notification, String body);
}

