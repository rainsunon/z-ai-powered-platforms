package com.xrs.bffservice.api;

import com.xrs.bffservice.dto.ProductDetailDto;
import com.xrs.bffservice.dto.ProductSummaryDto;
import com.xrs.bffservice.service.ProductAggregationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/bff/products")
@RequiredArgsConstructor
@Tag(name = "BFF Product API", description = "Backend for Frontend - Product Catalog Operations")
public class BffProductController {
    
    private final ProductAggregationService productAggregationService;
    
    @GetMapping
    @Operation(summary = "Get all products with availability and ratings")
    public Flux<ProductSummaryDto> getAllProducts() {
        log.info("BFF: Fetching all products");
        return productAggregationService.getAllProductsSummary();
    }
    
    @GetMapping("/{productId}")
    @Operation(summary = "Get product details with inventory and ratings")
    public Mono<ResponseEntity<ProductDetailDto>> getProductDetail(
            @Parameter(description = "Product ID") @PathVariable Integer productId) {
        log.info("BFF: Fetching product detail for: {}", productId);
        return productAggregationService.getProductDetail(productId)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category with availability and ratings")
    public Flux<ProductSummaryDto> getProductsByCategory(
            @Parameter(description = "Category ID") @PathVariable Integer categoryId) {
        log.info("BFF: Fetching products for category: {}", categoryId);
        return productAggregationService.getProductsByCategorySummary(categoryId);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search products with availability and ratings")
    public Flux<ProductSummaryDto> searchProducts(
            @Parameter(description = "Search keyword") @RequestParam String keyword) {
        log.info("BFF: Searching products with keyword: {}", keyword);
        return productAggregationService.searchProducts(keyword);
    }
}
