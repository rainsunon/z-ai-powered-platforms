package com.xrs.paymentservice.event.dto;

import java.time.LocalDateTime;

/**
 * Event published when payment is successfully completed
 */
public record PaymentCompletedEvent(
        String eventId,
        Integer orderId,
        Integer paymentId,
        Double amount,
        String transactionId,
        LocalDateTime timestamp
) {
}
