package com.xrs.orderservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Command to delete an order.
 * Implements CQRS pattern for write operations.
 */
public record DeleteOrderCommand(
    String commandId,
    Integer orderId
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "DeleteOrder";
    }

    @Override
    public void validate() {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
    }

    /**
     * Handler for DeleteOrderCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class DeleteOrderHandler implements CommandHandler<DeleteOrderCommand, Void> {
        
        private final OrderRepository orderRepository;
        
        @Override
        public Mono<Void> handle(DeleteOrderCommand command) {
            log.info("Handling DeleteOrderCommand: {}", command.commandId());
            
            // Find order
            Order order = orderRepository.findById(command.orderId())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + command.orderId()));
            
            // Delete order
            orderRepository.delete(order);
            
            log.info("Order deleted successfully: {}", command.orderId());
            
            return Mono.empty();
        }
    }
}
