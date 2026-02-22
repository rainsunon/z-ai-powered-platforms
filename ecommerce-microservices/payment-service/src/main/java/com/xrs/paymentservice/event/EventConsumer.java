package com.xrs.paymentservice.event;


import com.google.gson.Gson;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.entity.PaymentStatus;
import com.xrs.paymentservice.event.dto.*;
import com.xrs.paymentservice.repository.PaymentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventConsumer {

    private final ReceiverOptions<String, String> receiverOptions;
    private final PaymentRepository paymentRepository;
    private final EventProducer eventProducer;
    private final Gson gson = new Gson();

    private static final String PROCESS_PAYMENT_TOPIC = "payment.process.request";
    private static final String REFUND_PAYMENT_TOPIC = "payment.refund.request";
    private static final String PAYMENT_COMPLETED_TOPIC = "payment.completed";
    private static final String PAYMENT_FAILED_TOPIC = "payment.failed";

    @PostConstruct
    public void init() {
        subscribeToProcessPayment();
        subscribeToRefundPayment();
    }

    private void subscribeToProcessPayment() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton(PROCESS_PAYMENT_TOPIC)))
                .receive()
                .subscribe(record -> {
                    try {
                        String message = record.value();
                        log.info("Received process payment request: {}", message);

                        ProcessPaymentRequest request = gson.fromJson(message, ProcessPaymentRequest.class);
                        handleProcessPayment(request);

                        record.receiverOffset().acknowledge();
                    } catch (Exception e) {
                        log.error("Error processing payment request: {}", e.getMessage(), e);
                    }
                });
    }

    private void subscribeToRefundPayment() {
        KafkaReceiver.create(receiverOptions.subscription(Collections.singleton(REFUND_PAYMENT_TOPIC)))
                .receive()
                .subscribe(record -> {
                    try {
                        String message = record.value();
                        log.info("Received refund payment request: {}", message);

                        RefundPaymentRequest request = gson.fromJson(message, RefundPaymentRequest.class);
                        handleRefundPayment(request);

                        record.receiverOffset().acknowledge();
                    } catch (Exception e) {
                        log.error("Error processing refund request: {}", e.getMessage(), e);
                    }
                });
    }

    private void handleProcessPayment(ProcessPaymentRequest request) {
        try {
            log.info("Processing payment for order {}", request.orderId());

            // Simulate payment processing (in production, integrate with payment gateway)
            boolean paymentSuccess = processPaymentWithGateway(request);

            if (paymentSuccess) {
                // Create payment record
                Payment payment = Payment.builder()
                        .orderId(request.orderId())
                        .userId(request.userId())
                        .isPayed(true)
                        .paymentStatus(PaymentStatus.COMPLETED)
                        .build();

                payment = paymentRepository.save(payment);

                // Publish success event
                PaymentCompletedEvent event = new PaymentCompletedEvent(
                        UUID.randomUUID().toString(),
                        request.orderId(),
                        payment.getPaymentId(),
                        request.amount(),
                        UUID.randomUUID().toString(), // Transaction ID
                        LocalDateTime.now()
                );

                String eventJson = gson.toJson(event);
                eventProducer.send(PAYMENT_COMPLETED_TOPIC, eventJson).subscribe();

                log.info("Payment completed for order {}", request.orderId());
            } else {
                // Publish failure event
                publishPaymentFailed(request.orderId(), "Payment gateway declined");
                log.warn("Payment failed for order {}", request.orderId());
            }
        } catch (Exception e) {
            log.error("Error processing payment for order {}: {}", request.orderId(), e.getMessage(), e);
            publishPaymentFailed(request.orderId(), e.getMessage());
        }
    }

    private void handleRefundPayment(RefundPaymentRequest request) {
        try {
            log.info("Processing refund for order {} (compensation)", request.orderId());

            // Find payment record
            Payment payment = paymentRepository.findByOrderId(request.orderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found for order: " + request.orderId()));

            // Process refund (in production, integrate with payment gateway)
            boolean refundSuccess = processRefundWithGateway(payment);

            if (refundSuccess) {
                // Update payment status
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);

                log.info("Successfully refunded payment for order {}", request.orderId());
            } else {
                log.error("Failed to refund payment for order {}", request.orderId());
            }
        } catch (Exception e) {
            log.error("Error refunding payment for order {}: {}", request.orderId(), e.getMessage(), e);
        }
    }

    /**
     * Simulate payment gateway processing
     * In production, integrate with Stripe, PayPal, etc.
     */
    private boolean processPaymentWithGateway(ProcessPaymentRequest request) {
        // Simulate success (90% success rate)
        return Math.random() > 0.1;
    }

    /**
     * Simulate refund processing
     */
    private boolean processRefundWithGateway(Payment payment) {
        // Simulate success
        return true;
    }

    private void publishPaymentFailed(Integer orderId, String reason) {
        try {
            PaymentFailedEvent event = new PaymentFailedEvent(
                    UUID.randomUUID().toString(),
                    orderId,
                    reason,
                    LocalDateTime.now()
            );

            String eventJson = gson.toJson(event);
            eventProducer.send(PAYMENT_FAILED_TOPIC, eventJson).subscribe();
        } catch (Exception e) {
            log.error("Failed to publish payment failed event: {}", e.getMessage(), e);
        }
    }
}