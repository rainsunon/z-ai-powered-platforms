package com.xrs.asset.assetservice.repository;
import com.xrs.assetmanagementsystem.entity.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypeRepository extends JpaRepository<AssetType, Long> {
    public AssetType findByName(String name);
    // Use Category_Id to navigate through the ManyToOne relationship
    List<AssetType> findByCategory_Id(Long categoryId);
}

