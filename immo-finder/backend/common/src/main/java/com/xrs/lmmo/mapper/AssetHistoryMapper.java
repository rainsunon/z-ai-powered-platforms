package com.xrs.asset.mapper;

import com.xrs.asset.dto.ListAssetHistoryResponseDto;
import com.xrs.asset.entity.AssetHistory;
import org.springframework.stereotype.Component;

@Component
public class AssetHistoryMapper {

    public ListAssetHistoryResponseDto toDto(AssetHistory history) {
        ListAssetHistoryResponseDto dto = new ListAssetHistoryResponseDto();
        dto.setId(history.getId());
        dto.setAssetName(history.getAsset().getName());
        dto.setNote(history.getNote());
        dto.setTimestamp(history.getTimestamp());
        dto.setStatus(history.getStatus());
        if (history.getUser() != null) {
            dto.setAssignedTo(history.getUser().getUsername());
        } else {
            dto.setAssignedTo(null);
        }

        return dto;
    }
}