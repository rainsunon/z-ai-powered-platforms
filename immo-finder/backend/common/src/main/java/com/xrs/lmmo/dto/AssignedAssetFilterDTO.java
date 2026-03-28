package com.xrs.immo.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AssignedAssetFilterDTO {
    private String assetName;
    private String status;
    private String type;
    private String category;
    private String brand;
    private String assignedUser;
    private String department;
    private int page = 0;
    private int size = 10;
    private String sortBy = "id";
    private boolean ascending = true;
    private boolean myAssetsFlag = false;
}
