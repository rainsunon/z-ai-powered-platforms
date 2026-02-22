package com.distributedtransactions.shippingservice.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ShippingEntity {
    @Id
    private String orderId;
    private String status; // SHIPPED, FAILED, ROLLBACK_SHIPPED
}
