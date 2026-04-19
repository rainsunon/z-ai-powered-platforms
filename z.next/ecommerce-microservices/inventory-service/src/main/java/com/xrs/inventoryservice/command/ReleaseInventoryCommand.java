package com.xrs.inventoryservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Command to release reserved inventory back to stock.
 * Implements CQRS pattern for write operations.
 */
public record ReleaseInventoryCommand(
    String commandId,
    String reservationId,
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
        return "ReleaseInventory";
    }

    @Override
    public void validate() {
        if (reservationId == null || reservationId.isBlank()) {
            throw new IllegalArgumentException("Reservation ID cannot be null or blank");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Inventory items cannot be empty");
        }
    }

    /**
     * Handler for ReleaseInventoryCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ReleaseInventoryHandler implements CommandHandler<ReleaseInventoryCommand, Void> {
        
        private final InventoryRepository inventoryRepository;
        
        @Override
        @Transactional
        public Mono<Void> handle(ReleaseInventoryCommand command) {
            log.info("Handling ReleaseInventoryCommand: {}", command.commandId());
            
            // Release inventory for each item
            for (InventoryItem item : command.items()) {
                Inventory inventory = inventoryRepository.findByProductId(item.productId())
                        .orElseThrow(() -> new IllegalArgumentException("Inventory not found for product: " + item.productName()));
                
                inventory.setQuantity(inventory.getQuantity() + item.quantity());
                inventoryRepository.save(inventory);
                
                log.info("Released {} units of product {} for reservation {}", item.quantity(), item.productName(), command.reservationId());
            }
            
            log.info("Inventory released successfully for reservation {}", command.reservationId());
            
            return Mono.empty();
        }
    }
}
