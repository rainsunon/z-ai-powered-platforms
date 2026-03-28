package com.xrs.immo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.xrs.immo.enums.AssetStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssetHistoryDto {
    
    @NotNull(message = "Asset ID is required")
    private Long assetId;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Status is required")
    private AssetStatus status;
    
    private String note;
    
    private LocalDateTime timestamp;
}

