package com.ofo.billingservice.infrastructure.messaging;

import com.ofo.billingservice.application.service.BillingService;
import com.ofo.billingservice.domain.event.OrderPaidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Kafka Consumer for Order Events
 * Implements idempotent event processing with manual acknowledgment
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final BillingService billingService;

    @KafkaListener(topics = "order-paid-events", groupId = "billing-service")
    public void handleOrderPaidEvent(
            @Payload OrderPaidEvent event,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {

        log.info("Received OrderPaidEvent: orderId={}, requestId={}, partition={}, offset={}",
                event.getOrderId(), event.getRequestId(), partition, offset);

        try {
            // Process with idempotency check
            billingService.processBillingTransaction(event);

            // Manual acknowledgment for exactly-once semantics
            acknowledgment.acknowledge();

            log.info("Successfully processed OrderPaidEvent: orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to process OrderPaidEvent: orderId={}, error={}",
                    event.getOrderId(), e.getMessage(), e);
            // Don't acknowledge - will retry based on Kafka config
        }
    }
}

