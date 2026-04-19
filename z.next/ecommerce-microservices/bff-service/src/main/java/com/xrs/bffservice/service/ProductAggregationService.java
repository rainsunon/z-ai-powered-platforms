package com.xrs.bffservice.service;

import com.xrs.bffservice.client.InventoryServiceClient;
import com.xrs.bffservice.client.ProductServiceClient;
import com.xrs.bffservice.client.RatingServiceClient;
import com.xrs.bffservice.dto.ProductDetailDto;
import com.xrs.bffservice.dto.ProductSummaryDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAggregationService {
    
    private final ProductServiceClient productServiceClient;
    private final InventoryServiceClient inventoryServiceClient;
    private final RatingServiceClient ratingServiceClient;
    
    /**
     * Get product details with inventory and rating information
     */
    public Mono<ProductDetailDto> getProductDetail(Integer productId) {
        log.info("Fetching product details for productId: {}", productId);
        
        Mono<Object> productMono = productServiceClient.findProductById(productId);
        Mono<Boolean> availabilityMono = inventoryServiceClient.checkAvailability(productId);
        Mono<Double> ratingMono = ratingServiceClient.getAverageRating(productId);
        Mono<Object> inventoryMono = inventoryServiceClient.getInventoryByProductId(productId);
        Mono<List<Object>> ratingsMono = ratingServiceClient.findRatingsByProductId(productId).collectList();
        
        return Mono.zip(productMono, availabilityMono, ratingMono, inventoryMono, ratingsMono)
            .map(tuple -> {
                Map<String, Object> product = (Map<String, Object>) tuple.getT1();
                return new ProductDetailDto(
                    (Integer) product.get("productId"),
                    (String) product.get("productTitle"),
                    (String) product.get("imageUrl"),
                    (String) product.get("sku"),
                    (Double) product.get("priceUnit"),
                    (Integer) product.get("quantity"),
                    product.get("category"),
                    tuple.getT2(),
                    tuple.getT3(),
                    tuple.getT4(),
                    tuple.getT5()
                );
            })
            .doOnSuccess(detail -> log.info("Successfully aggregated product details for: {}", productId))
            .doOnError(error -> log.error("Error fetching product details for: {}", productId, error));
    }
    
    /**
     * Get all products with availability and rating
     */
    public Flux<ProductSummaryDto> getAllProductsSummary() {
        log.info("Fetching all products summary");
        
        return productServiceClient.findAllProducts()
            .flatMap(product -> {
                Map<String, Object> productMap = (Map<String, Object>) product;
                Integer productId = (Integer) productMap.get("productId");
                
                Mono<Boolean> availability = inventoryServiceClient.checkAvailability(productId)
                    .onErrorReturn(false);
                Mono<Double> rating = ratingServiceClient.getAverageRating(productId)
                    .onErrorReturn(0.0);
                
                return Mono.zip(Mono.just(productMap), availability, rating)
                    .map(tuple -> new ProductSummaryDto(
                        productId,
                        (String) tuple.getT1().get("productTitle"),
                        (String) tuple.getT1().get("imageUrl"),
                        (Double) tuple.getT1().get("priceUnit"),
                        tuple.getT2(),
                        tuple.getT3()
                    ));
            })
            .doOnComplete(() -> log.info("Successfully fetched all products summary"))
            .doOnError(error -> log.error("Error fetching products summary", error));
    }
    
    /**
     * Get products by category with availability and rating
     */
    public Flux<ProductSummaryDto> getProductsByCategorySummary(Integer categoryId) {
        log.info("Fetching products for categoryId: {}", categoryId);
        
        return productServiceClient.findProductsByCategoryId(categoryId)
            .flatMap(product -> {
                Map<String, Object> productMap = (Map<String, Object>) product;
                Integer productId = (Integer) productMap.get("productId");
                
                Mono<Boolean> availability = inventoryServiceClient.checkAvailability(productId)
                    .onErrorReturn(false);
                Mono<Double> rating = ratingServiceClient.getAverageRating(productId)
                    .onErrorReturn(0.0);
                
                return Mono.zip(Mono.just(productMap), availability, rating)
                    .map(tuple -> new ProductSummaryDto(
                        productId,
                        (String) tuple.getT1().get("productTitle"),
                        (String) tuple.getT1().get("imageUrl"),
                        (Double) tuple.getT1().get("priceUnit"),
                        tuple.getT2(),
                        tuple.getT3()
                    ));
            })
            .doOnComplete(() -> log.info("Successfully fetched products for category: {}", categoryId))
            .doOnError(error -> log.error("Error fetching products for category: {}", categoryId, error));
    }
    
    /**
     * Search products with availability and rating
     */
    public Flux<ProductSummaryDto> searchProducts(String keyword) {
        log.info("Searching products with keyword: {}", keyword);
        
        return productServiceClient.searchProducts(keyword)
            .flatMap(product -> {
                Map<String, Object> productMap = (Map<String, Object>) product;
                Integer productId = (Integer) productMap.get("productId");
                
                Mono<Boolean> availability = inventoryServiceClient.checkAvailability(productId)
                    .onErrorReturn(false);
                Mono<Double> rating = ratingServiceClient.getAverageRating(productId)
                    .onErrorReturn(0.0);
                
                return Mono.zip(Mono.just(productMap), availability, rating)
                    .map(tuple -> new ProductSummaryDto(
                        productId,
                        (String) tuple.getT1().get("productTitle"),
                        (String) tuple.getT1().get("imageUrl"),
                        (Double) tuple.getT1().get("priceUnit"),
                        tuple.getT2(),
                        tuple.getT3()
                    ));
            })
            .doOnComplete(() -> log.info("Successfully searched products with keyword: {}", keyword))
            .doOnError(error -> log.error("Error searching products with keyword: {}", keyword, error));
    }
}
