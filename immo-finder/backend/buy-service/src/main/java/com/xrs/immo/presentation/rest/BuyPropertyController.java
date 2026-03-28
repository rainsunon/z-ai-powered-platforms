package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.command.BuyPropertyCommandService;
import com.xrs.immo.application.query.BuyPropertyQueryService;
import com.xrs.immo.domain.model.BuyProperty;
import com.xrs.immo.presentation.dto.CreateBuyPropertyRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Buy Properties", description = "API for managing buy properties")
public class BuyPropertyController {

    private final BuyPropertyCommandService commandService;
    private final BuyPropertyQueryService queryService;

    @PostMapping
    @Operation(summary = "Create a new buy property")
    public ResponseEntity<BuyProperty> createProperty(@Valid @RequestBody CreateBuyPropertyRequest request) {
        BuyProperty property = mapToEntity(request);
        BuyProperty created = commandService.createProperty(property);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all buy properties")
    public ResponseEntity<List<BuyProperty>> getAllProperties() {
        return ResponseEntity.ok(queryService.getAllProperties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a buy property by ID")
    public ResponseEntity<BuyProperty> getPropertyById(
            @Parameter(description = "Property ID") @PathVariable UUID id) {
        BuyProperty property = queryService.getPropertyById(id);
        if (property == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(property);
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available buy properties")
    public ResponseEntity<List<BuyProperty>> getAvailableProperties() {
        return ResponseEntity.ok(queryService.getAvailableProperties());
    }

    @GetMapping("/verified")
    @Operation(summary = "Get all verified buy properties")
    public ResponseEntity<List<BuyProperty>> getVerifiedProperties() {
        return ResponseEntity.ok(queryService.getVerifiedProperties());
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Get buy properties by city")
    public ResponseEntity<List<BuyProperty>> getPropertiesByCity(
            @Parameter(description = "City name") @PathVariable String city) {
        return ResponseEntity.ok(queryService.getPropertiesByCity(city));
    }

    @GetMapping("/price-range")
    @Operation(summary = "Get buy properties by price range")
    public ResponseEntity<List<BuyProperty>> getPropertiesByPriceRange(
            @Parameter(description = "Minimum price") @RequestParam Double minPrice,
            @Parameter(description = "Maximum price") @RequestParam Double maxPrice) {
        return ResponseEntity.ok(queryService.getPropertiesByPriceRange(minPrice, maxPrice));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a buy property")
    public ResponseEntity<BuyProperty> updateProperty(
            @Parameter(description = "Property ID") @PathVariable UUID id,
            @Valid @RequestBody CreateBuyPropertyRequest request) {
        BuyProperty property = mapToEntity(request);
        property.setId(id);
        BuyProperty updated = commandService.updateProperty(property);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a buy property")
    public ResponseEntity<Void> deleteProperty(
            @Parameter(description = "Property ID") @PathVariable UUID id) {
        boolean deleted = commandService.deleteProperty(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    private BuyProperty mapToEntity(CreateBuyPropertyRequest request) {
        return BuyProperty.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .price(request.getPrice())
                .area(request.getArea())
                .rooms(request.getRooms())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .propertyType(request.getPropertyType())
                .heatingType(request.getHeatingType())
                .energyRating(request.getEnergyRating())
                .constructionYear(request.getConstructionYear())
                .features(request.getFeatures())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .createdBy(request.getCreatedBy())
                .available(true)
                .verified(false)
                .build();
    }
}
