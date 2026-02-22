package com.xrs.fooddelivery.order.service;

import com.xrs.fooddelivery.order.dto.OrderRequest;
import com.xrs.fooddelivery.order.entity.Order;

public interface OrderService {
    Order createOrder(OrderRequest orderRequest);
    Order getOrderById(Long orderId);
}
