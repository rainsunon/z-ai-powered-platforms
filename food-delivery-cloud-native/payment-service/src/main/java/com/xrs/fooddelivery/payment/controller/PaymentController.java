package com.xrs.fooddelivery.payment.controller;

import com.xrs.fooddelivery.payment.dto.PaymentInitiationRequest;
import com.xrs.fooddelivery.payment.dto.PaymentRequest;
import com.xrs.fooddelivery.payment.dto.PaymentResponse;
import com.xrs.fooddelivery.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment API", description = "APIs for managing payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @Operation(summary = "Create a new payment", description = "Step 1-2: Create payment entity with status 'new'")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        log.info("POST /api/payments - Creating payment for orderId: {}", paymentRequest.getOrderId());
        PaymentResponse response = paymentService.createPayment(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment by ID", description = "Retrieve payment details by payment ID")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable String paymentId) {
        log.info("GET /api/payments/{} - Retrieving payment", paymentId);
        PaymentResponse response = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/initiate")
    @Operation(summary = "Initiate payment", description = "Step 3-7: Authorize and capture payment")
    public ResponseEntity<PaymentResponse> initiatePayment(
            @PathVariable String paymentId,
            @Valid @RequestBody PaymentInitiationRequest request) {
        log.info("POST /api/payments/{}/initiate - Initiating payment", paymentId);
        PaymentResponse response = paymentService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/capture")
    @Operation(summary = "Capture payment", description = "Step 6-7: Capture authorized payment")
    public ResponseEntity<PaymentResponse> capturePayment(@PathVariable String paymentId) {
        log.info("POST /api/payments/{}/capture - Capturing payment", paymentId);
        PaymentResponse response = paymentService.capturePayment(paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/merchant/{merchantId}")
    @Operation(summary = "Get payments by merchant ID", description = "Retrieve all payments for a merchant")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByMerchantId(@PathVariable Long merchantId) {
        log.info("GET /api/payments/merchant/{} - Retrieving payments for merchant", merchantId);
        List<PaymentResponse> response = paymentService.getPaymentsByMerchantId(merchantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get payments by customer ID", description = "Retrieve all payments for a customer")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCustomerId(@PathVariable Long customerId) {
        log.info("GET /api/payments/customer/{} - Retrieving payments for customer", customerId);
        List<PaymentResponse> response = paymentService.getPaymentsByCustomerId(customerId);
        return ResponseEntity.ok(response);
    }
}
