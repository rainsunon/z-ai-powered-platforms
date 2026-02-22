package com.xrs.fooddelivery.payment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(length = 100)
    private String itemId;

    @Column(length = 255)
    private String name;

    @Column
    private Integer quantity;

    @Column(precision = 19, scale = 4)
    private BigDecimal price;
}
