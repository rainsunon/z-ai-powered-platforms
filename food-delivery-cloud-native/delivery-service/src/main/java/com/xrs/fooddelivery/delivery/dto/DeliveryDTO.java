package com.xrs.fooddelivery.delivery.dto;

import com.xrs.fooddelivery.common.dto.DeliveryStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private Long deliveryAgentId;
    private DeliveryStatus deliveryStatus;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime updateAt;
}
