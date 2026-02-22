package com.distributedtransactions.common.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingCommand {
    private String orderId;
    private String address;
    private String type; // e.g., "SHIP_ORDER", "ROLLBACK_SHIPPING"
}
