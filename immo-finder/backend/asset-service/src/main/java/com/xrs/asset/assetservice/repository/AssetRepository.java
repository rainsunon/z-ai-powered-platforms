package com.xrs.asset.assetservice.repository;

import com.xrs.assetmanagementsystem.entity.Asset;
import com.xrs.assetmanagementsystem.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> , JpaSpecificationExecutor<Asset> {
    public Asset findByName(String name);
    boolean existsBySerialNumber(String serialNumber);
    Asset findBySerialNumber(String serialNumber);
    Optional<Asset> findByIdAndTypeIdAndCategoryId(Long assetId, Long typeId, Long categoryId);
    List<Asset> findByStatus(AssetStatus status);
    Asset findAssetById(Long id);
}
