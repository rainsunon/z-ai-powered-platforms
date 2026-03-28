package com.xrs.asset.assetservice.service;

import com.xrs.assetmanagementsystem.dto.AssetAssignmentRequest;
import com.xrs.assetmanagementsystem.entity.AssetAssignment;
import com.xrs.assetmanagementsystem.entity.AssetCategory;
import com.xrs.assetmanagementsystem.entity.AssetType;
import com.xrs.assetmanagementsystem.errors.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface AssetAssignmentService {

    AssetAssignment assignAsset(AssetAssignmentRequest request);
    void unassignAsset(Long assetId);
}

