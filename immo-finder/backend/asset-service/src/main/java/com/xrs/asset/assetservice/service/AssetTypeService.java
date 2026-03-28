package com.xrs.asset.assetservice.service;

import com.xrs.assetmanagementsystem.dto.TypeDto;
import com.xrs.assetmanagementsystem.entity.AssetType;

import java.util.List;

public interface AssetTypeService {
    List<AssetType> getAllTypes(Long categoryId);
    AssetType createType(TypeDto typeDto);
    AssetType updateType(Long id, TypeDto typeDto);
    void deleteType(Long id);
}
