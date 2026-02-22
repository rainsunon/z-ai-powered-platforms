package com.xrs.paymentservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.paymentservice.dto.PaymentDto;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Query to get payment by ID.
 * Implements CQRS pattern for read operations.
 */
public record GetPaymentQuery(
    String queryId,
    String paymentId
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "GetPayment";
    }

    @Override
    public void validate() {
        if (paymentId == null || paymentId.isBlank()) {
            throw new IllegalArgumentException("Payment ID cannot be null or blank");
        }
    }

    /**
     * Handler for GetPaymentQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class GetPaymentHandler implements QueryHandler<GetPaymentQuery, PaymentDto> {
        
        private final PaymentRepository paymentRepository;
        
        @Override
        public Mono<PaymentDto> handle(GetPaymentQuery query) {
            log.info("Handling GetPaymentQuery: {}", query.queryId());
            
            // Find payment
            Payment payment = paymentRepository.findByPaymentId(query.paymentId())
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + query.paymentId()));
            
            log.info("Payment found: {}", payment.getPaymentId());
            
            // Return payment DTO
            return Mono.just(com.xrs.paymentservice.helper.PaymentMappingHelper.map(payment));
        }
    }
}
