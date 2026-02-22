package com.distributedtransactions.inventoryservice.listener;

import com.distributedtransactions.common.dto.OrderCommand;
import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryCommandListener {

    private final InventoryService inventoryService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "inventory-commands", groupId = "inventory-service-group")
    public void listenInventoryCommands(OrderCommand command) {
        log.info("[InventoryService] Received command: {}", command);

        switch (command.getType()) {
            case "RESERVE_INVENTORY" -> {
                boolean success = inventoryService.reserveInventory(command.getOrderId());
                if (success) {
                    // Publish Inventory Reserved Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "INVENTORY_RESERVED", null);
                    kafkaTemplate.send("inventory-events", event);
                    log.info("[InventoryService] Published INVENTORY_RESERVED event for Order ID: {}", command.getOrderId());
                } else {
                    // Publish Inventory Failed Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "INVENTORY_FAILED", "Insufficient stock");
                    kafkaTemplate.send("inventory-events", event);
                    log.info("[InventoryService] Published INVENTORY_FAILED event for Order ID: {}", command.getOrderId());
                }
            }
            case "RELEASE_INVENTORY" -> {
                inventoryService.releaseInventory(command.getOrderId());
                // Optionally, publish Inventory Released Event
                OrderEvent event = new OrderEvent(command.getOrderId(), "INVENTORY_RELEASED", null);
                kafkaTemplate.send("inventory-events", event);
                log.info("[InventoryService] Published INVENTORY_RELEASED event for Order ID: {}", command.getOrderId());
            }
            default -> log.warn("[InventoryService] Unknown command type: {}", command.getType());
        }
    }
}
