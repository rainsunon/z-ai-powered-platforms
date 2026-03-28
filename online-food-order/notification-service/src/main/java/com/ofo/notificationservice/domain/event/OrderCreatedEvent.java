package com.ofo.notificationservice.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreatedEvent {
    private String eventId;
    private String orderId;
    private String userId;
    private String restaurantId;
    private String requestId;
    private LocalDateTime createdAt;
}

