package com.xrs.immo.presentation.rest;

import com.xrs.immo.domain.model.PropertyDocument;
import com.xrs.immo.domain.repository.PropertySearchRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Property search API")
public class SearchController {

    private final PropertySearchRepository repository;

    @GetMapping
    @Operation(summary = "Get all properties")
    public ResponseEntity<List<PropertyDocument>> getAllProperties() {
        Iterable<PropertyDocument> all = repository.findAll();
        List<PropertyDocument> list = StreamSupport.stream(all.spliterator(), false)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/type/{propertyType}")
    @Operation(summary = "Search properties by type")
    public ResponseEntity<List<PropertyDocument>> searchByType(
            @Parameter(description = "Property type (RENT or BUY)") @PathVariable String propertyType) {
        return ResponseEntity.ok(repository.findByPropertyType(propertyType));
    }

    @GetMapping("/city/{city}")
    @Operation(summary = "Search properties by city")
    public ResponseEntity<List<PropertyDocument>> searchByCity(
            @Parameter(description = "City name") @PathVariable String city) {
        return ResponseEntity.ok(repository.findByCity(city));
    }

    @GetMapping("/type/{propertyType}/city/{city}")
    @Operation(summary = "Search properties by type and city")
    public ResponseEntity<List<PropertyDocument>> searchByTypeAndCity(
            @Parameter(description = "Property type") @PathVariable String propertyType,
            @Parameter(description = "City name") @PathVariable String city) {
        return ResponseEntity.ok(repository.findByCityAndPropertyType(city, propertyType));
    }

    @GetMapping("/price-range")
    @Operation(summary = "Search properties by price range")
    public ResponseEntity<List<PropertyDocument>> searchByPriceRange(
            @Parameter(description = "Minimum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal maxPrice) {
        return ResponseEntity.ok(repository.findByPriceBetween(minPrice, maxPrice));
    }

    @GetMapping("/type/{propertyType}/price-range")
    @Operation(summary = "Search properties by type and price range")
    public ResponseEntity<List<PropertyDocument>> searchByTypeAndPriceRange(
            @Parameter(description = "Property type") @PathVariable String propertyType,
            @Parameter(description = "Minimum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal maxPrice) {
        return ResponseEntity.ok(repository.findByPropertyTypeAndPriceBetween(propertyType, minPrice, maxPrice));
    }

    @GetMapping("/city/{city}/price-range")
    @Operation(summary = "Search properties by city and price range")
    public ResponseEntity<List<PropertyDocument>> searchByCityAndPriceRange(
            @Parameter(description = "City name") @PathVariable String city,
            @Parameter(description = "Minimum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal maxPrice) {
        return ResponseEntity.ok(repository.findByCityAndPriceBetween(city, minPrice, maxPrice));
    }

    @GetMapping("/type/{propertyType}/city/{city}/price-range")
    @Operation(summary = "Search properties by type, city, and price range")
    public ResponseEntity<List<PropertyDocument>> searchByTypeCityAndPriceRange(
            @Parameter(description = "Property type") @PathVariable String propertyType,
            @Parameter(description = "City name") @PathVariable String city,
            @Parameter(description = "Minimum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam @NumberFormat(style = NumberFormat.Style.NUMBER) BigDecimal maxPrice) {
        return ResponseEntity.ok(repository.findByPropertyTypeAndCityAndPriceBetween(propertyType, city, minPrice, maxPrice));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available properties")
    public ResponseEntity<List<PropertyDocument>> getAvailableProperties() {
        return ResponseEntity.ok(repository.findByAvailableTrue());
    }

    @GetMapping("/available/type/{propertyType}")
    @Operation(summary = "Get available properties by type")
    public ResponseEntity<List<PropertyDocument>> getAvailablePropertiesByType(
            @Parameter(description = "Property type") @PathVariable String propertyType) {
        return ResponseEntity.ok(repository.findByAvailableTrueAndPropertyType(propertyType));
    }

    @GetMapping("/available/city/{city}")
    @Operation(summary = "Get available properties by city")
    public ResponseEntity<List<PropertyDocument>> getAvailablePropertiesByCity(
            @Parameter(description = "City name") @PathVariable String city) {
        return ResponseEntity.ok(repository.findByAvailableTrueAndCity(city));
    }
}
