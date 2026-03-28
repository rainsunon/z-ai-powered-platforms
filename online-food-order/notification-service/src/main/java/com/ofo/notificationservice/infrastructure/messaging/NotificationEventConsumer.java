package com.ofo.notificationservice.infrastructure.messaging;

import com.ofo.notificationservice.application.service.NotificationService;
import com.ofo.notificationservice.domain.event.InvoiceGeneratedEvent;
import com.ofo.notificationservice.domain.event.OrderCreatedEvent;
import com.ofo.notificationservice.domain.event.OrderPaidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "order-created-events", groupId = "notification-service")
    public void handleOrderCreated(
            @Payload OrderCreatedEvent event,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment ack) {
        log.info("OrderCreatedEvent received: orderId={}, offset={}", event.getOrderId(), offset);
        notificationService.handleOrderCreated(event);
        ack.acknowledge();
    }

    @KafkaListener(topics = "order-paid-events", groupId = "notification-service")
    public void handleOrderPaid(
            @Payload OrderPaidEvent event,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment ack) {
        log.info("OrderPaidEvent received: orderId={}, offset={}", event.getOrderId(), offset);
        notificationService.handleOrderPaid(event);
        ack.acknowledge();
    }

    @KafkaListener(topics = "invoice-generated-events", groupId = "notification-service")
    public void handleInvoiceGenerated(
            @Payload InvoiceGeneratedEvent event,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment ack) {
        log.info("InvoiceGeneratedEvent received: invoiceId={}, offset={}", event.getInvoiceId(), offset);
        notificationService.handleInvoiceGenerated(event);
        ack.acknowledge();
    }
}

