package com.xrs.asset.mapper;

import com.xrs.asset.dto.requestAsset.RequestDTO;
import com.xrs.asset.dto.requestAsset.ResponseDTO;
import com.xrs.asset.entity.Asset;
import com.xrs.asset.entity.AssetRequest;
import com.xrs.asset.entity.AssetType;
import com.xrs.asset.entity.User;
import com.xrs.asset.enums.RequestStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RequestMapper {

    public AssetRequest toEntity(RequestDTO dto) {
        if (dto == null) {
            return null;
        }
        AssetRequest entity = new AssetRequest();
        User user = new User();
        user.setId(dto.getRequesterId());
        entity.setRequester(user);
        if(dto.getAssetId()!=null) {
            Asset asset = new Asset();
            asset.setId(dto.getAssetId());
            entity.setAsset(asset);
        }
        AssetType type = new AssetType();
        type.setId(dto.getAssetTypeId());
        entity.setAssetType(type);
        entity.setRequestDate(LocalDateTime.now());
        entity.setRequestType(dto.getRequestType());
        entity.setStatus(RequestStatus.PENDING);
        entity.setNote(dto.getNote());
        return entity;
    }
    public ResponseDTO toDTO(AssetRequest entity) {
        if (entity == null) {
            return null;
        }
        ResponseDTO dto = new ResponseDTO();
        if (entity.getAsset() != null) {
            dto.setAssetId(entity.getAsset().getId());
            dto.setAssetName(entity.getAsset().getName());
        }
        if (entity.getApprovedBy() != null) {
            dto.setApprovedBy(entity.getApprovedBy().getUsername());
            dto.setApprovedDate(entity.getApprovedDate());
        }
        dto.setId(entity.getId());
        dto.setRequestDate(entity.getRequestDate());
        dto.setStatus(entity.getStatus());
        dto.setRequestType(entity.getRequestType());
        dto.setNote(entity.getNote());
        dto.setRejectionNote(entity.getRejectionNote());
        dto.setRequester(entity.getRequester().getUsername());
        dto.setRequesterId(entity.getRequester().getId());
        if (entity.getAssetType() != null) {
            dto.setAssetTypeId(entity.getAssetType().getId());
            dto.setAssetTypeName(entity.getAssetType().getName());
            if (entity.getAssetType().getCategory() != null) {
                dto.setCategoryId(entity.getAssetType().getCategory().getId());
                dto.setCategoryName(entity.getAssetType().getCategory().getName());
            }
        }
        return dto;
    }

}