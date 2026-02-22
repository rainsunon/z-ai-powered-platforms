package com.xrs.gateway.payments.repo;

import com.xrs.gateway.payments.domain.Payment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for {@link Payment}.
 */
public interface PaymentRepository extends JpaRepository<Payment, String> {

    /**
     * Finds payment by idempotency key.
     *
     * @param idempotencyKey key
     * @return payment
     */
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
}
