package com.distributedtransactions.orderservice.repository;

import com.distributedtransactions.orderservice.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, String> {
}
