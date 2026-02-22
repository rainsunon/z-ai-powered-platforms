package com.xrs.fooddelivery.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PaymentRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Merchant ID is required")
    private Long merchantId;

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    private String currency;

    private String description;

    @NotBlank(message = "Merchant webhook URL is required")
    private String merchantWebhookUrl;

    private List<PaymentItem> items;

    @Data
    public static class PaymentItem {
        private String itemId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
    }
}
