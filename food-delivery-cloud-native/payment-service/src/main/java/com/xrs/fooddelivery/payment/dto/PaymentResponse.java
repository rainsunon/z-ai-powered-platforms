package com.xrs.fooddelivery.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String paymentId;
    private Long customerId;
    private Long merchantId;
    private Long orderId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String authId;
    private String captureId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String failureReason;
    private List<PaymentItem> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentItem {
        private String itemId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
    }
}
