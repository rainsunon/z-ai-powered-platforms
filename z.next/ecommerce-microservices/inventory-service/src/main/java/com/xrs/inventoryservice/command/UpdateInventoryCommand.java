package com.xrs.inventoryservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

/**
 * Command to update inventory quantity.
 * Implements CQRS pattern for write operations.
 */
public record UpdateInventoryCommand(
    String commandId,
    Integer productId,
    String productName,
    Integer quantity
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "UpdateInventory";
    }

    @Override
    public void validate() {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        if (productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("Product name cannot be blank");
        }
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("Quantity must be non-negative");
        }
    }

    /**
     * Handler for UpdateInventoryCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class UpdateInventoryHandler implements CommandHandler<UpdateInventoryCommand, Inventory> {
        
        private final InventoryRepository inventoryRepository;
        
        @Override
        @Transactional
        public Mono<Inventory> handle(UpdateInventoryCommand command) {
            log.info("Handling UpdateInventoryCommand: {}", command.commandId());
            
            // Find or create inventory
            Inventory inventory = inventoryRepository.findByProductId(command.productId())
                    .orElse(new Inventory(command.productId(), command.productName(), 0));
            
            // Update quantity
            inventory.setQuantity(command.quantity());
            inventoryRepository.save(inventory);
            
            log.info("Inventory updated successfully for product {}: quantity={}", command.productName(), command.quantity());
            
            return Mono.just(inventory);
        }
    }
}
