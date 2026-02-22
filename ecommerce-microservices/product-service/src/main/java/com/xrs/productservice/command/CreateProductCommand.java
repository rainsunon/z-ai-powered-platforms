package com.xrs.productservice.command;

import com.xrs.commonlib.cqrs.Command;

import java.math.BigDecimal;

/**
 * Command to create a new product.
 * Implements CQRS pattern for write operations.
 */
public record CreateProductCommand(
        String productId,
        String name,
        String description,
        BigDecimal price,
        String categoryId,
        String userId
) implements Command {
    
    @Override
    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be positive");
        }
        if (categoryId == null || categoryId.isBlank()) {
            throw new IllegalArgumentException("Category ID is required");
        }
    }
}
