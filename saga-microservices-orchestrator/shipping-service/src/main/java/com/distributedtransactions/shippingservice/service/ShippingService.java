package com.distributedtransactions.shippingservice.service;

import com.distributedtransactions.shippingservice.domain.ShippingEntity;
import com.distributedtransactions.shippingservice.repository.ShippingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShippingService {

    private final ShippingRepository shippingRepository;

    @Transactional
    public boolean shipOrder(String orderId) {
        // Simulate shipping logic
        boolean success = Character.getNumericValue(orderId.charAt(orderId.length() - 1)) % 2 == 0;
        ShippingEntity shipping = new ShippingEntity();
        shipping.setOrderId(orderId);
        shipping.setStatus(success ? "SHIPPED" : "FAILED");
        shippingRepository.save(shipping);
        log.info("[ShippingService] Shipping Order ID: {} - Success: {}", orderId, success);
        return success;
    }

    @Transactional
    public void rollbackShipping(String orderId) {
        shippingRepository.findById(orderId).ifPresent(shipping -> {
            shipping.setStatus("ROLLBACK_SHIPPED");
            shippingRepository.save(shipping);
            log.info("[ShippingService] Rolled back shipping for Order ID: {}", orderId);
        });
    }
}
