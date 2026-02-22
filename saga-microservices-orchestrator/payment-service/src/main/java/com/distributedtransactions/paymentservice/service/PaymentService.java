package com.distributedtransactions.paymentservice.service;

import com.distributedtransactions.paymentservice.domain.PaymentEntity;
import com.distributedtransactions.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public boolean processPayment(String orderId, double amount) {
        // Simulate payment processing logic
        // For demonstration, assume payments above $50 fail
        boolean success = amount <= 50.0;
        PaymentEntity payment = new PaymentEntity();
        payment.setOrderId(orderId);
        payment.setPaid(success);
        paymentRepository.save(payment);
        log.info("[PaymentService] Payment processing for Order ID: {} - Success: {}", orderId, success);
        return success;
    }

    @Transactional
    public void rollbackPayment(String orderId) {
        paymentRepository.findById(orderId).ifPresent(payment -> {
            payment.setPaid(false);
            paymentRepository.save(payment);
            log.info("[PaymentService] Payment rolled back for Order ID: {}", orderId);
        });
    }
}
