package com.xrs.paymentservice.event.dto;

/**
 * Request to refund a payment (compensation)
 */
public record RefundPaymentRequest(
        String eventId,
        Integer orderId,
        Integer paymentId,
        String reason
) {
}
