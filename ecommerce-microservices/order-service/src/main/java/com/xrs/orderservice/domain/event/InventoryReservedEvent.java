package com.xrs.orderservice.domain.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xrs.orderservice.constrant.AppConstant;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Domain event consumed from inventory-service
 * Indicates that inventory has been successfully reserved for the order
 */
public record InventoryReservedEvent(
    String eventId,
    Integer orderId,
    Integer productId,
    Integer quantity,
    String reservationId,
    
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = JsonFormat.Shape.STRING)
    LocalDateTime timestamp
) implements Serializable {
}
