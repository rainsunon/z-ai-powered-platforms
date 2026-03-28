package com.xrs.immo.dto.requestAsset;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.xrs.immo.entity.Asset;
import com.xrs.immo.enums.RequestStatus;
import com.xrs.immo.enums.RequestType;

import java.time.LocalDateTime;

@Setter
@Getter
public class ResponseDTO {
    @NotNull(message = "ID cannot be null")
    private Long id;
    private Long assetId;
    private String assetName;
    private Long assetTypeId;
    private String assetTypeName;
    private Long categoryId;
    private String categoryName;
    private String requester;
    private Long requesterId;
    private LocalDateTime requestDate;
    @NotNull(message = "Status cannot be null")
    private RequestStatus status;
    private RequestType requestType;
    private String approvedBy;
    private LocalDateTime approvedDate;
    private String note;
    private String rejectionNote;
}