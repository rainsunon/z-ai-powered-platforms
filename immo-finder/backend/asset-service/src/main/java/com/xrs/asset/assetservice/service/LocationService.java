package com.xrs.asset.assetservice.service;

import com.xrs.assetmanagementsystem.dto.LocationDto;
import com.xrs.assetmanagementsystem.entity.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocations();
    Location getLocationById(Long id);
    Location createLocation(LocationDto locationDto);
    Location updateLocation(Long id, LocationDto locationDto);
    void deleteLocation(Long id);
}


