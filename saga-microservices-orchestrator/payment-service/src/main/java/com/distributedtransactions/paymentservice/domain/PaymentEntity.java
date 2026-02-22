package com.distributedtransactions.paymentservice.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class PaymentEntity {
    @Id
    private String orderId;
    private boolean paid; // true if payment is successful
}
