package com.xrs.shippingservice.repository;

import com.xrs.shippingservice.domain.OrderItem;
import com.xrs.shippingservice.domain.id.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {

}