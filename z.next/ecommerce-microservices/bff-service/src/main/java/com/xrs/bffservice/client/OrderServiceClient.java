package com.xrs.bffservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@FeignClient(
    name = "ORDER-SERVICE",
    fallback = OrderServiceFallback.class,
    configuration = com.xrs.bffservice.config.FeignConfig.class
)
public interface OrderServiceClient {
    
    @GetMapping("/api/orders")
    Flux<Object> findAllOrders();
    
    @GetMapping("/api/orders/{orderId}")
    Mono<Object> findOrderById(@PathVariable("orderId") Integer orderId);
    
    @PostMapping("/api/orders")
    Mono<Object> createOrder(@RequestBody Object orderRequest);
    
    @GetMapping("/api/carts")
    Flux<Object> findAllCarts();
    
    @GetMapping("/api/carts/{cartId}")
    Mono<Object> findCartById(@PathVariable("cartId") Integer cartId);
}
