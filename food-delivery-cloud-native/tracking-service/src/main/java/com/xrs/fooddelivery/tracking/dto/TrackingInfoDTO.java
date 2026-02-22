package com.xrs.fooddelivery.tracking.dto;

import com.xrs.fooddelivery.common.dto.DeliveryStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrackingInfoDTO {
    private Long orderId;
    private Long deliveryAgentId;
    private DeliveryStatus deliveryStatus;
    private String currentLocation;
    private LocalDateTime updatedAt;
}
