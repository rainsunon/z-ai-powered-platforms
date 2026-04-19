package com.xrs.orderservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.orderservice.dto.order.CartDto;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.entity.OrderItem;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.service.OrderSagaOrchestrator;
import com.xrs.orderservice.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.List;

/**
 * Command to create a new order.
 * Implements CQRS pattern for write operations.
 */
public record CreateOrderCommand(
    String commandId,
    Long userId,
    List<OrderItemData> items,
    String shippingAddress,
    String orderDescription,
    BigDecimal orderFee
) implements Command {

    public record OrderItemData(
        Integer productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
    ) {}

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "CreateOrder";
    }

    @Override
    public void validate() {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be empty");
        }
        if (shippingAddress == null || shippingAddress.isBlank()) {
            throw new IllegalArgumentException("Shipping address cannot be blank");
        }
    }

    /**
     * Handler for CreateOrderCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class CreateOrderHandler implements CommandHandler<CreateOrderCommand, OrderDto> {
        
        private final OrderRepository orderRepository;
        private final OrderSagaOrchestrator sagaOrchestrator;
        
        @Override
        public Mono<OrderDto> handle(CreateOrderCommand command) {
            log.info("Handling CreateOrderCommand: {}", command.commandId());
            
            // Create order entity
            Order order = Order.builder()
                    .userId(command.userId())
                    .orderDescription(command.orderDescription())
                    .orderFee(command.orderFee())
                    .shippingAddress(command.shippingAddress())
                    .build();
            
            // Add order items
            for (OrderItemData itemData : command.items()) {
                OrderItem item = OrderItem.builder()
                        .productId(itemData.productId())
                        .productName(itemData.productName())
                        .quantity(itemData.quantity())
                        .unitPrice(itemData.unitPrice())
                        .lineTotal(itemData.lineTotal())
                        .order(order)
                        .build();
                order.addItem(item);
            }
            
            // Calculate total amount
            BigDecimal totalAmount = command.items().stream()
                    .map(OrderItemData::lineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotalAmount(totalAmount);
            
            // Save order
            Order savedOrder = orderRepository.save(order);
            
            // Start saga
            sagaOrchestrator.startSaga(savedOrder);
            
            log.info("Order created successfully: {}", savedOrder.getOrderId());
            
            // Return order DTO
            return Mono.just(OrderServiceImpl.OrderMappingHelper.map(savedOrder));
        }
    }
}
