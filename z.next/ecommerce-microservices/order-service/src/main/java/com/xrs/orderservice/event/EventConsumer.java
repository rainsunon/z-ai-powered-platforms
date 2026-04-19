package com.xrs.orderservice.event;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.xrs.orderservice.constant.KafkaConstant;
import com.xrs.orderservice.service.DeadLetterQueueService;
import com.xrs.orderservice.service.OrderSagaOrchestrator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

@Service
@Slf4j
public class EventConsumer {

    private final Gson gson = new Gson();
    private final OrderSagaOrchestrator orderSagaOrchestrator;
    private final DeadLetterQueueService dlqService;
    
    private final Map<String, Integer> retryTracker = new HashMap<>();

    public EventConsumer(ReceiverOptions<String, String> receiverOptions, 
                        OrderSagaOrchestrator orderSagaOrchestrator,
                        DeadLetterQueueService dlqService) {
        this.orderSagaOrchestrator = orderSagaOrchestrator;
        this.dlqService = dlqService;
        
        subscribeToTopic(receiverOptions, KafkaConstant.INVENTORY_RESERVED_TOPIC, this::handleInventoryReserved);
        subscribeToTopic(receiverOptions, KafkaConstant.INVENTORY_RESERVATION_FAILED_TOPIC, this::handleInventoryReservationFailed);
        subscribeToTopic(receiverOptions, KafkaConstant.PAYMENT_COMPLETED_TOPIC, this::handlePaymentCompleted);
        subscribeToTopic(receiverOptions, KafkaConstant.PAYMENT_FAILED_TOPIC, this::handlePaymentFailed);
        subscribeToTopic(receiverOptions, KafkaConstant.SHIPMENT_CREATED_TOPIC, this::handleShipmentCreated);
        subscribeToTopic(receiverOptions, KafkaConstant.SHIPMENT_FAILED_TOPIC, this::handleShipmentFailed);
    }

    private void subscribeToTopic(ReceiverOptions<String, String> receiverOptions, String topic,
                                  Consumer<ReceiverRecord<String, String>> handler) {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton(topic)))
                .receive()
                .subscribe(handler);
    }

    public void handleInventoryReserved(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received INVENTORY_RESERVED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String reservationId = event.get("reservationId").getAsString();
            
            log.info("Processing inventory reserved - eventId: {}, orderId: {}, reservationId: {}", 
                     eventId, orderId, reservationId);
            
            orderSagaOrchestrator.handleInventoryReserved(eventId, orderId, reservationId);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing inventory reserved event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "INVENTORY_RESERVED", 
                             KafkaConstant.INVENTORY_RESERVED_TOPIC, eventId, orderId, e);
        }
    }

    public void handleInventoryReservationFailed(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received INVENTORY_RESERVATION_FAILED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String reason = event.get("reason").getAsString();
            
            log.info("Processing inventory reservation failed - eventId: {}, orderId: {}, reason: {}", 
                     eventId, orderId, reason);
            
            orderSagaOrchestrator.handleInventoryReservationFailed(eventId, orderId, reason);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing inventory reservation failed event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "INVENTORY_RESERVATION_FAILED",
                             KafkaConstant.INVENTORY_RESERVATION_FAILED_TOPIC, eventId, orderId, e);
        }
    }

    public void handlePaymentCompleted(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received PAYMENT_COMPLETED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String paymentId = event.get("paymentId").getAsString();
            
            log.info("Processing payment completed event - eventId: {}, orderId: {}, paymentId: {}", 
                     eventId, orderId, paymentId);
            
            orderSagaOrchestrator.handlePaymentCompleted(eventId, orderId, paymentId);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing payment completed event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "PAYMENT_COMPLETED",
                             KafkaConstant.PAYMENT_COMPLETED_TOPIC, eventId, orderId, e);
        }
    }

    public void handlePaymentFailed(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received PAYMENT_FAILED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String reason = event.get("reason").getAsString();
            
            log.info("Processing payment failed - eventId: {}, orderId: {}, reason: {}", 
                     eventId, orderId, reason);
            
            orderSagaOrchestrator.handlePaymentFailed(eventId, orderId, reason);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing payment failed event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "PAYMENT_FAILED",
                             KafkaConstant.PAYMENT_FAILED_TOPIC, eventId, orderId, e);
        }
    }

    public void handleShipmentCreated(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received SHIPMENT_CREATED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String trackingId = event.get("trackingId").getAsString();
            
            log.info("Processing shipment created event - eventId: {}, orderId: {}, trackingId: {}", 
                     eventId, orderId, trackingId);
            
            orderSagaOrchestrator.handleShipmentCreated(eventId, orderId, trackingId);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing shipment created event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "SHIPMENT_CREATED",
                             KafkaConstant.SHIPMENT_CREATED_TOPIC, eventId, orderId, e);
        }
    }

    public void handleShipmentFailed(ReceiverRecord<String, String> receiverRecord) {
        log.info("Received SHIPMENT_FAILED event: {}", receiverRecord.value());
        
        String eventId = null;
        Integer orderId = null;
        try {
            JsonObject event = gson.fromJson(receiverRecord.value(), JsonObject.class);
            eventId = event.get("eventId").getAsString();
            orderId = event.get("orderId").getAsInt();
            String reason = event.get("reason").getAsString();
            
            log.info("Processing shipment failed - eventId: {}, orderId: {}, reason: {}", 
                     eventId, orderId, reason);
            
            orderSagaOrchestrator.handleShipmentFailed(eventId, orderId, reason);
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } catch (Exception e) {
            log.error("Error processing shipment failed event: {}", e.getMessage(), e);
            handleEventFailure(receiverRecord, "SHIPMENT_FAILED",
                             KafkaConstant.SHIPMENT_FAILED_TOPIC, eventId, orderId, e);
        }
    }

    private void handleEventFailure(ReceiverRecord<String, String> receiverRecord, 
                                   String eventType, String topic, 
                                   String eventId, Integer orderId, Exception exception) {
        if (eventId == null) {
            eventId = "unknown-" + System.currentTimeMillis();
        }
        
        int retryCount = retryTracker.getOrDefault(eventId, 0) + 1;
        retryTracker.put(eventId, retryCount);
        
        log.warn("Event processing failed - eventType: {}, eventId: {}, orderId: {}, retryCount: {}", 
                 eventType, eventId, orderId, retryCount);
        
        if (dlqService.shouldSendToDeadLetterQueue(retryCount)) {
            log.error("Max retries exceeded, sending to DLQ - eventId: {}, orderId: {}", eventId, orderId);
            dlqService.sendToDeadLetterQueue(
                eventId, 
                eventType, 
                orderId, 
                receiverRecord.value(), 
                topic, 
                exception, 
                retryCount
            );
            retryTracker.remove(eventId);
            receiverRecord.receiverOffset().acknowledge();
        } else {
            log.info("Retry {} of 3, not acknowledging to allow Kafka redelivery", retryCount);
        }
    }
}
