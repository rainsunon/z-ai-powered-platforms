package com.distributedtransactions.shippingservice.listener;

import com.distributedtransactions.common.dto.OrderCommand;
import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.shippingservice.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShippingCommandListener {

    private final ShippingService shippingService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "shipping-commands", groupId = "shipping-service-group")
    public void listenShippingCommands(OrderCommand command) {
        log.info("[ShippingService] Received command: {}", command);

        switch (command.getType()) {
            case "SHIP_ORDER" -> {
                boolean success = shippingService.shipOrder(command.getOrderId());
                if (success) {
                    OrderEvent event = new OrderEvent(command.getOrderId(), "ORDER_SHIPPED", null);
                    kafkaTemplate.send("shipping-events", event);
                    log.info("[ShippingService] Published ORDER_SHIPPED event for Order ID: {}", command.getOrderId());
                } else {
                    OrderEvent event = new OrderEvent(command.getOrderId(), "SHIPPING_FAILED", "Unable to ship order");
                    kafkaTemplate.send("shipping-events", event);
                    log.info("[ShippingService] Published SHIPPING_FAILED event for Order ID: {}", command.getOrderId());
                }
            }
            case "ROLLBACK_SHIPPING" -> {
                shippingService.rollbackShipping(command.getOrderId());
                OrderEvent event = new OrderEvent(command.getOrderId(), "SHIPPING_ROLLED_BACK", null);
                kafkaTemplate.send("shipping-events", event);
                log.info("[ShippingService] Published SHIPPING_ROLLED_BACK event for Order ID: {}", command.getOrderId());
            }
            default -> log.warn("[ShippingService] Unknown command type: {}", command.getType());
        }
    }
}
