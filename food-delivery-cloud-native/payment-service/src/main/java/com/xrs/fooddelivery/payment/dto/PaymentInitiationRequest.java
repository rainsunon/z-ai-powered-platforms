package com.xrs.fooddelivery.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentInitiationRequest {
    @NotBlank(message = "Payment ID is required")
    private String paymentId;

    @NotBlank(message = "Encrypted card data is required")
    private String encryptedCardData;

    @NotBlank(message = "Cardholder name is required")
    private String cardholderName;

    @NotBlank(message = "Expiry month is required")
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required")
    private String expiryYear;
}
