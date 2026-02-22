package com.distributedtransactions.notificationservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    public void notifyCustomer(String orderId, String message) {
        // Simulate sending notification (e.g., email, SMS)
        log.info("[NotificationService] Notifying customer for Order ID: {} - Message: {}", orderId, message);
    }
}
