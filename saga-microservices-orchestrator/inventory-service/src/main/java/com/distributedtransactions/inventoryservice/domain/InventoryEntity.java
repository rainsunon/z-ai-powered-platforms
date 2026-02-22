package com.distributedtransactions.inventoryservice.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class InventoryEntity {
    @Id
    private String orderId;
    private boolean reserved; // true if inventory is reserved
}
