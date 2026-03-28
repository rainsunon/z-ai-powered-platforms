package com.xrs.immo.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyViewEventRequest {

    @NotBlank(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    private String userId;

    private String sessionId;

    private String source;

    private String referrer;

    private String userAgent;

    private String ipAddress;

    private Integer durationSeconds;
}
