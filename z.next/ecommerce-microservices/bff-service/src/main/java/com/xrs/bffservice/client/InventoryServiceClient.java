package com.xrs.bffservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Mono;

@FeignClient(
    name = "INVENTORY-SERVICE",
    fallback = InventoryServiceFallback.class,
    configuration = com.xrs.bffservice.config.FeignConfig.class
)
public interface InventoryServiceClient {
    
    @GetMapping("/api/inventory/{productId}")
    Mono<Object> getInventoryByProductId(@PathVariable("productId") Integer productId);
    
    @GetMapping("/api/inventory/{productId}/availability")
    Mono<Boolean> checkAvailability(@PathVariable("productId") Integer productId);
}
