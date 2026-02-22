package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryCommand {
    private String orderId;
    private String productId;
    private int quantity;
    private String type; // e.g., "RESERVE_INVENTORY", "RELEASE_INVENTORY"
}
