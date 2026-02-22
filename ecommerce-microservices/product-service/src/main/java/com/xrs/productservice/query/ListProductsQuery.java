package com.xrs.productservice.query;

import com.xrs.commonlib.cqrs.Query;

/**
 * Query to list products with pagination and filtering.
 * Implements CQRS pattern for read operations.
 */
public record ListProductsQuery(
        int page,
        int size,
        String categoryId,
        String searchKeyword,
        String sortBy,
        String sortOrder
) implements Query {
    
    @Override
    public void validate() {
        if (page < 0) {
            throw new IllegalArgumentException("Page number must be non-negative");
        }
        if (size <= 0 || size > 100) {
            throw new IllegalArgumentException("Size must be between 1 and 100");
        }
    }
}
