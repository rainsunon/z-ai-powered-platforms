package com.xrs.immo.application.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.immo.dto.LocationDetail;
import com.xrs.immo.dto.LocationSuggestion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class LocationSearchService {

    private final RestTemplate restTemplate;
    private final String googleMapsApiKey;
    private final ObjectMapper objectMapper;

    public LocationSearchService(RestTemplate restTemplate, 
                                @Value("${google.maps.api.key}") String googleMapsApiKey) {
        this.restTemplate = restTemplate;
        this.googleMapsApiKey = googleMapsApiKey;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Search for locations using Google Places API autocomplete
     * 
     * @param query The search query
     * @param language The language code (optional, defaults to 'en')
     * @return List of location suggestions with coordinates
     */
    public List<LocationSuggestion> searchLocations(String query, String language) {
        List<LocationSuggestion> suggestions = new ArrayList<>();

        if (query == null || query.trim().isEmpty() || query.length() < 3) {
            log.debug("Query is too short or empty: {}", query);
            return suggestions;
        }

        try {
            String lang = language != null ? language : "en";
            String url = String.format(
                "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&language=%s&components=country:CA&key=%s",
                java.net.URLEncoder.encode(query, "UTF-8"),
                lang,
                googleMapsApiKey
            );

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            if (root.has("predictions") && root.get("predictions").isArray()) {
                JsonNode predictions = root.get("predictions");
                log.info("Found {} predictions for query: {}", predictions.size(), query);
                
                for (JsonNode prediction : predictions) {
                    try {
                        String placeId = prediction.get("place_id").asText();
                        String description = prediction.get("description").asText();
                        
                        // Get place details for coordinates
                        LocationDetail placeDetails = getPlaceDetails(placeId);
                        
                        if (placeDetails != null) {
                            LocationSuggestion suggestion = LocationSuggestion.builder()
                                    .placeId(placeId)
                                    .description(description)
                                    .address(placeDetails.getAddress())
                                    .latitude(placeDetails.getLatitude())
                                    .longitude(placeDetails.getLongitude())
                                    .formattedAddress(placeDetails.getAddress())
                                    .types(placeDetails.getTypes())
                                    .build();
                            
                            suggestions.add(suggestion);
                        }
                    } catch (Exception e) {
                        log.error("Error processing prediction: {}", prediction, e);
                        // Continue with next prediction even if one fails
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error searching locations for query: {}", query, e);
        }

        log.info("Returning {} suggestions for query: {}", suggestions.size(), query);
        return suggestions;
    }

    /**
     * Get place details by place ID
     * 
     * @param placeId The Google Place ID
     * @return Location details
     */
    public LocationDetail getPlaceDetails(String placeId) {
        if (placeId == null || placeId.trim().isEmpty()) {
            log.warn("PlaceId is null or empty");
            return null;
        }

        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=geometry,formatted_address,name,types&key=%s",
                java.net.URLEncoder.encode(placeId, "UTF-8"),
                googleMapsApiKey
            );

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            if (root.has("result")) {
                JsonNode result = root.get("result");
                JsonNode geometry = result.get("geometry");
                JsonNode location = geometry.get("location");
                
                LocationDetail detail = LocationDetail.builder()
                        .placeId(placeId)
                        .address(result.has("formatted_address") ? result.get("formatted_address").asText() : "")
                        .latitude(location.get("lat").asDouble())
                        .longitude(location.get("lng").asDouble())
                        .name(result.has("name") ? result.get("name").asText() : "")
                        .types(result.has("types") && result.get("types").isArray() ? 
                                extractTypes(result.get("types")) : List.of())
                        .build();
                
                log.info("Retrieved place details for placeId: {}", placeId);
                return detail;
            }
        } catch (Exception e) {
            log.error("Error getting place details for placeId: {}", placeId, e);
            throw new RuntimeException("Failed to get place details", e);
        }

        return null;
    }

    /**
     * Reverse geocode - get address from coordinates
     * 
     * @param latitude Latitude
     * @param longitude Longitude
     * @return Formatted address
     */
    public String reverseGeocode(double latitude, double longitude) {
        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&key=%s",
                latitude,
                longitude,
                googleMapsApiKey
            );

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            if (root.has("results") && root.get("results").isArray() && root.get("results").size() > 0) {
                String formattedAddress = root.get("results").get(0).get("formatted_address").asText();
                log.info("Reverse geocoded coordinates ({}, {}) to: {}", latitude, longitude, formattedAddress);
                return formattedAddress;
            }
        } catch (Exception e) {
            log.error("Error reverse geocoding coordinates: {}, {}", latitude, longitude, e);
            return null;
        }

        return null;
    }

    /**
     * Extract types from JSON node
     */
    private List<String> extractTypes(JsonNode typesNode) {
        List<String> types = new ArrayList<>();
        if (typesNode.isArray()) {
            for (JsonNode type : typesNode) {
                types.add(type.asText());
            }
        }
        return types;
    }
}
