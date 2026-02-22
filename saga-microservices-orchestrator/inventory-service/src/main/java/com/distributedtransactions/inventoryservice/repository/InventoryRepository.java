package com.distributedtransactions.inventoryservice.repository;

import com.distributedtransactions.inventoryservice.domain.InventoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryEntity, String> {
}
