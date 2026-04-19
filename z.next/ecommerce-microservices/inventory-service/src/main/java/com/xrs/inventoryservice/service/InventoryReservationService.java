package com.xrs.inventoryservice.service;

import com.xrs.inventoryservice.event.dto.ReserveInventoryRequest;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service to handle inventory reservations for orders
 * Implements saga compensation pattern for inventory management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryReservationService {

    private final InventoryRepository inventoryRepository;

    // In-memory store for reservations (in production, use Redis or database table)
    private final Map<String, Map<Integer, Integer>> reservations = new HashMap<>();

    /**
     * Reserve inventory for order items
     * Returns true if all items reserved successfully, false otherwise
     */
    @Transactional
    public boolean reserveInventory(Integer orderId, List<ReserveInventoryRequest.OrderItemData> items) {
        log.info("Attempting to reserve inventory for order {}", orderId);

        try {
            // First check if all items have sufficient quantity
            for (ReserveInventoryRequest.OrderItemData item : items) {
                Inventory inventory = inventoryRepository.findByProductName(item.productName())
                        .orElse(null);

                if (inventory == null) {
                    log.warn("Product {} not found in inventory", item.productName());
                    return false;
                }

                if (inventory.getQuantity() < item.quantity()) {
                    log.warn("Insufficient inventory for product {}: available={}, requested={}",
                            item.productName(), inventory.getQuantity(), item.quantity());
                    return false;
                }
            }

            // All items have sufficient quantity, proceed with reservation
            Map<Integer, Integer> orderReservations = new HashMap<>();
            
            for (ReserveInventoryRequest.OrderItemData item : items) {
                Inventory inventory = inventoryRepository.findByProductName(item.productName())
                        .orElseThrow();

                // Deduct quantity
                int newQuantity = inventory.getQuantity() - item.quantity();
                inventory.setQuantity(newQuantity);
                inventoryRepository.save(inventory);

                // Track reservation for potential rollback
                orderReservations.put(item.productId(), item.quantity());

                log.info("Reserved {} units of product {} for order {}",
                        item.quantity(), item.productName(), orderId);
            }

            // Store reservation for potential compensation
            reservations.put(orderId.toString(), orderReservations);

            return true;
        } catch (Exception e) {
            log.error("Error reserving inventory for order {}: {}", orderId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Release previously reserved inventory (compensation)
     */
    @Transactional
    public void releaseInventory(Integer orderId, String reservationId) {
        log.info("Releasing inventory for order {} (compensation)", orderId);

        try {
            Map<Integer, Integer> orderReservations = reservations.get(orderId.toString());
            
            if (orderReservations == null) {
                log.warn("No reservations found for order {}", orderId);
                return;
            }

            // Return inventory quantities
            for (Map.Entry<Integer, Integer> entry : orderReservations.entrySet()) {
                Integer productId = entry.getKey();
                Integer quantity = entry.getValue();

                // Find inventory by product ID (assuming ID mapping exists)
                // In production, maintain proper product ID to inventory mapping
                inventoryRepository.findById(productId.longValue())
                        .ifPresent(inventory -> {
                            int newQuantity = inventory.getQuantity() + quantity;
                            inventory.setQuantity(newQuantity);
                            inventoryRepository.save(inventory);

                            log.info("Released {} units of product {} for order {}",
                                    quantity, inventory.getProductName(), orderId);
                        });
            }

            // Remove reservation record
            reservations.remove(orderId.toString());

        } catch (Exception e) {
            log.error("Error releasing inventory for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    /**
     * Check if inventory is available for a product
     */
    @Transactional(readOnly = true)
    public boolean isInventoryAvailable(String productName, Integer quantity) {
        return inventoryRepository.findByProductName(productName)
                .map(inventory -> inventory.getQuantity() >= quantity)
                .orElse(false);
    }
}
