package com.xrs.history.service.service;

import com.xrs.assetmanagementsystem.dto.CreateAssetHistoryDto;
import com.xrs.assetmanagementsystem.dto.ListAssetHistoryResponseDto;
import com.xrs.assetmanagementsystem.entity.AssetHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AssetHistoryService {
    Page<ListAssetHistoryResponseDto> getHistoryByAssetId(Long assetId, Pageable pageable);
    AssetHistory createHistory(CreateAssetHistoryDto dto);
}

