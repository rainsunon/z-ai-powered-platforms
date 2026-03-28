package com.xrs.immo.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "buy_properties")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    @Column(nullable = false, length = 500)
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String city;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[A-Za-z0-9\\s-]{3,10}$", message = "Invalid postal code format")
    @Column(nullable = false, length = 10)
    private String postalCode;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999999999.99", message = "Price must not exceed 999,999,999.99")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "1.0", message = "Area must be at least 1.0")
    @DecimalMax(value = "10000.0", message = "Area must not exceed 10,000.0")
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal area;

    @NotNull(message = "Number of rooms is required")
    @Min(value = 1, message = "Number of rooms must be at least 1")
    @Max(value = 20, message = "Number of rooms must not exceed 20")
    @Column(nullable = false)
    private Integer rooms;

    @NotNull(message = "Number of bedrooms is required")
    @Min(value = 0, message = "Number of bedrooms must be at least 0")
    @Max(value = 15, message = "Number of bedrooms must not exceed 15")
    @Column(nullable = false)
    private Integer bedrooms;

    @NotNull(message = "Number of bathrooms is required")
    @Min(value = 0, message = "Number of bathrooms must be at least 0")
    @Max(value = 10, message = "Number of bathrooms must not exceed 10")
    @Column(nullable = false)
    private Integer bathrooms;

    @NotBlank(message = "Property type is required")
    @Column(nullable = false, length = 50)
    private String propertyType;

    @Column(length = 50)
    private String heatingType;

    @Column(length = 50)
    private String energyRating;

    @Column(length = 20)
    private String constructionYear;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(length = 500)
    private String contactEmail;

    @Column(length = 20)
    private String contactPhone;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(nullable = false, length = 100)
    private String createdBy;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
