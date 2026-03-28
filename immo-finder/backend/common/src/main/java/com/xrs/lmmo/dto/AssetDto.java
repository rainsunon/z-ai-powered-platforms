package com.xrs.immo.dto;

import lombok.*;
import com.xrs.immo.entity.AssetCategory;
import com.xrs.immo.entity.AssetType;
import com.xrs.immo.enums.AssetStatus;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AssetDto {
    private Long assetId;
    private String assetName;
    private String brand;
    private String assetDescription;
    private AssetCategory category;
    private AssetType type;
    private String location;
    private String serialNumber;
    private String purchaseDate;
    private String warrantyEndDate;
    private AssetStatus status;
    private String imagePath;
}
