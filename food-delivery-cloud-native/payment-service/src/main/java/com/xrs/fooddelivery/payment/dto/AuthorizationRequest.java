package com.xrs.fooddelivery.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationRequest {
    private String paymentId;
    private String encryptedCardData;
    private String cardholderName;
    private String expiryMonth;
    private String expiryYear;
    private BigDecimal amount;
    private String currency;
    private Long merchantId;
    private Long customerId;
    private String orderId;
}
