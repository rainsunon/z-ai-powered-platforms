package com.xrs.orderservice.domain.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xrs.orderservice.constrant.AppConstant;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Domain event published when order is cancelled
 * This can happen due to:
 * - User cancellation
 * - Inventory reservation failure
 * - Payment failure
 * - Shipment failure (with compensation)
 */
public record OrderCancelledEvent(
    String eventId,
    Integer orderId,
    Long userId,
    String reason,
    String cancelledBy,
    
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = JsonFormat.Shape.STRING)
    LocalDateTime timestamp
) implements Serializable {
}
