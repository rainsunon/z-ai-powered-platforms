package com.xrs.paymentservice.event.dto;

import java.time.LocalDateTime;

/**
 * Event published when payment processing fails
 */
public record PaymentFailedEvent(
        String eventId,
        Integer orderId,
        String reason,
        LocalDateTime timestamp
) {
}
