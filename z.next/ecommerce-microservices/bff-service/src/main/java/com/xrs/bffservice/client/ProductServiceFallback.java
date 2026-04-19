package com.xrs.bffservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class ProductServiceFallback implements ProductServiceClient {
    
    @Override
    public Flux<Object> findAllProducts() {
        log.error("Product service is unavailable - returning empty list");
        return Flux.empty();
    }
    
    @Override
    public Mono<Object> findProductById(Integer productId) {
        log.error("Product service is unavailable - cannot fetch product: {}", productId);
        return Mono.empty();
    }
    
    @Override
    public Flux<Object> searchProducts(String keyword) {
        log.error("Product service is unavailable - cannot search products");
        return Flux.empty();
    }
    
    @Override
    public Flux<Object> findAllCategories() {
        log.error("Product service is unavailable - returning empty categories");
        return Flux.empty();
    }
    
    @Override
    public Mono<Object> findCategoryById(Integer categoryId) {
        log.error("Product service is unavailable - cannot fetch category: {}", categoryId);
        return Mono.empty();
    }
    
    @Override
    public Flux<Object> findProductsByCategoryId(Integer categoryId) {
        log.error("Product service is unavailable - cannot fetch products for category: {}", categoryId);
        return Flux.empty();
    }
}
