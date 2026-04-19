package com.xrs.inventoryservice.event.dto;

/**
 * Request to release previously reserved inventory (compensation)
 */
public record ReleaseInventoryRequest(
        String eventId,
        Integer orderId,
        String reservationId
) {
}
