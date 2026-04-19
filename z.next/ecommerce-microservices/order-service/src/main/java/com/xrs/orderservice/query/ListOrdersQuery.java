package com.xrs.orderservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Query to list orders with pagination and sorting.
 * Implements CQRS pattern for read operations.
 */
public record ListOrdersQuery(
    String queryId,
    int page,
    int size,
    Long userId,
    String status,
    String sortBy,
    String sortOrder
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "ListOrders";
    }

    @Override
    public void validate() {
        if (page < 0) {
            throw new IllegalArgumentException("Page cannot be negative");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Size must be positive");
        }
    }

    /**
     * Handler for ListOrdersQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ListOrdersHandler implements QueryHandler<ListOrdersQuery, List<OrderDto>> {
        
        private final OrderRepository orderRepository;
        
        @Override
        public Mono<List<OrderDto>> handle(ListOrdersQuery query) {
            log.info("Handling ListOrdersQuery: {}", query.queryId());
            
            // Create pageable
            Sort sort = Sort.by(Sort.Direction.fromString(query.sortOrder()), query.sortBy());
            Pageable pageable = PageRequest.of(query.page(), query.size(), sort);
            
            // Find orders
            Page<Order> orders;
            if (query.userId() != null && query.status() != null) {
                orders = orderRepository.findByUserIdAndOrderStatus(query.userId(), query.status(), pageable);
            } else if (query.userId() != null) {
                orders = orderRepository.findByUserId(query.userId(), pageable);
            } else if (query.status() != null) {
                orders = orderRepository.findByOrderStatus(query.status(), pageable);
            } else {
                orders = orderRepository.findAll(pageable);
            }
            
            log.info("Found {} orders", orders.getTotalElements());
            
            // Return order DTOs
            List<OrderDto> orderDtos = orders.stream()
                    .map(OrderServiceImpl.OrderMappingHelper::map)
                    .toList();
            
            return Mono.just(orderDtos);
        }
    }
}
