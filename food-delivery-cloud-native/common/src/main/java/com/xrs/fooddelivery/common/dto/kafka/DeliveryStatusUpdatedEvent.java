package com.xrs.fooddelivery.common.dto.kafka;

import com.xrs.fooddelivery.common.dto.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusUpdatedEvent {

    private Long orderId;

    private Long deliveryAgentId;

    private DeliveryStatus status;

    private LocalDateTime updatedAt;
}