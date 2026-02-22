package com.xrs.fooddelivery.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaptureResponse {
    private boolean success;
    private String captureId;
    private String message;
    private String errorCode;
}
