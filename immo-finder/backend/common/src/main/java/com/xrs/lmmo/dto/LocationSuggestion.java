package com.xrs.immo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationSuggestion {
    private String placeId;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private String formattedAddress;
    private List<String> types;
}
