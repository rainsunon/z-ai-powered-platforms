package com.xrs.orderservice.domain.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xrs.orderservice.constrant.AppConstant;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Domain event published when a new order is created
 * This triggers the order fulfillment saga
 */
public record OrderCreatedEvent(
    String eventId,
    Integer orderId,
    Long userId,
    List<OrderItemData> items,
    Double totalAmount,
    String shippingAddress,
    
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = JsonFormat.Shape.STRING)
    LocalDateTime timestamp
) implements Serializable {
    
    /**
     * Order item data embedded in the event
     */
    public record OrderItemData(
        Integer productId,
        String productName,
        Integer quantity,
        Double unitPrice,
        Double lineTotal
    ) implements Serializable {}
}
