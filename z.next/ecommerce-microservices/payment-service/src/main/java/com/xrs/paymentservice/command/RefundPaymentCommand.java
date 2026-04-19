package com.xrs.paymentservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

/**
 * Command to refund a payment.
 * Implements CQRS pattern for write operations.
 */
public record RefundPaymentCommand(
    String commandId,
    String paymentId,
    String reason
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "RefundPayment";
    }

    @Override
    public void validate() {
        if (paymentId == null || paymentId.isBlank()) {
            throw new IllegalArgumentException("Payment ID cannot be null or blank");
        }
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Reason cannot be null or blank");
        }
    }

    /**
     * Handler for RefundPaymentCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class RefundPaymentHandler implements CommandHandler<RefundPaymentCommand, Payment> {
        
        private final PaymentRepository paymentRepository;
        
        @Override
        @Transactional
        public Mono<Payment> handle(RefundPaymentCommand command) {
            log.info("Handling RefundPaymentCommand: {}", command.commandId());
            
            // Find payment
            Payment payment = paymentRepository.findByPaymentId(command.paymentId())
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + command.paymentId()));
            
            // Update payment status
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            
            log.info("Payment refunded successfully: {}", command.paymentId());
            
            return Mono.just(payment);
        }
    }
}
