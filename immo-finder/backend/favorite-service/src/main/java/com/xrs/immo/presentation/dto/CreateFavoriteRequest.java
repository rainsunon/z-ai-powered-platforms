package com.xrs.immo.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFavoriteRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
