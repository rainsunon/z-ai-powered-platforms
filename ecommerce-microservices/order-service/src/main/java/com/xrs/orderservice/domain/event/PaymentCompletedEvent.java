package com.xrs.orderservice.domain.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xrs.orderservice.constrant.AppConstant;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Domain event consumed from payment-service
 * Indicates that payment has been successfully processed for the order
 */
public record PaymentCompletedEvent(
    String eventId,
    Integer orderId,
    Integer paymentId,
    Double amount,
    String paymentMethod,
    String transactionId,
    
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = JsonFormat.Shape.STRING)
    LocalDateTime timestamp
) implements Serializable {
}
