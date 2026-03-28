package com.xrs.asset.assetservice.repository;

import com.xrs.assetmanagementsystem.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Location findByName(String name);
    List<Location> findByIsActiveTrue();
}


