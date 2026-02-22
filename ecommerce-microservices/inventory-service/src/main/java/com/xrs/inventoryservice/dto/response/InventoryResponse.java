package com.xrs.inventoryservice.dto.response;

public record InventoryResponse(
    String productName,
    boolean isInStock
) {
}