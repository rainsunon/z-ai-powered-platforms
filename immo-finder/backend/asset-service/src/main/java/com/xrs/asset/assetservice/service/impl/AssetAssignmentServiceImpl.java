package com.xrs.asset.assetservice.service.impl;

import com.xrs.assetmanagementsystem.dto.AssetAssignmentRequest;
import com.xrs.assetmanagementsystem.dto.UserDTO;
import com.xrs.assetmanagementsystem.enums.AssetStatus;
import com.xrs.assetmanagementsystem.errors.ApiReturnCode;
import com.xrs.assetmanagementsystem.exception.BusinessException;
import com.xrs.assetmanagementsystem.mapper.AssignmentMapper;
import com.xrs.asset.assetservice.client.HistoryServiceClient;
import com.xrs.asset.assetservice.client.UserServiceClient;
import com.xrs.asset.assetservice.repository.AssetAssignmentRepository;
import com.xrs.asset.assetservice.repository.AssetRepository;
import com.xrs.asset.assetservice.service.AssetAssignmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Service
public class AssetAssignmentServiceImpl implements AssetAssignmentService {
    private static final Logger logger = LoggerFactory.getLogger(AssetAssignmentServiceImpl.class);
    
    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private AssetRepository assetRepository;
    @Autowired
    private AssetAssignmentRepository assetAssignmentRepository;
    @Autowired
    private HistoryServiceClient historyServiceClient;
    @Autowired
    private AssignmentMapper assignmentMapper;

    @Override
    public AssetAssignment assignAsset(AssetAssignmentRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND, "Asset not found"));
        
        // Call User Service to get user details
        UserDTO userDto;
        try {
            userDto = userServiceClient.getUserById(request.getUserId());
        } catch (Exception e) {
            // Catch all exceptions including InvalidUrlException, RestClientException, etc.
            logger.error("Failed to call User Service to get user details: {}", e.getMessage(), e);
            throw new BusinessException(ApiReturnCode.USER_NOT_EXISTS, "Failed to retrieve user information: " + e.getMessage());
        }
        
        if (userDto == null) {
            throw new BusinessException(ApiReturnCode.USER_NOT_EXISTS, "User not found");
        }
        
        // Convert UserDTO to User entity for local use
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        
        Long typeId = request.getTypeId();
        Long categoryId = request.getCategoryId();
        validateAssetAssignable(asset, categoryId, typeId);
        asset.setStatus(AssetStatus.ASSIGNED);
        assetRepository.save(asset);
        AssetAssignment assignment = assignmentMapper.toAssignAsset(request, asset, user);
        assetAssignmentRepository.save(assignment);
        
        // Create history via History Service (non-blocking - don't fail assignment if history service is unavailable)
        try {
            AssetHistory history = assignmentMapper.toCreateAssetHistory(asset, user, AssetStatus.ASSIGNED, request.getNote() != null ? request.getNote() : "Asset assigned to " + user.getUsername());
            AssetHistory createdHistory = historyServiceClient.createHistory(history);
            if (createdHistory != null) {
                logger.info("History entry created successfully for asset assignment: assetId={}, userId={}, status={}", 
                           asset.getId(), user.getId(), AssetStatus.ASSIGNED);
            } else {
                logger.warn("History entry creation returned null for asset assignment: assetId={}, userId={}", 
                           asset.getId(), user.getId());
            }
        } catch (Throwable e) {
            // Catch all exceptions including URI parsing errors, network errors, etc.
            logger.error("Failed to create history entry for asset assignment. Assignment succeeded but history was not recorded. Error: {}", e.getMessage(), e);
        }
        
        return assignment;
    }
    private void validateAssetAssignable(Asset asset,Long categoryId ,Long typeId) {
        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new BusinessException(ApiReturnCode.ASSET_ALREADY_EXISTS, "Asset is not available");
        }
        boolean exists = assetRepository
                .findByIdAndTypeIdAndCategoryId(asset.getId(), typeId, categoryId)
                .isPresent();

        if (!exists) {
            throw new BusinessException(ApiReturnCode.ASSET_NOT_FOUND,
                    "Asset does not match the selected category and type");
        }    }

    @Override
    public void unassignAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND, "Asset not found"));
        
        if (asset.getStatus() != AssetStatus.ASSIGNED) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Asset is not assigned");
        }
        
        // Find active assignment
        AssetAssignment assignment = assetAssignmentRepository
                .findByAssetIdAndStatus(assetId, com.xrs.assetmanagementsystem.enums.AssignmentStatus.ACTIVE)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "No active assignment found"));
        
        // Update asset status
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);
        
        // Update assignment status to CLOSED
        assignment.setStatus(com.xrs.assetmanagementsystem.enums.AssignmentStatus.CLOSED);
        assetAssignmentRepository.save(assignment);
        
        // Create history entry (non-blocking - don't fail unassignment if history service is unavailable)
        try {
            User user = assignment.getAssignedTo();
            AssetHistory history = assignmentMapper.toCreateAssetHistory(asset, user, AssetStatus.AVAILABLE, "Asset unassigned from " + user.getUsername());
            AssetHistory createdHistory = historyServiceClient.createHistory(history);
            if (createdHistory != null) {
                logger.info("History entry created successfully for asset unassignment: assetId={}, userId={}, status={}", 
                           asset.getId(), user.getId(), AssetStatus.AVAILABLE);
            } else {
                logger.warn("History entry creation returned null for asset unassignment: assetId={}, userId={}", 
                           asset.getId(), user.getId());
            }
        } catch (Throwable e) {
            // Catch all exceptions including URI parsing errors, network errors, etc.
            logger.error("Failed to create history entry for asset unassignment. Unassignment succeeded but history was not recorded. Error: {}", e.getMessage(), e);
        }
    }
}


