package com.xrs.gateway.payments.service;

import com.xrs.gateway.payments.domain.Payment;
import com.xrs.gateway.payments.web.dto.ChargeRequest;

/**
 * Abstraction over an external payment provider (PSP).
 *
 * <p>This demo uses a deterministic implementation ({@link StubPaymentProcessor}).</p>
 */
public interface PaymentProcessor {

    /**
     * Performs the charge/authorization with an external PSP and returns the created payment entity.
     *
     * @param idempotencyKey idempotency key
     * @param request request
     * @return payment
     */
    Payment authorize(String idempotencyKey, ChargeRequest request);
}
