package com.xrs.fooddelivery.payment.service;

import com.xrs.fooddelivery.payment.dto.PaymentInitiationRequest;
import com.xrs.fooddelivery.payment.dto.PaymentRequest;
import com.xrs.fooddelivery.payment.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest paymentRequest);
    PaymentResponse getPaymentById(String paymentId);
    PaymentResponse initiatePayment(PaymentInitiationRequest request);
    PaymentResponse capturePayment(String paymentId);
    List<PaymentResponse> getPaymentsByMerchantId(Long merchantId);
    List<PaymentResponse> getPaymentsByCustomerId(Long customerId);
}
