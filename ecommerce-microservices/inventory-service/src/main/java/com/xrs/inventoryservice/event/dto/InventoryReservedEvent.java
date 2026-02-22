package com.xrs.inventoryservice.event.dto;

import java.time.LocalDateTime;

/**
 * Event published when inventory is successfully reserved
 */
public record InventoryReservedEvent(
        String eventId,
        Integer orderId,
        Integer productId,
        Integer quantity,
        String reservationId,
        LocalDateTime timestamp
) {
}
