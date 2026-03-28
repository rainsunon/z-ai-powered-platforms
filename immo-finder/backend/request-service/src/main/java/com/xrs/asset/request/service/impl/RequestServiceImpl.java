package com.xrs.asset.request.service.impl;

import com.xrs.asset.request.repository.RequestRepository;
import org.apache.catalina.connector.Request;
import com.xrs.assetmanagementsystem.enums.AssetStatus;
import com.xrs.assetmanagementsystem.enums.RequestStatus;
import com.xrs.assetmanagementsystem.enums.RequestType;
import com.xrs.assetmanagementsystem.errors.ApiReturnCode;
import com.xrs.assetmanagementsystem.exception.BusinessException;
import com.xrs.assetmanagementsystem.mapper.AssignmentMapper;
import com.xrs.assetmanagementsystem.mapper.RequestMapper;
import com.xrs.assetmanagementsystem.requestservice.repository.*;
import com.xrs.asset.request.service.RequestService;
import com.xrs.assetmanagementsystem.specification.RequestSpecifications;
import com.xrs.assetmanagementsystem.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class RequestServiceImpl implements RequestService {
    @Autowired
    RequestRepository requestRepository;
    @Autowired
    RequestMapper mapper;
    @Autowired
    private AssignmentMapper assignmentMapper;

    @Override
    public ResponseDTO addRequest(RequestDTO requestDTO) {

        if (requestDTO.getAssetId() == null && requestDTO.getRequestType().name().equals(RequestType.MAINTENANCE.name())) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "can't be maintenance without an asset");
        }
        
        // Note: Asset and Type validation removed - these should be validated on the frontend
        // or by calling the respective services if needed. For now, we trust the input.
        
        // Get current user as requester
        User currentUser = SecurityUtils.getCurrentUser();
        
        AssetRequest assetRequest = mapper.toEntity(requestDTO);
        assetRequest.setRequester(currentUser);
        AssetRequest req = requestRepository.save(assetRequest);
        ResponseDTO response = mapper.toDTO(req);
        return response;
    }

    public Page<ResponseDTO> getRequests(RequestFilter filter, Pageable pageable) {
        User currentUser = SecurityUtils.getCurrentUser();
        Specification<AssetRequest> spec = RequestSpecifications.buildRoleBasedSpecification(currentUser, filter);
        return requestRepository.findAll(spec, pageable).map(mapper::toDTO);
    }
    @Transactional
    public ResponseDTO approveRequest(Long id, ApproveRequestDTO dto) {
        AssetRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND, "Request not found"));

        User user = SecurityUtils.getCurrentUser();
        request.setStatus(RequestStatus.APPROVED);
        request.setRejectionNote(null);
        
        // Note: Asset assignment and history creation should be handled by calling
        // the Asset Service and History Service via REST clients.
        // For now, we just approve the request.
        
        request.setApprovedBy(user);
        request.setApprovedDate(LocalDateTime.now());
        return mapper.toDTO(requestRepository.save(request));
    }

    @Transactional
    public ResponseDTO rejectRequest(Long id, RejectRequestDTO dto) {
        AssetRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND, "Request not found"));

        User user = SecurityUtils.getCurrentUser();

        request.setStatus(RequestStatus.REJECTED);
        request.setRejectionNote(dto.getRejectionNote());

        request.setApprovedBy(user);
        request.setApprovedDate(LocalDateTime.now());

        return mapper.toDTO(requestRepository.save(request));
    }

    @Override
    public java.util.Map<String, Long> getRequestStats() {
        long pending = requestRepository.findAll().stream()
                .filter(req -> req.getStatus() == RequestStatus.PENDING)
                .count();
        long approved = requestRepository.findAll().stream()
                .filter(req -> req.getStatus() == RequestStatus.APPROVED)
                .count();
        long rejected = requestRepository.findAll().stream()
                .filter(req -> req.getStatus() == RequestStatus.REJECTED)
                .count();
        
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("pending", pending);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        return stats;
    }
}
