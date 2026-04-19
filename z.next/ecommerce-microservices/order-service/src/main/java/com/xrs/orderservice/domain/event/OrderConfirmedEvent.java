package com.xrs.orderservice.domain.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xrs.orderservice.constrant.AppConstant;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Domain event published when order is confirmed (inventory reserved successfully)
 */
public record OrderConfirmedEvent(
    String eventId,
    Integer orderId,
    Long userId,
    
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = JsonFormat.Shape.STRING)
    LocalDateTime timestamp
) implements Serializable {
}
