package com.xrs.productservice.query;

import com.xrs.commonlib.cqrs.Query;

/**
 * Query to get a single product by ID.
 * Implements CQRS pattern for read operations.
 */
public record GetProductQuery(String productId) implements Query {
    
    @Override
    public void validate() {
        if (productId == null || productId.isBlank()) {
            throw new IllegalArgumentException("Product ID is required");
        }
    }
}
