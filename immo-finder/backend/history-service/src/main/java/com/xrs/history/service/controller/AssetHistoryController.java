package com.xrs.history.service.controller;

import jakarta.validation.Valid;
import com.xrs.assetmanagementsystem.dto.CreateAssetHistoryDto;
import com.xrs.assetmanagementsystem.dto.ListAssetHistoryResponseDto;
import com.xrs.assetmanagementsystem.entity.AssetHistory;
import com.xrs.history.service.service.AssetHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/history")
public class AssetHistoryController {

    @Autowired
    private AssetHistoryService assetHistoryService;

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<Page<ListAssetHistoryResponseDto>> getAssetHistoryByAssetId(
            @PathVariable Long assetId,
            Pageable pageable
    ) {
        Page<ListAssetHistoryResponseDto> historyPage = assetHistoryService.getHistoryByAssetId(assetId, pageable);
        return ResponseEntity.ok(historyPage);
    }

    @PostMapping
    public ResponseEntity<AssetHistory> createHistory(@Valid @RequestBody CreateAssetHistoryDto dto) {
        AssetHistory savedHistory = assetHistoryService.createHistory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHistory);
    }
}

