package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.BuyProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BuyPropertyRepository extends JpaRepository<BuyProperty, UUID> {

    List<BuyProperty> findByAvailableTrue();

    List<BuyProperty> findByVerifiedTrue();

    List<BuyProperty> findByCityIgnoreCase(String city);

    List<BuyProperty> findByPriceBetween(Double minPrice, Double maxPrice);
}
