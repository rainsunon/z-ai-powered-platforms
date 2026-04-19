package com.xrs.bffservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class OrderServiceFallback implements OrderServiceClient {
    
    @Override
    public Flux<Object> findAllOrders() {
        log.error("Order service is unavailable - returning empty orders");
        return Flux.empty();
    }
    
    @Override
    public Mono<Object> findOrderById(Integer orderId) {
        log.error("Order service is unavailable - cannot fetch order: {}", orderId);
        return Mono.empty();
    }
    
    @Override
    public Mono<Object> createOrder(Object orderRequest) {
        log.error("Order service is unavailable - cannot create order");
        return Mono.empty();
    }
    
    @Override
    public Flux<Object> findAllCarts() {
        log.error("Order service is unavailable - returning empty carts");
        return Flux.empty();
    }
    
    @Override
    public Mono<Object> findCartById(Integer cartId) {
        log.error("Order service is unavailable - cannot fetch cart: {}", cartId);
        return Mono.empty();
    }
}
