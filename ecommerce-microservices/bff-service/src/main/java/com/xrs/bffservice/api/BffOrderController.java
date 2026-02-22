package com.xrs.bffservice.api;

import com.xrs.bffservice.dto.OrderDetailDto;
import com.xrs.bffservice.service.OrderAggregationService;
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
@RequestMapping("/api/bff/orders")
@RequiredArgsConstructor
@Tag(name = "BFF Order API", description = "Backend for Frontend - Order Operations")
public class BffOrderController {
    
    private final OrderAggregationService orderAggregationService;
    
    @GetMapping
    @Operation(summary = "Get all orders")
    public Flux<Object> getAllOrders() {
        log.info("BFF: Fetching all orders");
        return orderAggregationService.getAllOrders();
    }
    
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order details with complete information")
    public Mono<ResponseEntity<OrderDetailDto>> getOrderDetail(
            @Parameter(description = "Order ID") @PathVariable Integer orderId) {
        log.info("BFF: Fetching order detail for: {}", orderId);
        return orderAggregationService.getOrderDetail(orderId)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
