package com.xrs.bffservice.service;

import com.xrs.bffservice.client.OrderServiceClient;
import com.xrs.bffservice.dto.OrderDetailDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderAggregationService {
    
    private final OrderServiceClient orderServiceClient;
    
    /**
     * Get order details with complete information
     */
    public Mono<OrderDetailDto> getOrderDetail(Integer orderId) {
        log.info("Fetching order details for orderId: {}", orderId);
        
        return orderServiceClient.findOrderById(orderId)
            .map(order -> {
                Map<String, Object> orderMap = (Map<String, Object>) order;
                return new OrderDetailDto(
                    (Integer) orderMap.get("orderId"),
                    LocalDateTime.now(),  // This should parse from the order
                    "PENDING",  // This should come from the order
                    (Double) orderMap.get("orderFee"),
                    null,  // User info
                    List.of(),  // Order items
                    null,  // Payment info
                    null   // Shipping info
                );
            })
            .doOnSuccess(detail -> log.info("Successfully fetched order details for: {}", orderId))
            .doOnError(error -> log.error("Error fetching order details for: {}", orderId, error));
    }
    
    /**
     * Get all orders
     */
    public Flux<Object> getAllOrders() {
        log.info("Fetching all orders");
        return orderServiceClient.findAllOrders()
            .doOnComplete(() -> log.info("Successfully fetched all orders"))
            .doOnError(error -> log.error("Error fetching all orders", error));
    }
}
