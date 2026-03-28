package com.xrs.history.service.service.impl;

import com.xrs.assetmanagementsystem.dto.CreateAssetHistoryDto;
import com.xrs.assetmanagementsystem.dto.ListAssetHistoryResponseDto;
import com.xrs.assetmanagementsystem.entity.Asset;
import com.xrs.assetmanagementsystem.entity.AssetHistory;
import com.xrs.assetmanagementsystem.entity.User;
import com.xrs.history.service.repository.AssetHistoryRepository;
import com.xrs.history.service.service.AssetHistoryService;
import com.xrs.assetmanagementsystem.mapper.AssetHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

@Service
public class AssetHistoryServiceImpl implements AssetHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(AssetHistoryServiceImpl.class);

    @Autowired
    private AssetHistoryRepository assetHistoryRepository;

    @Autowired
    private AssetHistoryMapper assetHistoryMapper;


    @Override
    public Page<ListAssetHistoryResponseDto> getHistoryByAssetId(Long assetId, Pageable pageable) {
        Page<AssetHistory> histories = assetHistoryRepository.findByAssetId(assetId, pageable);
        return histories.map(assetHistoryMapper::toDto);
    }

    @Override
    public AssetHistory createHistory(CreateAssetHistoryDto dto) {
        logger.info("Creating history entry: assetId={}, userId={}, status={}, note={}", 
                   dto.getAssetId(), dto.getUserId(), dto.getStatus(), dto.getNote());
        
        // Create proxy entities with only IDs set (for foreign key relationships)
        Asset asset = new Asset();
        asset.setId(dto.getAssetId());
        
        User user = new User();
        user.setId(dto.getUserId());
        
        AssetHistory history = new AssetHistory();
        history.setAsset(asset);
        history.setUser(user);
        history.setStatus(dto.getStatus());
        history.setNote(dto.getNote());
        history.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now());
        
        AssetHistory saved = assetHistoryRepository.save(history);
        logger.info("History entry created successfully: id={}, assetId={}, userId={}", 
                   saved.getId(), saved.getAsset().getId(), saved.getUser().getId());
        return saved;
    }
}

