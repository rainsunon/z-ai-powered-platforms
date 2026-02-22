package com.distributedtransactions.queryservice.service;

import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.queryservice.model.OrderView;
import com.distributedtransactions.queryservice.repository.OrderViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryUpdater {

    private final OrderViewRepository orderViewRepository;

    @KafkaListener(topics = "order-events", groupId = "query-service-group")
    public void handleOrderEvents(OrderEvent event) {
        log.info("[QueryUpdater] Received OrderEvent: {}", event);

        switch (event.getStatus()) {
            case "ORDER_CREATED" -> {
                OrderView orderView = new OrderView();
                orderView.setOrderId(event.getOrderId());
                orderView.setCustomerId("customer-123"); // Replace with actual data
                orderView.setAmount(100.0); // Replace with actual data
                orderView.setStatus("CREATED");
                orderViewRepository.save(orderView);
                log.info("[QueryUpdater] Created OrderView for Order ID: {}", event.getOrderId());
            }
            case "ORDER_FAILED", "INVENTORY_FAILED", "PAYMENT_FAILED", "SHIPPING_FAILED" -> {
                orderViewRepository.findById(event.getOrderId()).ifPresent(orderView -> {
                    orderView.setStatus(event.getStatus());
                    orderViewRepository.save(orderView);
                    log.info("[QueryUpdater] Updated OrderView to {} for Order ID: {}", event.getStatus(), event.getOrderId());
                });
            }
            case "INVENTORY_RESERVED", "PAYMENT_SUCCESS", "ORDER_SHIPPED" -> {
                orderViewRepository.findById(event.getOrderId()).ifPresent(orderView -> {
                    orderView.setStatus(event.getStatus());
                    orderViewRepository.save(orderView);
                    log.info("[QueryUpdater] Updated OrderView to {} for Order ID: {}", event.getStatus(), event.getOrderId());
                });
            }
            default -> log.warn("[QueryUpdater] Unknown event status: {}", event.getStatus());
        }
    }
}
