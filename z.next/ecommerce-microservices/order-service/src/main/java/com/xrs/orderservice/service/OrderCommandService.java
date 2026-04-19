package com.xrs.orderservice.service;

import com.xrs.orderservice.dto.CreateOrderRequest;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.entity.OrderItem;
import com.xrs.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Command service for order creation and saga initiation
 * Follows CQRS pattern - handles commands (writes) to orders
 * Delegates saga orchestration to OrderSagaOrchestrator
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderCommandService {

    private final OrderRepository orderRepository;
    private final OrderSagaOrchestrator orderSagaOrchestrator;

    /**
     * Create a new order and initiate the saga
     * 
     * @param request Order creation request
     * @return Created order entity
     */
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        log.info("Creating order for user: {}", request.userId());
        
        // Create order items first
        List<OrderItem> orderItems = request.items().stream()
                .map(itemRequest -> {
                    OrderItem item = OrderItem.builder()
                            .productId(itemRequest.productId().intValue()) // Convert Long to Integer
                            .productName("Product " + itemRequest.productId()) // TODO: Fetch from product service
                            .quantity(itemRequest.quantity())
                            .unitPrice(BigDecimal.valueOf(itemRequest.unitPrice()))
                            .lineTotal(BigDecimal.valueOf(itemRequest.unitPrice() * itemRequest.quantity()))
                            .build();
                    return item;
                })
                .collect(Collectors.toList());
        
        // Create Order aggregate using factory method
        Order order = Order.createOrder(request.userId(), orderItems, request.shippingAddress());
        
        // Save order to database
        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}", savedOrder.getOrderId());
        
        // Start the saga orchestration
        orderSagaOrchestrator.startSaga(savedOrder);
        log.info("Saga initiated for order ID: {}", savedOrder.getOrderId());
        
        return savedOrder;
    }

    /**
     * Get order by ID
     * 
     * @param orderId Order ID
     * @return Order entity
     */
    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
    }

    /**
     * Get all orders for a user
     * 
     * @param userId User ID
     * @return List of orders
     */
    public List<Order> getOrdersByUserId(Integer userId) {
        // Since OrderRepository might not have findByUserId, use findAll and filter
        // Or add the method to OrderRepository interface
        return orderRepository.findAll().stream()
                .filter(order -> order.getUserId().equals(userId.longValue()))
                .collect(Collectors.toList());
    }
}
