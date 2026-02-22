package com.xrs.orderservice.controller;

import com.xrs.orderservice.dto.CreateOrderRequest;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.service.OrderCommandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for order commands (CQRS write side)
 * Handles order creation and saga initiation
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderCommandController {

    private final OrderCommandService orderCommandService;

    /**
     * Create a new order
     * Initiates the saga workflow (inventory → payment → shipment)
     * 
     * @param request Order creation request
     * @return Created order entity
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Received order creation request for user: {}", request.userId());
        
        try {
            Order order = orderCommandService.createOrder(request);
            log.info("Order created successfully with ID: {}", order.getOrderId());
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get order by ID
     * 
     * @param orderId Order ID
     * @return Order entity
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable Integer orderId) {
        log.info("Fetching order with ID: {}", orderId);
        
        try {
            Order order = orderCommandService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            log.error("Order not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all orders for a user
     * 
     * @param userId User ID
     * @return List of orders
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Integer userId) {
        log.info("Fetching orders for user: {}", userId);
        
        List<Order> orders = orderCommandService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}
