package com.xrs.inventoryservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.inventoryservice.dto.response.InventoryResponse;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Command to reserve inventory for an order.
 * Implements CQRS pattern for write operations.
 */
public record ReserveInventoryCommand(
    String commandId,
    Integer orderId,
    List<InventoryItem> items
) implements Command {

    public record InventoryItem(
        Integer productId,
        String productName,
        Integer quantity
    ) {}

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "ReserveInventory";
    }

    @Override
    public void validate() {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Inventory items cannot be empty");
        }
    }

    /**
     * Handler for ReserveInventoryCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ReserveInventoryHandler implements CommandHandler<ReserveInventoryCommand, String> {
        
        private final InventoryRepository inventoryRepository;
        
        @Override
        @Transactional
        public Mono<String> handle(ReserveInventoryCommand command) {
            log.info("Handling ReserveInventoryCommand: {}", command.commandId());
            
            String reservationId = java.util.UUID.randomUUID().toString();
            
            // Reserve inventory for each item
            for (InventoryItem item : command.items()) {
                Inventory inventory = inventoryRepository.findByProductId(item.productId())
                        .orElseThrow(() -> new IllegalArgumentException("Inventory not found for product: " + item.productName()));
                
                if (inventory.getQuantity() < item.quantity()) {
                    throw new IllegalArgumentException("Insufficient inventory for product: " + item.productName());
                }
                
                inventory.setQuantity(inventory.getQuantity() - item.quantity());
                inventoryRepository.save(inventory);
                
                log.info("Reserved {} units of product {}", item.quantity(), item.productName());
            }
            
            log.info("Inventory reserved successfully for order {} with reservationId {}", command.orderId(), reservationId);
            
            return Mono.just(reservationId);
        }
    }
}
