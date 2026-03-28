package com.xrs.immo.dto.requestAsset;

import lombok.Getter;
import lombok.Setter;
import com.xrs.immo.enums.RequestStatus;
import com.xrs.immo.enums.RequestType;

@Setter
@Getter
public class RequestFilter {
    private String status;
    private RequestType type;
    private Long departmentId;
    private String search;
}
