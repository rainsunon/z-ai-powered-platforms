package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.service.LocationSearchService;
import com.xrs.immo.dto.LocationDetail;
import com.xrs.immo.dto.LocationSuggestion;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
@Tag(name = "Location Search", description = "Google Maps location search API")
public class LocationSearchController {

    private final LocationSearchService locationSearchService;

    public LocationSearchController(LocationSearchService locationSearchService) {
        this.locationSearchService = locationSearchService;
    }

    /**
     * Search for locations using Google Places API autocomplete
     * 
     * @param query The search query
     * @param language The language code (optional, defaults to 'en')
     * @return List of location suggestions with coordinates
     */
    @GetMapping("/search")
    @Operation(summary = "Search for locations", description = "Autocomplete search for locations using Google Places API")
    public ResponseEntity<List<LocationSuggestion>> searchLocations(
            @Parameter(description = "Search query (minimum 3 characters)", required = true) 
            @RequestParam String query,
            @Parameter(description = "Language code (e.g., 'en', 'fr')") 
            @RequestParam(required = false, defaultValue = "en") String language) {
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<LocationSuggestion> suggestions = locationSearchService.searchLocations(query, language);
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Get place details by place ID
     * 
     * @param placeId The Google Place ID
     * @return Location details
     */
    @GetMapping("/places/{placeId}")
    @Operation(summary = "Get place details", description = "Get detailed information about a place by its Google Place ID")
    public ResponseEntity<LocationDetail> getPlaceDetails(
            @Parameter(description = "Google Place ID", required = true) 
            @PathVariable String placeId) {
        if (placeId == null || placeId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        LocationDetail detail = locationSearchService.getPlaceDetails(placeId);
        if (detail != null) {
            return ResponseEntity.ok(detail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Reverse geocode - get address from coordinates
     * 
     * @param latitude Latitude
     * @param longitude Longitude
     * @return Formatted address
     */
    @GetMapping("/reverse-geocode")
    @Operation(summary = "Reverse geocode", description = "Get address from latitude and longitude coordinates")
    public ResponseEntity<String> reverseGeocode(
            @Parameter(description = "Latitude", required = true) 
            @RequestParam Double latitude,
            @Parameter(description = "Longitude", required = true) 
            @RequestParam Double longitude) {
        
        if (latitude == null || longitude == null) {
            return ResponseEntity.badRequest().build();
        }

        String address = locationSearchService.reverseGeocode(latitude, longitude);
        if (address != null) {
            return ResponseEntity.ok(address);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
