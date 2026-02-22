package com.xrs.fooddelivery.payment.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.fooddelivery.payment.dto.PaymentStatus;
import com.xrs.fooddelivery.payment.entity.Payment;
import com.xrs.fooddelivery.payment.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void logPaymentEvent(String paymentId, String eventType, Payment payment, String source) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .paymentId(paymentId)
                    .eventType(eventType)
                    .status(payment.getStatus())
                    .customerId(payment.getCustomerId())
                    .merchantId(payment.getMerchantId())
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .authId(payment.getAuthId())
                    .captureId(payment.getCaptureId())
                    .failureReason(payment.getFailureReason())
                    .eventData(objectMapper.writeValueAsString(payment))
                    .timestamp(LocalDateTime.now())
                    .source(source)
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log created for paymentId: {}, eventType: {}", paymentId, eventType);
        } catch (Exception e) {
            log.error("Error creating audit log for paymentId: {}, eventType: {}", paymentId, eventType, e);
        }
    }

    @Async
    public void logPaymentEvent(String paymentId, String eventType, PaymentStatus status,
                               Long customerId, Long merchantId, Long orderId,
                               BigDecimal amount, String authId, String captureId,
                               String failureReason, String eventData, String source) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .paymentId(paymentId)
                    .eventType(eventType)
                    .status(status)
                    .customerId(customerId)
                    .merchantId(merchantId)
                    .orderId(orderId)
                    .amount(amount)
                    .authId(authId)
                    .captureId(captureId)
                    .failureReason(failureReason)
                    .eventData(eventData)
                    .timestamp(LocalDateTime.now())
                    .source(source)
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log created for paymentId: {}, eventType: {}", paymentId, eventType);
        } catch (Exception e) {
            log.error("Error creating audit log for paymentId: {}, eventType: {}", paymentId, eventType, e);
        }
    }
}
