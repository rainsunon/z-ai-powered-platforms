package com.xrs.inventoryservice.repository;

import com.xrs.inventoryservice.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByProductNameIn(List<String> skuCode);
    
    Optional<Inventory> findByProductName(String productName);
}