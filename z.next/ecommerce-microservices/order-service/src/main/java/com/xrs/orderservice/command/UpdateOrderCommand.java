package com.xrs.orderservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Command to update an existing order.
 * Implements CQRS pattern for write operations.
 */
public record UpdateOrderCommand(
    String commandId,
    Integer orderId,
    String orderDescription,
    String shippingAddress
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "UpdateOrder";
    }

    @Override
    public void validate() {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
    }

    /**
     * Handler for UpdateOrderCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class UpdateOrderHandler implements CommandHandler<UpdateOrderCommand, OrderDto> {
        
        private final OrderRepository orderRepository;
        
        @Override
        public Mono<OrderDto> handle(UpdateOrderCommand command) {
            log.info("Handling UpdateOrderCommand: {}", command.commandId());
            
            // Find order
            Order order = orderRepository.findById(command.orderId())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + command.orderId()));
            
            // Update order
            if (command.orderDescription() != null) {
                order.setOrderDescription(command.orderDescription());
            }
            if (command.shippingAddress() != null) {
                order.setShippingAddress(command.shippingAddress());
            }
            
            // Save order
            Order updatedOrder = orderRepository.save(order);
            
            log.info("Order updated successfully: {}", updatedOrder.getOrderId());
            
            // Return order DTO
            return Mono.just(OrderServiceImpl.OrderMappingHelper.map(updatedOrder));
        }
    }
}
