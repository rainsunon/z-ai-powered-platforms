package com.xrs.immo.application.query;

import com.xrs.immo.domain.model.BuyProperty;
import com.xrs.immo.domain.repository.BuyPropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuyPropertyQueryService {

    private final BuyPropertyRepository repository;

    public List<BuyProperty> getAllProperties() {
        return repository.findAll();
    }

    public BuyProperty getPropertyById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public List<BuyProperty> getAvailableProperties() {
        return repository.findByAvailableTrue();
    }

    public List<BuyProperty> getVerifiedProperties() {
        return repository.findByVerifiedTrue();
    }

    public List<BuyProperty> getPropertiesByCity(String city) {
        return repository.findByCityIgnoreCase(city);
    }

    public List<BuyProperty> getPropertiesByPriceRange(Double minPrice, Double maxPrice) {
        return repository.findByPriceBetween(minPrice, maxPrice);
    }
}
