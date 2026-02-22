package com.xrs.paymentservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Command to process a payment.
 * Implements CQRS pattern for write operations.
 */
public record ProcessPaymentCommand(
    String commandId,
    Integer orderId,
    Long userId,
    BigDecimal amount
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "ProcessPayment";
    }

    @Override
    public void validate() {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }

    /**
     * Handler for ProcessPaymentCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ProcessPaymentHandler implements CommandHandler<ProcessPaymentCommand, Payment> {
        
        private final PaymentRepository paymentRepository;
        
        @Override
        @Transactional
        public Mono<Payment> handle(ProcessPaymentCommand command) {
            log.info("Handling ProcessPaymentCommand: {}", command.commandId());
            
            // Create payment
            Payment payment = new Payment();
            payment.setOrderId(command.orderId());
            payment.setUserId(command.userId());
            payment.setAmount(command.amount());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(Payment.PaymentStatus.PENDING);
            
            // Save payment
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("Payment processed successfully: {}", savedPayment.getPaymentId());
            
            return Mono.just(savedPayment);
        }
    }
}
