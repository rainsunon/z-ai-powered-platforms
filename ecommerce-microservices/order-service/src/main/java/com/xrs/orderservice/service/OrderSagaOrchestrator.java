package com.xrs.orderservice.service;

import com.google.gson.Gson;
import com.xrs.orderservice.constant.KafkaConstant;
import com.xrs.orderservice.domain.event.OrderCreatedEvent;
import com.xrs.orderservice.entity.Order;
import com.xrs.orderservice.entity.OrderSagaState;
import com.xrs.orderservice.entity.ProcessedEvent;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.repository.OrderSagaStateRepository;
import com.xrs.orderservice.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * OrderSagaOrchestrator coordinates the distributed transaction (saga) for order fulfillment
 * Implements choreography-based saga pattern with compensation
 * 
 * Saga Flow:
 * 1. Order Created → Reserve Inventory
 * 2. Inventory Reserved → Process Payment
 * 3. Payment Completed → Create Shipment
 * 4. Shipment Created → Complete Order
 * 
 * Compensation Flow (on failure):
 * - Payment fails → Release Inventory → Cancel Order
 * - Shipment fails → Refund Payment → Release Inventory → Cancel Order
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final OrderSagaStateRepository sagaStateRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final OutboxService outboxService;
    private final Gson gson = new Gson();

    /**
     * Start saga when order is created
     */
    @Transactional
    public void startSaga(Order order) {
        try {
            log.info("Starting saga for order {}", order.getOrderId());

            // Create saga state
            OrderSagaState sagaState = OrderSagaState.builder()
                    .orderId(order.getOrderId())
                    .currentStep("ORDER_CREATED")
                    .sagaStatus(OrderSagaState.SagaStatus.STARTED)
                    .startedAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .retryCount(0)
                    .build();
            sagaStateRepository.save(sagaState);

            // Publish order created event to outbox (will trigger inventory reservation)
            OrderCreatedEvent event = new OrderCreatedEvent(
                    UUID.randomUUID().toString(),
                    order.getOrderId(),
                    order.getUserId(),
                    order.getItems().stream()
                            .map(item -> new OrderCreatedEvent.OrderItemData(
                                    item.getProductId(),
                                    item.getProductName(),
                                    item.getQuantity(),
                                    item.getUnitPrice().doubleValue(),
                                    item.getLineTotal().doubleValue()
                            ))
                            .toList(),
                    order.getTotalAmount().doubleValue(),
                    order.getShippingAddress(),
                    LocalDateTime.now()
            );

            outboxService.saveEvent(
                    KafkaConstant.RESERVE_INVENTORY_REQUEST_TOPIC,
                    order.getOrderId().toString(),
                    event,
                    order.getOrderId().toString(),
                    "Order"
            );

            // Update saga state
            sagaState.moveToNextStep("INVENTORY_RESERVATION", OrderSagaState.SagaStatus.INVENTORY_RESERVING);
            sagaStateRepository.save(sagaState);

            log.info("Saga started successfully for order {}", order.getOrderId());
        } catch (Exception e) {
            log.error("Failed to start saga for order {}: {}", order.getOrderId(), e.getMessage(), e);
            throw new RuntimeException("Failed to start saga", e);
        }
    }

    /**
     * Handle inventory reserved event - proceed to payment
     */
    @Transactional
    public void handleInventoryReserved(String eventId, Integer orderId, String reservationId) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.info("Handling inventory reserved for order {}", orderId);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Saga state not found for order: " + orderId));

            // Get order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            // Update order status
            order.confirm();
            orderRepository.save(order);

            // Update saga state
            sagaState.setReservationId(reservationId);
            sagaState.moveToNextStep("PAYMENT_PROCESSING", OrderSagaState.SagaStatus.INVENTORY_RESERVED);
            sagaStateRepository.save(sagaState);

            // Request payment processing
            ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                    UUID.randomUUID().toString(),
                    orderId,
                    order.getUserId(),
                    order.getTotalAmount().doubleValue(),
                    LocalDateTime.now()
            );

            outboxService.saveEvent(
                    KafkaConstant.PROCESS_PAYMENT_REQUEST_TOPIC,
                    orderId.toString(),
                    paymentRequest,
                    orderId.toString(),
                    "Order"
            );

            sagaState.moveToNextStep("PAYMENT_PROCESSING", OrderSagaState.SagaStatus.PAYMENT_PROCESSING);
            sagaStateRepository.save(sagaState);

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "InventoryReservedEvent", orderId, gson.toJson(reservationId)
            ));

            log.info("Successfully processed inventory reserved for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to handle inventory reserved for order {}: {}", orderId, e.getMessage(), e);
            handleSagaFailure(orderId, "Inventory reserved handling failed: " + e.getMessage());
        }
    }

    /**
     * Handle payment completed event - proceed to shipment
     */
    @Transactional
    public void handlePaymentCompleted(String eventId, Integer orderId, String paymentId) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.info("Handling payment completed for order {}", orderId);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Saga state not found for order: " + orderId));

            // Get order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            // Update order status
            order.markAsPaid();
            orderRepository.save(order);

            // Update saga state
            sagaState.setPaymentId(paymentId);
            sagaState.moveToNextStep("SHIPMENT_CREATING", OrderSagaState.SagaStatus.PAYMENT_COMPLETED);
            sagaStateRepository.save(sagaState);

            // Request shipment creation
            CreateShipmentRequest shipmentRequest = new CreateShipmentRequest(
                    UUID.randomUUID().toString(),
                    orderId,
                    order.getUserId(),
                    order.getShippingAddress(),
                    LocalDateTime.now()
            );

            outboxService.saveEvent(
                    KafkaConstant.CREATE_SHIPMENT_REQUEST_TOPIC,
                    orderId.toString(),
                    shipmentRequest,
                    orderId.toString(),
                    "Order"
            );

            sagaState.moveToNextStep("SHIPMENT_CREATING", OrderSagaState.SagaStatus.SHIPMENT_CREATING);
            sagaStateRepository.save(sagaState);

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "PaymentCompletedEvent", orderId, gson.toJson(paymentId)
            ));

            log.info("Successfully processed payment completed for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to handle payment completed for order {}: {}", orderId, e.getMessage(), e);
            handleSagaFailure(orderId, "Payment completed handling failed: " + e.getMessage());
        }
    }

    /**
     * Handle shipment created event - complete saga
     */
    @Transactional
    public void handleShipmentCreated(String eventId, Integer orderId, String shipmentId) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.info("Handling shipment created for order {}", orderId);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Saga state not found for order: " + orderId));

            // Get order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            // Update order status
            order.markAsShipped();
            orderRepository.save(order);

            // Update saga state
            sagaState.setShipmentId(shipmentId);
            sagaState.markAsCompleted();
            sagaStateRepository.save(sagaState);

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "ShipmentCreatedEvent", orderId, gson.toJson(shipmentId)
            ));

            log.info("Saga completed successfully for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to handle shipment created for order {}: {}", orderId, e.getMessage(), e);
            handleSagaFailure(orderId, "Shipment created handling failed: " + e.getMessage());
        }
    }

    /**
     * Handle inventory reservation failure - compensate
     */
    @Transactional
    public void handleInventoryReservationFailed(String eventId, Integer orderId, String reason) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.warn("Inventory reservation failed for order {}: {}", orderId, reason);

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "InventoryReservationFailedEvent", orderId, gson.toJson(reason)
            ));

            handleSagaFailure(orderId, "Inventory reservation failed: " + reason);
        } catch (Exception e) {
            log.error("Failed to handle inventory reservation failure for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    /**
     * Handle payment failure - compensate
     */
    @Transactional
    public void handlePaymentFailed(String eventId, Integer orderId, String reason) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.warn("Payment failed for order {}: {}", orderId, reason);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Saga state not found for order: " + orderId));

            // Start compensation - release inventory
            if (sagaState.getReservationId() != null) {
                ReleaseInventoryRequest releaseRequest = new ReleaseInventoryRequest(
                        UUID.randomUUID().toString(),
                        orderId,
                        sagaState.getReservationId()
                );

                outboxService.saveEvent(
                        KafkaConstant.RELEASE_INVENTORY_REQUEST_TOPIC,
                        orderId.toString(),
                        releaseRequest,
                        orderId.toString(),
                        "Order"
                );
            }

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "PaymentFailedEvent", orderId, gson.toJson(reason)
            ));

            handleSagaFailure(orderId, "Payment failed: " + reason);
        } catch (Exception e) {
            log.error("Failed to handle payment failure for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    /**
     * Handle shipment failure - compensate
     */
    @Transactional
    public void handleShipmentFailed(String eventId, Integer orderId, String reason) {
        // Check idempotency
        if (processedEventRepository.existsByEventId(eventId)) {
            log.warn("Event {} already processed, skipping", eventId);
            return;
        }

        try {
            log.warn("Shipment creation failed for order {}: {}", orderId, reason);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Saga state not found for order: " + orderId));

            // Start compensation - refund payment
            if (sagaState.getPaymentId() != null) {
                RefundPaymentRequest refundRequest = new RefundPaymentRequest(
                        UUID.randomUUID().toString(),
                        orderId,
                        sagaState.getPaymentId(),
                        reason
                );

                outboxService.saveEvent(
                        KafkaConstant.REFUND_PAYMENT_REQUEST_TOPIC,
                        orderId.toString(),
                        refundRequest,
                        orderId.toString(),
                        "Order"
                );
            }

            // Release inventory
            if (sagaState.getReservationId() != null) {
                ReleaseInventoryRequest releaseRequest = new ReleaseInventoryRequest(
                        UUID.randomUUID().toString(),
                        orderId,
                        sagaState.getReservationId()
                );

                outboxService.saveEvent(
                        KafkaConstant.RELEASE_INVENTORY_REQUEST_TOPIC,
                        orderId.toString(),
                        releaseRequest,
                        orderId.toString(),
                        "Order"
                );
            }

            // Mark event as processed
            processedEventRepository.save(ProcessedEvent.create(
                    eventId, "ShipmentFailedEvent", orderId, gson.toJson(reason)
            ));

            handleSagaFailure(orderId, "Shipment creation failed: " + reason);
        } catch (Exception e) {
            log.error("Failed to handle shipment failure for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    /**
     * Handle saga failure - cancel order and update saga state
     */
    @Transactional
    public void handleSagaFailure(Integer orderId, String reason) {
        try {
            log.error("Handling saga failure for order {}: {}", orderId, reason);

            // Get saga state
            OrderSagaState sagaState = sagaStateRepository.findByOrderId(orderId)
                    .orElse(null);

            if (sagaState != null) {
                sagaState.startCompensation();
                sagaState.markAsFailed(reason);
                sagaStateRepository.save(sagaState);
            }

            // Cancel order
            orderRepository.findById(orderId).ifPresent(order -> {
                order.cancel(reason);
                orderRepository.save(order);
            });

            log.info("Saga failed and compensated for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to handle saga failure for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    // Request DTOs (inner records)
    public record ProcessPaymentRequest(
            String eventId,
            Integer orderId,
            Long userId,
            Double amount,
            LocalDateTime timestamp
    ) {}

    public record CreateShipmentRequest(
            String eventId,
            Integer orderId,
            Long userId,
            String address,
            LocalDateTime timestamp
    ) {}

    public record ReleaseInventoryRequest(
            String eventId,
            Integer orderId,
            String reservationId
    ) {}

    public record RefundPaymentRequest(
            String eventId,
            Integer orderId,
            String paymentId,
            String reason
    ) {}
}
