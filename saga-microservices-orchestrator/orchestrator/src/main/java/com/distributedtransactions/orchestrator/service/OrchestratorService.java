package com.distributedtransactions.orchestrator.service;

import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.common.dto.OrderCommand;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrchestratorService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void handleOrderEvent(OrderEvent event) {
        log.info("[Orchestrator] Handling OrderEvent: {}", event);

        switch (event.getStatus()) {
            case "ORDER_CREATED" -> {
                // Send Reserve Inventory Command
                OrderCommand reserveInventoryCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123", // Replace with actual customer ID
                        event.getStatus().equals("ORDER_CREATED") ? 100.0 : 0.0,
                        "RESERVE_INVENTORY"
                );
                kafkaTemplate.send("inventory-commands", reserveInventoryCommand);
                log.info("[Orchestrator] Sent RESERVE_INVENTORY command for Order ID: {}", event.getOrderId());
            }
            case "ORDER_FAILED" -> {
                // Possibly trigger compensations or notify
                log.warn("[Orchestrator] Order creation failed for Order ID: {}", event.getOrderId());
            }
            case "INVENTORY_RESERVED" -> {
                // Send Process Payment Command
                OrderCommand processPaymentCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        100.0,
                        "PROCESS_PAYMENT"
                );
                kafkaTemplate.send("payment-commands", processPaymentCommand);
                log.info("[Orchestrator] Sent PROCESS_PAYMENT command for Order ID: {}", event.getOrderId());
            }
            case "INVENTORY_FAILED" -> {
                // Send Cancel Order Command
                OrderCommand cancelOrderCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        0.0,
                        "CANCEL_ORDER"
                );
                kafkaTemplate.send("order-commands", cancelOrderCommand);
                log.info("[Orchestrator] Sent CANCEL_ORDER command for Order ID: {}", event.getOrderId());
            }
            case "PAYMENT_SUCCESS" -> {
                // Send Ship Order Command
                OrderCommand shipOrderCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        100.0,
                        "SHIP_ORDER"
                );
                kafkaTemplate.send("shipping-commands", shipOrderCommand);
                log.info("[Orchestrator] Sent SHIP_ORDER command for Order ID: {}", event.getOrderId());
            }
            case "PAYMENT_FAILED" -> {
                // Send Release Inventory and Cancel Order Commands
                OrderCommand releaseInventoryCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        0.0,
                        "RELEASE_INVENTORY"
                );
                kafkaTemplate.send("inventory-commands", releaseInventoryCommand);
                log.info("[Orchestrator] Sent RELEASE_INVENTORY command for Order ID: {}", event.getOrderId());

                OrderCommand cancelOrderCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        0.0,
                        "CANCEL_ORDER"
                );
                kafkaTemplate.send("order-commands", cancelOrderCommand);
                log.info("[Orchestrator] Sent CANCEL_ORDER command for Order ID: {}", event.getOrderId());
            }
            case "ORDER_SHIPPED" -> {
                // Send Notification Command
                OrderCommand notifyCommand = new OrderCommand(
                        event.getOrderId(),
                        "customer-123",
                        100.0,
                        "NOTIFY_CUSTOMER"
                );
                kafkaTemplate.send("notification-commands", notifyCommand);
                log.info("[Orchestrator] Sent NOTIFY_CUSTOMER command for Order ID: {}", event.getOrderId());
            }
            default -> log.warn("[Orchestrator] Unknown event status: {}", event.getStatus());
        }
    }
}
