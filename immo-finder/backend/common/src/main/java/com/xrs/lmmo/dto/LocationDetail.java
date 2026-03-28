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
public class LocationDetail {
    private String placeId;
    private String address;
    private Double latitude;
    private Double longitude;
    private String name;
    private List<String> types;
}
