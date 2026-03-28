package com.github.dimitryivaniuta.gateway.orders;

import com.github.dimitryivaniuta.gateway.outbox.OutboxWriter;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Business service that demonstrates writing business data + outbox record in the same DB transaction.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxWriter outboxWriter;
    private final Clock clock;

    /**
     * Creates an order and writes an outbox event in the same transaction.
     *
     * <p>If Kafka is down, the API call still succeeds because publishing happens asynchronously.</p>
     *
     * @param request validated create request
     * @return saved entity
     */
    @Transactional
    public OrderEntity createOrder(CreateOrderRequest request) {
        OffsetDateTime now = OffsetDateTime.now(clock);

        OrderEntity entity = OrderEntity.builder()
                .id(UUID.randomUUID())
                .customerEmail(request.customerEmail())
                .totalAmount(request.totalAmount())
                .status("CREATED")
                .createdAt(now)
                .build();

        orderRepository.save(entity);

        // Write domain event to outbox within the same transaction.
        outboxWriter.write(
                "OrderCreated",
                entity.getId().toString(),
                new OrderCreatedEvent(
                        entity.getId(),
                        entity.getCustomerEmail(),
                        entity.getTotalAmount(),
                        entity.getStatus(),
                        entity.getCreatedAt()
                )
        );

        return entity;
    }
}
