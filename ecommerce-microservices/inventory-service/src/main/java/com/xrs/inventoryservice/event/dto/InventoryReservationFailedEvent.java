package com.xrs.inventoryservice.event.dto;

import java.time.LocalDateTime;

/**
 * Event published when inventory reservation fails
 */
public record InventoryReservationFailedEvent(
        String eventId,
        Integer orderId,
        Integer productId,
        String reason,
        LocalDateTime timestamp
) {
}
