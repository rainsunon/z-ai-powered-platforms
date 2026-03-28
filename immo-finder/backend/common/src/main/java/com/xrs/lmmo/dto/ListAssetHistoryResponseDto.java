package com.xrs.immo.dto;

import lombok.Getter;
import lombok.Setter;
import com.xrs.immo.enums.AssetStatus;

import java.time.LocalDateTime;
@Setter
@Getter
public class ListAssetHistoryResponseDto {
    private Long id;
    private String assetName;
    private String assignedTo;
    private String note;
    private LocalDateTime timestamp;
    private AssetStatus status;
}