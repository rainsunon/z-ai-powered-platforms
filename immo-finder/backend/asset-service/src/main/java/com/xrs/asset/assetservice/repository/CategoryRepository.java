package com.xrs.asset.assetservice.repository;
import com.xrs.assetmanagementsystem.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<AssetCategory, Long> {
    AssetCategory findByName(String name);
}

