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
public class CaptureRequest {
    private String paymentId;
    private String authId;
    private BigDecimal amount;
    private String currency;
    private Long merchantId;
}
