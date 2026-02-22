package com.distributedtransactions.orderservice.service;

import com.distributedtransactions.orderservice.domain.OrderEntity;
import com.distributedtransactions.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public OrderEntity createOrder(String orderId, String customerId, double amount) {
        OrderEntity order = new OrderEntity();
        order.setOrderId(orderId);
        order.setCustomerId(customerId);
        order.setAmount(amount);
        order.setStatus("CREATED");
        orderRepository.save(order);
        log.info("[OrderService] Order created: {}", orderId);
        return order;
    }

    @Transactional
    public void cancelOrder(String orderId) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus("CANCELED");
            orderRepository.save(order);
            log.info("[OrderService] Order canceled: {}", orderId);
        });
    }
}
