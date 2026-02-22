package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCommand {
    private String orderId;
    private String customerId;
    private double amount;
    private String type; // e.g., "CREATE_ORDER", "CANCEL_ORDER"
}
