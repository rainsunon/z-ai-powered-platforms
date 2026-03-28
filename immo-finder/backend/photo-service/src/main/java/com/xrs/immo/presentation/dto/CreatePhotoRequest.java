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
public class CreatePhotoRequest {

    @NotBlank(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "URL is required")
    private String url;

    @Size(max = 255, message = "Alt text must not exceed 255 characters")
    private String altText;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    private Integer displayOrder;

    private Boolean isPrimary;
}
