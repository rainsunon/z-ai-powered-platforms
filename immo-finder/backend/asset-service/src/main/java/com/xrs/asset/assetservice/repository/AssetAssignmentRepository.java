package com.xrs.asset.assetservice.repository;

import com.xrs.assetmanagementsystem.entity.Asset;
import com.xrs.assetmanagementsystem.entity.User;
import com.xrs.assetmanagementsystem.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.xrs.assetmanagementsystem.entity.AssetAssignment;

public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long>, JpaSpecificationExecutor<AssetAssignment> {

    boolean existsByAssetAndAssignedToAndStatus(Asset asset, User user, AssignmentStatus assignmentStatus);

    boolean existsByAssetAndStatus(Asset asset, AssignmentStatus assignmentStatus);
    
    java.util.Optional<AssetAssignment> findByAssetIdAndStatus(Long assetId, AssignmentStatus status);
}

