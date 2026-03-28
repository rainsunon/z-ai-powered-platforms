package com.xrs.asset.request.repository;

import com.xrs.assetmanagementsystem.entity.AssetRequest;
import com.xrs.assetmanagementsystem.enums.RequestStatus;
import com.xrs.assetmanagementsystem.enums.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<AssetRequest, Long> , JpaSpecificationExecutor<AssetRequest> {
    Page<AssetRequest> findAllByRequesterIdIn(List<Long> requesterIds, Pageable pageable);
    Page<AssetRequest> findAllByRequesterId(Long requesterId, Pageable pageable);
    Page<AssetRequest> findAllByRequestType(RequestType requestType, Pageable pageable);
    Page<AssetRequest> findAllByStatusAndRequestType(RequestStatus status, RequestType requestType, Pageable pageable);

}
