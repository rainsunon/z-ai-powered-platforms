package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryEvent {
    private String orderId;
    private String status; // e.g., "INVENTORY_RESERVED", "INVENTORY_FAILED"
    private String reason; // Reason for failure, if any
}
