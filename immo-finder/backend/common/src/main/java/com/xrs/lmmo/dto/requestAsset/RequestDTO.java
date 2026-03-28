package com.xrs.immo.dto.requestAsset;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.xrs.immo.enums.RequestType;


@Setter
@Getter
public class RequestDTO {

    private Long assetId;

    @NotNull(message = "asset type id cannot be empty")
    private Long assetTypeId;

    @NotNull(message = "requester id cannot be empty")
    private Long requesterId;

    @NotNull(message = "request type cannot be empty")
    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    private String note;
}