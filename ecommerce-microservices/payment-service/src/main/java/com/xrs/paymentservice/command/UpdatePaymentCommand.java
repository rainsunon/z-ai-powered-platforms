package com.xrs.paymentservice.command;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.entity.PaymentStatus;
import com.xrs.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

/**
 * Command to update payment status.
 * Implements CQRS pattern for write operations.
 */
public record UpdatePaymentCommand(
    String commandId,
    String paymentId,
    PaymentStatus status
) implements Command {

    @Override
    public String getCommandId() {
        return commandId;
    }

    @Override
    public String getCommandType() {
        return "UpdatePayment";
    }

    @Override
    public void validate() {
        if (paymentId == null || paymentId.isBlank()) {
            throw new IllegalArgumentException("Payment ID cannot be null or blank");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
    }

    /**
     * Handler for UpdatePaymentCommand.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class UpdatePaymentHandler implements CommandHandler<UpdatePaymentCommand, Payment> {
        
        private final PaymentRepository paymentRepository;
        
        @Override
        @Transactional
        public Mono<Payment> handle(UpdatePaymentCommand command) {
            log.info("Handling UpdatePaymentCommand: {}", command.commandId());
            
            // Find payment
            Payment payment = paymentRepository.findByPaymentId(command.paymentId())
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + command.paymentId()));
            
            // Update payment status
            payment.setStatus(command.status());
            paymentRepository.save(payment);
            
            log.info("Payment updated successfully: {}", command.paymentId());
            
            return Mono.just(payment);
        }
    }
}
