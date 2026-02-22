package com.distributedtransactions.orchestrator.listener;

import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.orchestrator.service.OrchestratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final OrchestratorService orchestratorService;

    @KafkaListener(topics = "order-events", groupId = "orchestrator-group")
    public void listenOrderEvents(OrderEvent event) {
        log.info("[Orchestrator] Received OrderEvent: {}", event);
        orchestratorService.handleOrderEvent(event);
    }

    @KafkaListener(topics = "inventory-events", groupId = "orchestrator-group")
    public void listenInventoryEvents(OrderEvent event) {
        log.info("[Orchestrator] Received InventoryEvent: {}", event);
        orchestratorService.handleOrderEvent(event);
    }

    @KafkaListener(topics = "payment-events", groupId = "orchestrator-group")
    public void listenPaymentEvents(OrderEvent event) {
        log.info("[Orchestrator] Received PaymentEvent: {}", event);
        orchestratorService.handleOrderEvent(event);
    }

    @KafkaListener(topics = "shipping-events", groupId = "orchestrator-group")
    public void listenShippingEvents(OrderEvent event) {
        log.info("[Orchestrator] Received ShippingEvent: {}", event);
        orchestratorService.handleOrderEvent(event);
    }
}
