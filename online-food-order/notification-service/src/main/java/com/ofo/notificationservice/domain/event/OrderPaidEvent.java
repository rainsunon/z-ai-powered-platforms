package com.ofo.notificationservice.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPaidEvent {
    private String eventId;
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private String currency;
    private String requestId;
    private LocalDateTime paidAt;
}

