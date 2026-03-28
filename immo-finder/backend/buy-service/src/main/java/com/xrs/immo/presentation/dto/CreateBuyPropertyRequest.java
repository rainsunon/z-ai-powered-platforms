package com.xrs.immo.presentation.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBuyPropertyRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[A-Za-z0-9\\s-]{3,10}$", message = "Invalid postal code format")
    private String postalCode;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999999999.99", message = "Price must not exceed 999,999,999.99")
    private BigDecimal price;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "1.0", message = "Area must be at least 1.0")
    @DecimalMax(value = "10000.0", message = "Area must not exceed 10,000.0")
    private BigDecimal area;

    @NotNull(message = "Number of rooms is required")
    @Min(value = 1, message = "Number of rooms must be at least 1")
    @Max(value = 20, message = "Number of rooms must not exceed 20")
    private Integer rooms;

    @NotNull(message = "Number of bedrooms is required")
    @Min(value = 0, message = "Number of bedrooms must be at least 0")
    @Max(value = 15, message = "Number of bedrooms must not exceed 15")
    private Integer bedrooms;

    @NotNull(message = "Number of bathrooms is required")
    @Min(value = 0, message = "Number of bathrooms must be at least 0")
    @Max(value = 10, message = "Number of bathrooms must not exceed 10")
    private Integer bathrooms;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    private String heatingType;

    private String energyRating;

    private String constructionYear;

    private String features;

    @Email(message = "Invalid email format")
    private String contactEmail;

    @Pattern(regexp = "^[+]?[0-9\\s-]{10,20}$", message = "Invalid phone number format")
    private String contactPhone;

    @NotBlank(message = "Created by is required")
    private String createdBy;
}
