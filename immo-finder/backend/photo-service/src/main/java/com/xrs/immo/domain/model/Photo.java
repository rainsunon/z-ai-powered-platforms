package com.xrs.immo.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "photos", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"property_id", "url"}))
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Property ID is required")
    @Column(name = "property_id", nullable = false)
    private String propertyId;

    @NotBlank(message = "Property type is required")
    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType; // RENT, BUY

    @NotBlank(message = "URL is required")
    @Column(nullable = false)
    private String url;

    @Column(length = 255)
    private String altText;

    @Column(length = 50)
    private String category; // INTERIOR, EXTERIOR, FLOOR_PLAN, AMENITIES

    @Column(nullable = false)
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean isPrimary = false;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;
}
