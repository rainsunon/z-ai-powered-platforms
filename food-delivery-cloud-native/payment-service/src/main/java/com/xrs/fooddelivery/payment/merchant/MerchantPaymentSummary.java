package com.xrs.fooddelivery.payment.merchant;

import com.xrs.fooddelivery.payment.dto.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchant_payment_summaries", indexes = {
    @Index(name = "idx_merchant_id", columnList = "merchantId"),
    @Index(name = "idx_payment_id", columnList = "paymentId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantPaymentSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String paymentId;

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(length = 100)
    private String authId;

    @Column(length = 100)
    private String captureId;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column(length = 500)
    private String failureReason;

    @Column(length = 500)
    private String customerDetails;

    @Column(length = 500)
    private String orderDetails;
}
