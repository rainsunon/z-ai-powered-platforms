package com.xrs.asset.request.service;
import com.xrs.assetmanagementsystem.entity.AssetRequest;
import com.xrs.assetmanagementsystem.enums.RequestStatus;
import com.xrs.assetmanagementsystem.enums.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface RequestService {

     ResponseDTO addRequest(RequestDTO requestDTO);
    Page<ResponseDTO> getRequests(RequestFilter filter, Pageable pageable);
    ResponseDTO approveRequest(Long id, ApproveRequestDTO dto);
    ResponseDTO rejectRequest(Long id, RejectRequestDTO dto);
    java.util.Map<String, Long> getRequestStats();
}

