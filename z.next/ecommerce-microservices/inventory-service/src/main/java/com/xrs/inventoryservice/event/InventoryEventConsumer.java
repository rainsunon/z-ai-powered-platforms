package com.xrs.inventoryservice.event;

import com.google.gson.Gson;
import com.xrs.inventoryservice.event.dto.*;
import com.xrs.inventoryservice.service.InventoryReservationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

/**
 * Kafka consumer for inventory events
 * Listens to RESERVE_INVENTORY_REQUEST and RELEASE_INVENTORY_REQUEST topics
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventConsumer {

    private final ReceiverOptions<String, String> receiverOptions;
    private final InventoryReservationService inventoryReservationService;
    private final InventoryEventProducer eventProducer;
    private final Gson gson = new Gson();

    private static final String RESERVE_INVENTORY_TOPIC = "inventory.reserve.request";
    private static final String RELEASE_INVENTORY_TOPIC = "inventory.release.request";
    private static final String INVENTORY_RESERVED_TOPIC = "inventory.reserved";
    private static final String INVENTORY_FAILED_TOPIC = "inventory.reservation.failed";

    @PostConstruct
    public void init() {
        subscribeToReserveInventory();
        subscribeToReleaseInventory();
    }

    private void subscribeToReserveInventory() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton(RESERVE_INVENTORY_TOPIC)))
                .receive()
                .subscribe(record -> {
                    try {
                        String message = record.value();
                        log.info("Received reserve inventory request: {}", message);

                        ReserveInventoryRequest request = gson.fromJson(message, ReserveInventoryRequest.class);
                        handleReserveInventory(request);

                        record.receiverOffset().acknowledge();
                    } catch (Exception e) {
                        log.error("Error processing reserve inventory request: {}", e.getMessage(), e);
                    }
                });
    }

    private void subscribeToReleaseInventory() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton(RELEASE_INVENTORY_TOPIC)))
                .receive()
                .subscribe(record -> {
                    try {
                        String message = record.value();
                        log.info("Received release inventory request: {}", message);

                        ReleaseInventoryRequest request = gson.fromJson(message, ReleaseInventoryRequest.class);
                        handleReleaseInventory(request);

                        record.receiverOffset().acknowledge();
                    } catch (Exception e) {
                        log.error("Error processing release inventory request: {}", e.getMessage(), e);
                    }
                });
    }

    private void handleReserveInventory(ReserveInventoryRequest request) {
        try {
            log.info("Processing inventory reservation for order {}", request.orderId());

            // Reserve inventory for all items in the order
            boolean allReserved = inventoryReservationService.reserveInventory(
                    request.orderId(), 
                    request.items()
            );

            if (allReserved) {
                String reservationId = UUID.randomUUID().toString();
                
                // Publish success event for each item
                for (ReserveInventoryRequest.OrderItemData item : request.items()) {
                    InventoryReservedEvent event = new InventoryReservedEvent(
                            UUID.randomUUID().toString(),
                            request.orderId(),
                            item.productId(),
                            item.quantity(),
                            reservationId,
                            LocalDateTime.now()
                    );

                    String eventJson = gson.toJson(event);
                    eventProducer.send(INVENTORY_RESERVED_TOPIC, request.orderId().toString(), eventJson)
                            .subscribe();
                }

                log.info("Successfully reserved inventory for order {}", request.orderId());
            } else {
                // Publish failure event
                publishInventoryReservationFailed(request.orderId(), 0, "Insufficient inventory");
                log.warn("Failed to reserve inventory for order {}: Insufficient stock", request.orderId());
            }
        } catch (Exception e) {
            log.error("Error reserving inventory for order {}: {}", request.orderId(), e.getMessage(), e);
            publishInventoryReservationFailed(request.orderId(), 0, e.getMessage());
        }
    }

    private void handleReleaseInventory(ReleaseInventoryRequest request) {
        try {
            log.info("Processing inventory release for order {} (compensation)", request.orderId());

            inventoryReservationService.releaseInventory(request.orderId(), request.reservationId());

            log.info("Successfully released inventory for order {}", request.orderId());
        } catch (Exception e) {
            log.error("Error releasing inventory for order {}: {}", request.orderId(), e.getMessage(), e);
        }
    }

    private void publishInventoryReservationFailed(Integer orderId, Integer productId, String reason) {
        try {
            InventoryReservationFailedEvent event = new InventoryReservationFailedEvent(
                    UUID.randomUUID().toString(),
                    orderId,
                    productId,
                    reason,
                    LocalDateTime.now()
            );

            String eventJson = gson.toJson(event);
            eventProducer.send(INVENTORY_FAILED_TOPIC, orderId.toString(), eventJson)
                    .subscribe();
        } catch (Exception e) {
            log.error("Failed to publish inventory reservation failed event: {}", e.getMessage(), e);
        }
    }
}
