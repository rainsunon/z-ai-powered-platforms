package com.distributedtransactions.notificationservice.listener;

import com.distributedtransactions.common.dto.OrderCommand;
import com.distributedtransactions.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationCommandListener {

    private final NotificationService notificationService;

    @KafkaListener(topics = "notification-commands", groupId = "notification-service-group")
    public void listenNotificationCommands(OrderCommand command) {
        log.info("[NotificationService] Received command: {}", command);

        switch (command.getType()) {
            case "NOTIFY_CUSTOMER" -> {
                notificationService.notifyCustomer(command.getOrderId(), "Your order has been shipped successfully!");
                log.info("[NotificationService] Sent success notification for Order ID: {}", command.getOrderId());
            }
            case "NOTIFY_CUSTOMER_FAILURE" -> {
                notificationService.notifyCustomer(command.getOrderId(), "We're sorry, your order has failed.");
                log.info("[NotificationService] Sent failure notification for Order ID: {}", command.getOrderId());
            }
            default -> log.warn("[NotificationService] Unknown command type: {}", command.getType());
        }
    }
}
