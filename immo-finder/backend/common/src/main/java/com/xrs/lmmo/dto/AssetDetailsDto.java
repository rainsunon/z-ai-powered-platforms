package com.xrs.immo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.xrs.immo.enums.AssetStatus;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AssetDetailsDto {
    private Long assetId;
    private String assetName;
    private String brand;
    private String assetDescription;
    private Long categoryId;
    private String categoryName;
    private Long typeId;
    private String typeName;
    private String location;
    private String serialNumber;
    private String purchaseDate;
    private String warrantyEndDate;
    private AssetStatus status;
    private String imagePath;
    private Long assignedToId;
    private String assignedToName;
    private String assignedToEmail;
    private String assignmentDate;

}