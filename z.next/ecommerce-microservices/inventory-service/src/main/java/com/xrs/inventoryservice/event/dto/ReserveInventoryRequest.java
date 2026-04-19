package com.xrs.inventoryservice.event.dto;

import java.util.List;

/**
 * Request to reserve inventory for an order
 */
public record ReserveInventoryRequest(
        String eventId,
        Integer orderId,
        Long userId,
        List<OrderItemData> items
) {
    public record OrderItemData(
            Integer productId,
            String productName,
            Integer quantity,
            Double unitPrice,
            Double lineTotal
    ) {}
}
