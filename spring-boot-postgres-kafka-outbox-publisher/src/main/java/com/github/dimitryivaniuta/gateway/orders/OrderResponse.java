package com.github.dimitryivaniuta.gateway.orders;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * API response representation for an order.
 */
public record OrderResponse(
        UUID id,
        String customerEmail,
        BigDecimal totalAmount,
        String status,
        OffsetDateTime createdAt
) {
    /**
     * Maps a JPA entity to a response DTO.
     *
     * @param entity the order entity
     * @return response DTO
     */
    public static OrderResponse fromEntity(OrderEntity entity) {
        return new OrderResponse(
                entity.getId(),
                entity.getCustomerEmail(),
                entity.getTotalAmount(),
                entity.getStatus(),
                entity.getCreatedAt()
        );
    }
}
