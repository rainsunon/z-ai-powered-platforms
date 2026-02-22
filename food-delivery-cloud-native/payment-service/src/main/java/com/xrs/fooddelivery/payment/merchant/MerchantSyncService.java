package com.xrs.fooddelivery.payment.merchant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.fooddelivery.payment.dto.PaymentResponse;
import com.xrs.fooddelivery.payment.entity.Payment;
import com.xrs.fooddelivery.payment.repository.MerchantPaymentSummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MerchantSyncService {
    private final MerchantPaymentSummaryRepository merchantPaymentSummaryRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void syncPaymentToMerchantStorage(Payment payment) {
        try {
            MerchantPaymentSummary summary = MerchantPaymentSummary.builder()
                    .paymentId(payment.getPaymentId())
                    .merchantId(payment.getMerchantId())
                    .customerId(payment.getCustomerId())
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .status(payment.getStatus())
                    .authId(payment.getAuthId())
                    .captureId(payment.getCaptureId())
                    .description(payment.getDescription())
                    .createdAt(payment.getCreatedAt())
                    .updatedAt(payment.getUpdatedAt())
                    .failureReason(payment.getFailureReason())
                    .customerDetails(objectMapper.writeValueAsString(
                            CustomerDetails.builder()
                                    .customerId(payment.getCustomerId())
                                    .build()
                    ))
                    .orderDetails(objectMapper.writeValueAsString(
                            OrderDetails.builder()
                                    .orderId(payment.getOrderId())
                                    .build()
                    ))
                    .build();

            merchantPaymentSummaryRepository.save(summary);
            log.info("Payment synced to merchant storage for paymentId: {}, merchantId: {}",
                    payment.getPaymentId(), payment.getMerchantId());
        } catch (Exception e) {
            log.error("Error syncing payment to merchant storage for paymentId: {}",
                    payment.getPaymentId(), e);
        }
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class CustomerDetails {
        private Long customerId;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class OrderDetails {
        private Long orderId;
    }
}
