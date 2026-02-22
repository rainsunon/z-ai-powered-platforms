package com.xrs.fooddelivery.delivery.service;

import com.xrs.fooddelivery.common.dto.DeliveryStatus;
import com.xrs.fooddelivery.common.dto.kafka.OrderCreatedEvent;
import com.xrs.fooddelivery.delivery.dto.DeliveryDTO;

import java.util.List;

public interface DeliveryService {

    void createNewOrder(OrderCreatedEvent event);

    List<DeliveryDTO> getAllDeliveries();

    DeliveryDTO getDeliveryById(Long id);

    void updateDeliveryStatus(Long id, DeliveryStatus status);
}
