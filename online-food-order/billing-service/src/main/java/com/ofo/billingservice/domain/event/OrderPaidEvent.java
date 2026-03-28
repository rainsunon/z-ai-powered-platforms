package com.ofo.billingservice.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Domain Event: Order Paid Event
 * Published by payment-service, consumed by billing-service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPaidEvent {
    private String eventId;
    private String orderId;
    private String userId;
    private String paymentId;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime paidAt;
    private String requestId; // For idempotency
}

