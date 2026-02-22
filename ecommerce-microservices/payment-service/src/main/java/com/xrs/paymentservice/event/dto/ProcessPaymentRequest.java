package com.xrs.paymentservice.event.dto;

import java.time.LocalDateTime;

/**
 * Request to process payment for an order
 */
public record ProcessPaymentRequest(
        String eventId,
        Integer orderId,
        Long userId,
        Double amount,
        LocalDateTime timestamp
) {
}
