package com.xrs.paymentservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.paymentservice.dto.PaymentDto;
import com.xrs.paymentservice.entity.Payment;
import com.xrs.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Query to list all payments.
 * Implements CQRS pattern for read operations.
 */
public record ListPaymentsQuery(
    String queryId,
    Long userId,
    Integer orderId
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "ListPayments";
    }

    @Override
    public void validate() {
        // No validation needed
    }

    /**
     * Handler for ListPaymentsQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ListPaymentsHandler implements QueryHandler<ListPaymentsQuery, List<PaymentDto>> {
        
        private final PaymentRepository paymentRepository;
        
        @Override
        public Mono<List<PaymentDto>> handle(ListPaymentsQuery query) {
            log.info("Handling ListPaymentsQuery: {}", query.queryId());
            
            // Find payments
            List<Payment> payments;
            if (query.userId() != null && query.orderId() != null) {
                payments = paymentRepository.findByUserIdAndOrderId(query.userId(), query.orderId());
            } else if (query.userId() != null) {
                payments = paymentRepository.findByUserId(query.userId());
            } else if (query.orderId() != null) {
                payments = paymentRepository.findByOrderId(query.orderId());
            } else {
                payments = paymentRepository.findAll();
            }
            
            log.info("Found {} payments", payments.size());
            
            // Return payment DTOs
            List<PaymentDto> paymentDtos = payments.stream()
                    .map(com.xrs.paymentservice.helper.PaymentMappingHelper::map)
                    .toList();
            
            return Mono.just(paymentDtos);
        }
    }
}
