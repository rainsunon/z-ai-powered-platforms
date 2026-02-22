package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCommand {
    private String orderId;
    private double amount;
    private String type; // e.g., "PROCESS_PAYMENT", "ROLLBACK_PAYMENT"
}
