package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingEvent {
    private String orderId;
    private String status; // e.g., "ORDER_SHIPPED", "SHIPPING_FAILED"
    private String reason; // Reason for failure, if any
}
