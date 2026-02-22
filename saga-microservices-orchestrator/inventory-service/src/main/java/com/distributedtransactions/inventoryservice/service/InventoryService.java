package com.distributedtransactions.inventoryservice.service;

import com.distributedtransactions.inventoryservice.domain.InventoryEntity;
import com.distributedtransactions.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public boolean reserveInventory(String orderId) {
        // For simplicity, assume inventory is always available
        InventoryEntity inventory = new InventoryEntity();
        inventory.setOrderId(orderId);
        inventory.setReserved(true);
        inventoryRepository.save(inventory);
        log.info("[InventoryService] Reserved inventory for Order ID: {}", orderId);
        return true;
    }

    @Transactional
    public void releaseInventory(String orderId) {
        inventoryRepository.findById(orderId).ifPresent(inventory -> {
            inventory.setReserved(false);
            inventoryRepository.save(inventory);
            log.info("[InventoryService] Released inventory for Order ID: {}", orderId);
        });
    }
}
