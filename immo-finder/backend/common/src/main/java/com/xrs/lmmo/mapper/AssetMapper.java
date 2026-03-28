package com.xrs.asset.mapper;

import com.xrs.asset.dto.AssetDetailsDto;
import com.xrs.asset.dto.AssetDto;
import com.xrs.asset.dto.AssetRequestDto;
import com.xrs.asset.dto.UpdateAssetDto;
import com.xrs.asset.entity.*;
import com.xrs.asset.enums.AssignmentStatus;
import com.xrs.asset.enums.RequestStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class AssetMapper {
    public static AssetDto toDto(Asset asset) {
        if (asset == null) {
            return null;
        }

        AssetDto assetDto = new AssetDto();
        assetDto.setAssetId(asset.getId());
        assetDto.setAssetName(asset.getName());
        assetDto.setImagePath(asset.getImagePath());
        assetDto.setLocation(asset.getLocation());
        assetDto.setSerialNumber(asset.getSerialNumber());
        assetDto.setPurchaseDate(asset.getPurchaseDate().toString());
        assetDto.setWarrantyEndDate(asset.getWarrantyEndDate().toString());
        assetDto.setStatus(asset.getStatus());
        assetDto.setBrand(asset.getBrand());
        assetDto.setAssetDescription(asset.getDescription());
        assetDto.setCategory(asset.getCategory());
        assetDto.setType(asset.getType());

        return assetDto;
    }

    public Asset toEntity(AssetRequestDto assetDto, AssetCategory category, AssetType type, Location location) {
        if (assetDto == null) {
            return null;
        }

        Asset asset = new Asset();
        asset.setName(assetDto.getName());
        asset.setBrand(assetDto.getBrand());
        asset.setDescription(assetDto.getAssetDescription());

        asset.setCategory(category);
        asset.setType(type);
        asset.setLocation(location != null ? location.getLatitude() + "," + location.getLongitude() : null);

        asset.setSerialNumber(assetDto.getSerialNumber());
        asset.setPurchaseDate(assetDto.getPurchaseDate().toLocalDate());
        asset.setWarrantyEndDate(assetDto.getWarrantyEndDate().toLocalDate());
        asset.setStatus(assetDto.getStatus());
        asset.setImagePath(assetDto.getImagePath());
        return asset;
    }

    public Asset toEntity(UpdateAssetDto assetDto, AssetCategory category, AssetType type, Location location) {
        if (assetDto == null) {
            return null;
        }
        Asset asset = new Asset();
        asset.setName(assetDto.getName());
        asset.setBrand(assetDto.getBrand());
        asset.setDescription(assetDto.getAssetDescription());

        asset.setCategory(category);
        asset.setType(type);
        asset.setLocation(location != null ? location.getLatitude() + "," + location.getLongitude() : null);
        
        asset.setSerialNumber(assetDto.getSerialNumber());
        asset.setPurchaseDate(assetDto.getPurchaseDate().toLocalDate());
        asset.setWarrantyEndDate(assetDto.getWarrantyEndDate().toLocalDate());
        asset.setImagePath(assetDto.getImagePath());
        return asset;
    }

    public static List<AssetDto> toDtoList(List<Asset> assetsList) {
        if (assetsList == null) {
            return Collections.emptyList();
        }

        List<AssetDto> dtoList = new ArrayList<>();
        for (Asset asset : assetsList) {
            dtoList.add(toDto(asset));
        }
        return dtoList;
    }

    public AssetDetailsDto toDetailsDto(Asset asset) {
        AssetDetailsDto dto = new AssetDetailsDto();
        dto.setAssetId(asset.getId());
        dto.setAssetName(asset.getName());
        dto.setBrand(asset.getBrand());
        dto.setAssetDescription(asset.getDescription());
        dto.setCategoryId(asset.getCategory().getId());
        dto.setCategoryName(asset.getCategory().getName());
        dto.setTypeId(asset.getType().getId());
        dto.setTypeName(asset.getType().getName());
        dto.setLocation(asset.getLocation());
        dto.setSerialNumber(asset.getSerialNumber());
        dto.setPurchaseDate(asset.getPurchaseDate().toString());
        dto.setWarrantyEndDate(asset.getWarrantyEndDate().toString());
        dto.setStatus(asset.getStatus());
        dto.setImagePath(asset.getImagePath());

        // Only return assigned user info if there's an ACTIVE assignment
        if (asset.getAssignments() != null && !asset.getAssignments().isEmpty()) {
            var activeAssignment = asset.getAssignments().stream()
                    .filter(assignment -> assignment.getStatus() == AssignmentStatus.ACTIVE)
                    .findFirst()
                    .orElse(null);
            
            if (activeAssignment != null) {
                User assignedUser = activeAssignment.getAssignedTo();
                dto.setAssignedToId(assignedUser.getId());
                dto.setAssignedToName(assignedUser.getUsername());
                dto.setAssignedToEmail(assignedUser.getEmail());
                dto.setAssignmentDate(activeAssignment.getAssignmentDate() != null ? 
                    activeAssignment.getAssignmentDate().toString() : null);
            }
        }

        return dto;
    }

}
