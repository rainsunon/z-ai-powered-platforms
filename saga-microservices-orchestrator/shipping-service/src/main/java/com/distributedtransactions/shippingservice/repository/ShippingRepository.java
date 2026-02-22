package com.distributedtransactions.shippingservice.repository;

import com.distributedtransactions.shippingservice.domain.ShippingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingRepository extends JpaRepository<ShippingEntity, String> {
}
