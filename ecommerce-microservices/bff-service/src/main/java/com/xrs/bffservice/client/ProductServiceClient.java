package com.xrs.bffservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@FeignClient(
    name = "PRODUCT-SERVICE",
    fallback = ProductServiceFallback.class,
    configuration = com.xrs.bffservice.config.FeignConfig.class
)
public interface ProductServiceClient {
    
    @GetMapping("/api/products")
    Flux<Object> findAllProducts();
    
    @GetMapping("/api/products/{productId}")
    Mono<Object> findProductById(@PathVariable("productId") Integer productId);
    
    @GetMapping("/api/products/search")
    Flux<Object> searchProducts(@RequestParam("keyword") String keyword);
    
    @GetMapping("/api/categories")
    Flux<Object> findAllCategories();
    
    @GetMapping("/api/categories/{categoryId}")
    Mono<Object> findCategoryById(@PathVariable("categoryId") Integer categoryId);
    
    @GetMapping("/api/categories/{categoryId}/products")
    Flux<Object> findProductsByCategoryId(@PathVariable("categoryId") Integer categoryId);
}
