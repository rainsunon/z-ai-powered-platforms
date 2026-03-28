package com.xrs.asset.assetservice.service.impl;

import com.xrs.assetmanagementsystem.dto.LocationDto;
import com.xrs.assetmanagementsystem.entity.Location;
import com.xrs.asset.assetservice.repository.LocationRepository;
import com.xrs.asset.assetservice.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class LocationServiceImpl implements LocationService {
    
    private final LocationRepository locationRepository;

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Override
    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
    }

    @Override
    public Location createLocation(LocationDto locationDto) {
        if (locationRepository.findByName(locationDto.getName()) != null) {
            throw new RuntimeException("Location with name '" + locationDto.getName() + "' already exists");
        }
        
        Location location = new Location();
        location.setName(locationDto.getName());
        location.setAddress(locationDto.getAddress());
        location.setIsActive(locationDto.getIsActive() != null ? locationDto.getIsActive() : true);
        
        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Long id, LocationDto locationDto) {
        Location location = getLocationById(id);
        
        // Check if name is being changed and if new name already exists
        if (!location.getName().equals(locationDto.getName())) {
            Location existingLocation = locationRepository.findByName(locationDto.getName());
            if (existingLocation != null && !existingLocation.getId().equals(id)) {
                throw new RuntimeException("Location with name '" + locationDto.getName() + "' already exists");
            }
        }
        
        location.setName(locationDto.getName());
        location.setAddress(locationDto.getAddress());
        if (locationDto.getIsActive() != null) {
            location.setIsActive(locationDto.getIsActive());
        }
        
        return locationRepository.save(location);
    }

    @Override
    public void deleteLocation(Long id) {
        Location location = getLocationById(id);
        locationRepository.delete(location);
    }
}


