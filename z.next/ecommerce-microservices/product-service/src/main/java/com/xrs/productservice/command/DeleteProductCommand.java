package com.xrs.productservice.command;

import com.xrs.commonlib.cqrs.Command;

/**
 * Command to delete a product.
 * Implements CQRS pattern for write operations.
 */
public record DeleteProductCommand(
        String productId,
        String userId
) implements Command {
    
    @Override
    public void validate() {
        if (productId == null || productId.isBlank()) {
            throw new IllegalArgumentException("Product ID is required");
        }
    }
}
