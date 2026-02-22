package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentEvent {
    private String orderId;
    private String status; // e.g., "PAYMENT_SUCCESS", "PAYMENT_FAILED"
    private String reason; // Reason for failure, if any
}
