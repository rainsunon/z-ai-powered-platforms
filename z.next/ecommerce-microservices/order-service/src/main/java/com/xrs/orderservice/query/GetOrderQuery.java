package com.xrs.orderservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Query to get an order by ID.
 * Implements CQRS pattern for read operations.
 */
public record GetOrderQuery(
    String queryId,
    Integer orderId
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "GetOrder";
    }

    @Override
    public void validate() {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
    }

    /**
     * Handler for GetOrderQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class GetOrderHandler implements QueryHandler<GetOrderQuery, OrderDto> {
        
        private final OrderRepository orderRepository;
        
        @Override
        public Mono<OrderDto> handle(GetOrderQuery query) {
            log.info("Handling GetOrderQuery: {}", query.queryId());
            
            // Find order
            Order order = orderRepository.findById(query.orderId())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found: " + query.orderId()));
            
            log.info("Order found: {}", order.getOrderId());
            
            // Return order DTO
            return Mono.just(OrderServiceImpl.OrderMappingHelper.map(order));
        }
    }
}
