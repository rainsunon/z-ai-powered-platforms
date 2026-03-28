package com.xrs.immo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.xrs.immo.entity.AssetCategory;
import com.xrs.immo.entity.AssetType;
import com.xrs.immo.enums.AssignmentStatus;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AssetAssignmentRequest {
    @NotNull
    private Long assetId;
    @NotNull
    private Long userId;
    private String note;
    @NotNull
    private Long typeId;
    @NotNull
    private Long categoryId;

}
