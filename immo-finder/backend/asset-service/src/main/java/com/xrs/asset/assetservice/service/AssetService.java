package com.xrs.asset.assetservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AssetService {
    AssetDto addAsset(AssetRequestDto assetDto);
    AssetDto updateAsset(Long id, UpdateAssetDto assetDto);
    void deleteAsset(Long id);
    List<AssetDto> getAllAssets();
    List<AssetDto> getAvailableAsset(String type);
    Page<ListAssetDTO> getFilteredAsset(AssignedAssetFilterDTO filterDTO, Pageable pageable);
    AssetDetailsDto getAssetDetails(Long id);
}
