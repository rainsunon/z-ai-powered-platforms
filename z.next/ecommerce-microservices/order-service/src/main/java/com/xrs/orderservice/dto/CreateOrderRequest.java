package com.xrs.orderservice.dto;

import com.xrs.orderservice.domain.valueobject.Address;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Request DTO for creating a new order
 * 
 * @param userId User ID who is placing the order
 * @param items List of order items with product IDs and quantities
 * @param shippingAddress Shipping address for order delivery
 */
public record CreateOrderRequest(
        @NotNull(message = "User ID is required")
        Long userId,
        
        @NotEmpty(message = "Order must contain at least one item")
        List<OrderItemRequest> items,
        
        @NotNull(message = "Shipping address is required")
        Address shippingAddress
) {
    /**
     * Represents an item in the order
     * 
     * @param productId Product ID
     * @param quantity Quantity of the product
     * @param unitPrice Unit price of the product
     */
    public record OrderItemRequest(
            @NotNull(message = "Product ID is required")
            Long productId,
            
            @NotNull(message = "Quantity is required")
            Integer quantity,
            
            @NotNull(message = "Unit price is required")
            Double unitPrice
    ) {}
}
