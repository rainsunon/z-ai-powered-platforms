package com.xrs.orderservice.domain.valueobject;

import java.util.Objects;

/**
 * Value object representing a reference to a product
 * Contains minimal product information needed for order processing
 */
public record ProductReference(
        Integer productId,
        String productName
) {

    public ProductReference {
        Objects.requireNonNull(productId, "Product ID cannot be null");
        Objects.requireNonNull(productName, "Product name cannot be null");

        if (productId <= 0) {
            throw new IllegalArgumentException("Product ID must be positive: " + productId);
        }
        if (productName.isBlank()) {
            throw new IllegalArgumentException("Product name cannot be blank");
        }
    }

    public static ProductReference of(Integer productId, String productName) {
        return new ProductReference(productId, productName);
    }
}
