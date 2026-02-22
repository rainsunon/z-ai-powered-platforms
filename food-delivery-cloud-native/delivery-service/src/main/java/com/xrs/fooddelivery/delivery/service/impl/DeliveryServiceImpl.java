package com.xrs.fooddelivery.delivery.service.impl;

import com.xrs.fooddelivery.common.dto.DeliveryStatus;
import com.xrs.fooddelivery.common.dto.kafka.OrderCreatedEvent;
import com.xrs.fooddelivery.common.exception.ResourceNotFoundException;
import com.xrs.fooddelivery.delivery.common.DeliveryMapper;
import com.xrs.fooddelivery.delivery.dto.DeliveryDTO;
import com.xrs.fooddelivery.delivery.entity.Delivery;
import com.xrs.fooddelivery.delivery.repository.DeliveryRepository;
import com.xrs.fooddelivery.delivery.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    @Autowired
    DeliveryRepository deliveryRepository;

    @Autowired
    DeliveryMapper deliveryMapper;

    @Override
    public void createNewOrder(OrderCreatedEvent event) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(event.getOrderId());
        delivery.setDeliveryAgentId(100L); //Dummy agent ID
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());

        deliveryRepository.save(delivery);
    }

    @Override
    public List<DeliveryDTO> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        return deliveryMapper.toDTO(deliveries);
    }

    @Override
    public DeliveryDTO getDeliveryById(Long id) {
        Delivery delivery = getDeliveryEntityById(id);
        return deliveryMapper.toDTO(delivery);
    }

    @Override
    public void updateDeliveryStatus(Long id, DeliveryStatus status) throws ResourceNotFoundException {
        Delivery existingDelivery = getDeliveryEntityById(id);

        existingDelivery.setStatus(status);
        existingDelivery.setUpdateAt(LocalDateTime.now());

        deliveryRepository.save(existingDelivery);
    }

    private Delivery getDeliveryEntityById(Long id) {
        return deliveryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Delivery is not found with ID: " + id));
    }
}
