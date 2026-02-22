package com.xrs.bffservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class InventoryServiceFallback implements InventoryServiceClient {
    
    @Override
    public Mono<Object> getInventoryByProductId(Integer productId) {
        log.error("Inventory service is unavailable - cannot fetch inventory for product: {}", productId);
        return Mono.empty();
    }
    
    @Override
    public Mono<Boolean> checkAvailability(Integer productId) {
        log.error("Inventory service is unavailable - assuming product {} is not available", productId);
        return Mono.just(false);
    }
}
