package com.xrs.immo.dto;

import jdk.jfr.Category;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.xrs.immo.entity.AssetCategory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListAssetDTO {
    private Long id;
    private String serialNumber;
    private String name;
    private String type;  // Keep for backward compatibility
    private String typeName;  // Added to match frontend
    private AssetCategory category;  // Keep for backward compatibility
    private String categoryName;  // Added to match frontend
    private String brand;
    private String status;
    private String location;  // Added to match frontend
    private String assignedTo;  // Changed from assignedUser to match frontend
    private String department;
}