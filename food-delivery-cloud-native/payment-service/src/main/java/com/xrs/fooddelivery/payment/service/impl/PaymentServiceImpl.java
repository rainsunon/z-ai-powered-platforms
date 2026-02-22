package com.xrs.fooddelivery.payment.service.impl;

import com.xrs.fooddelivery.payment.audit.AuditService;
import com.xrs.fooddelivery.payment.client.CardNetworkClient;
import com.xrs.fooddelivery.payment.dto.*;
import com.xrs.fooddelivery.payment.entity.Payment;
import com.xrs.fooddelivery.payment.entity.PaymentItem;
import com.xrs.fooddelivery.payment.exception.PaymentNotFoundException;
import com.xrs.fooddelivery.payment.exception.PaymentProcessingException;
import com.xrs.fooddelivery.payment.kafka.PaymentEventProducer;
import com.xrs.fooddelivery.payment.merchant.MerchantSyncService;
import com.xrs.fooddelivery.payment.repository.PaymentRepository;
import com.xrs.fooddelivery.payment.service.PaymentService;
import com.xrs.fooddelivery.payment.sharding.ShardingService;
import com.xrs.fooddelivery.payment.webhook.WebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final CardNetworkClient cardNetworkClient;
    private final AuditService auditService;
    private final MerchantSyncService merchantSyncService;
    private final WebhookService webhookService;
    private final PaymentEventProducer paymentEventProducer;
    private final ShardingService shardingService;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest paymentRequest) {
        log.info("Creating payment for orderId: {}, merchantId: {}, customerId: {}",
                paymentRequest.getOrderId(), paymentRequest.getMerchantId(), paymentRequest.getCustomerId());

        // Step 2: Create payment entity with status "new"
        String paymentId = generatePaymentId();
        String shard = shardingService.getShard(paymentId);
        log.info("Payment {} assigned to shard: {}", paymentId, shard);

        Payment payment = Payment.builder()
                .paymentId(paymentId)
                .customerId(paymentRequest.getCustomerId())
                .merchantId(paymentRequest.getMerchantId())
                .orderId(paymentRequest.getOrderId())
                .amount(paymentRequest.getAmount())
                .currency(paymentRequest.getCurrency())
                .status(PaymentStatus.NEW)
                .description(paymentRequest.getDescription())
                .merchantWebhookUrl(paymentRequest.getMerchantWebhookUrl())
                .createdAt(LocalDateTime.now())
                .build();

        // Create payment items
        if (paymentRequest.getItems() != null && !paymentRequest.getItems().isEmpty()) {
            List<PaymentItem> items = paymentRequest.getItems().stream()
                    .map(itemRequest -> PaymentItem.builder()
                            .payment(payment)
                            .itemId(itemRequest.getItemId())
                            .name(itemRequest.getName())
                            .quantity(itemRequest.getQuantity())
                            .price(itemRequest.getPrice())
                            .build())
                    .collect(Collectors.toList());
            payment.setItems(items);
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Send event to merchant webhook
        PaymentResponse response = mapToPaymentResponse(savedPayment);
        webhookService.sendWebhook(paymentRequest.getMerchantWebhookUrl(), response);

        // Store transaction/event to Audit storage
        auditService.logPaymentEvent(paymentId, "PAYMENT_CREATED", savedPayment, "PaymentService");

        // Sync to merchant storage
        merchantSyncService.syncPaymentToMerchantStorage(savedPayment);

        // Publish Kafka event
        paymentEventProducer.publishPaymentCreated(paymentId, response);

        log.info("Payment created successfully with paymentId: {}", paymentId);
        return response;
    }

    @Override
    public PaymentResponse getPaymentById(String paymentId) {
        log.info("Retrieving payment with paymentId: {}", paymentId);
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + paymentId));
        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse initiatePayment(PaymentInitiationRequest request) {
        log.info("Initiating payment for paymentId: {}", request.getPaymentId());

        // Step 3: Customer initiates payment
        Payment payment = paymentRepository.findByPaymentId(request.getPaymentId())
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + request.getPaymentId()));

        if (payment.getStatus() != PaymentStatus.NEW) {
            throw new PaymentProcessingException("Payment is not in NEW status. Current status: " + payment.getStatus());
        }

        // Step 4: Send Authorization request to Card Network
        AuthorizationRequest authRequest = AuthorizationRequest.builder()
                .paymentId(request.getPaymentId())
                .encryptedCardData(request.getEncryptedCardData())
                .cardholderName(request.getCardholderName())
                .expiryMonth(request.getExpiryMonth())
                .expiryYear(request.getExpiryYear())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .merchantId(payment.getMerchantId())
                .customerId(payment.getCustomerId())
                .orderId(payment.getOrderId())
                .build();

        AuthorizationResponse authResponse;
        try {
            authResponse = cardNetworkClient.authorize(authRequest);
        } catch (Exception e) {
            log.error("Authorization failed for paymentId: {}", request.getPaymentId(), e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Card network authorization failed: " + e.getMessage());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(payment);
            handlePaymentFailure(payment, response);
            return response;
        }

        // Step 5: Save authorization result and update status
        if (authResponse.isSuccess()) {
            payment.setAuthId(authResponse.getAuthId());
            payment.setStatus(PaymentStatus.AUTHORIZED);
            payment.setUpdatedAt(LocalDateTime.now());
            Payment savedPayment = paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(savedPayment);

            // Send webhook
            webhookService.sendWebhook(payment.getMerchantWebhookUrl(), response);

            // Audit log
            auditService.logPaymentEvent(payment.getPaymentId(), "PAYMENT_AUTHORIZED", savedPayment, "PaymentService");

            // Sync to merchant storage
            merchantSyncService.syncPaymentToMerchantStorage(savedPayment);

            // Publish Kafka event
            paymentEventProducer.publishPaymentAuthorized(payment.getPaymentId(), response);

            log.info("Payment authorized successfully with authId: {}", authResponse.getAuthId());

            // Step 6: Send Capture request (can be done synchronously or asynchronously)
            return capturePayment(payment.getPaymentId());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(authResponse.getMessage());
            payment.setUpdatedAt(LocalDateTime.now());
            Payment savedPayment = paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(savedPayment);
            handlePaymentFailure(savedPayment, response);
            return response;
        }
    }

    @Override
    @Transactional
    public PaymentResponse capturePayment(String paymentId) {
        log.info("Capturing payment for paymentId: {}", paymentId);

        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getStatus() != PaymentStatus.AUTHORIZED) {
            throw new PaymentProcessingException("Payment is not in AUTHORIZED status. Current status: " + payment.getStatus());
        }

        // Step 6: Send Capture request to Card Network
        CaptureRequest captureRequest = CaptureRequest.builder()
                .paymentId(paymentId)
                .authId(payment.getAuthId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .merchantId(payment.getMerchantId())
                .build();

        CaptureResponse captureResponse;
        try {
            captureResponse = cardNetworkClient.capture(captureRequest);
        } catch (Exception e) {
            log.error("Capture failed for paymentId: {}", paymentId, e);
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Card network capture failed: " + e.getMessage());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(payment);
            handlePaymentFailure(payment, response);
            return response;
        }

        // Step 7: Save Captured status
        if (captureResponse.isSuccess()) {
            payment.setCaptureId(captureResponse.getCaptureId());
            payment.setStatus(PaymentStatus.CAPTURED);
            payment.setUpdatedAt(LocalDateTime.now());
            Payment savedPayment = paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(savedPayment);

            // Send webhook
            webhookService.sendWebhook(payment.getMerchantWebhookUrl(), response);

            // Audit log
            auditService.logPaymentEvent(payment.getPaymentId(), "PAYMENT_CAPTURED", savedPayment, "PaymentService");

            // Sync to merchant storage
            merchantSyncService.syncPaymentToMerchantStorage(savedPayment);

            // Publish Kafka event
            paymentEventProducer.publishPaymentCaptured(payment.getPaymentId(), response);

            log.info("Payment captured successfully with captureId: {}", captureResponse.getCaptureId());
            return response;
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(captureResponse.getMessage());
            payment.setUpdatedAt(LocalDateTime.now());
            Payment savedPayment = paymentRepository.save(payment);

            PaymentResponse response = mapToPaymentResponse(savedPayment);
            handlePaymentFailure(savedPayment, response);
            return response;
        }
    }

    @Override
    public List<PaymentResponse> getPaymentsByMerchantId(Long merchantId) {
        log.info("Retrieving payments for merchantId: {}", merchantId);
        List<Payment> payments = paymentRepository.findByMerchantId(merchantId);
        return payments.stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getPaymentsByCustomerId(Long customerId) {
        log.info("Retrieving payments for customerId: {}", customerId);
        List<Payment> payments = paymentRepository.findByCustomerId(customerId);
        return payments.stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    private void handlePaymentFailure(Payment payment, PaymentResponse response) {
        // Send webhook
        webhookService.sendWebhook(payment.getMerchantWebhookUrl(), response);

        // Audit log
        auditService.logPaymentEvent(payment.getPaymentId(), "PAYMENT_FAILED", payment, "PaymentService");

        // Sync to merchant storage
        merchantSyncService.syncPaymentToMerchantStorage(payment);

        // Publish Kafka event
        paymentEventProducer.publishPaymentFailed(payment.getPaymentId(), response);
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        List<PaymentResponse.PaymentItem> items = null;
        if (payment.getItems() != null) {
            items = payment.getItems().stream()
                    .map(item -> PaymentResponse.PaymentItem.builder()
                            .itemId(item.getItemId())
                            .name(item.getName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build())
                    .collect(Collectors.toList());
        }

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .customerId(payment.getCustomerId())
                .merchantId(payment.getMerchantId())
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
                .items(items)
                .build();
    }

    private String generatePaymentId() {
        return "PAY-" + UUID.randomUUID().toString().replace("-", "").toUpperCase();
    }
}
