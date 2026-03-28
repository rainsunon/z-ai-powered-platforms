package com.ofo.orderservice.service;

import java.util.List;

import com.ofo.orderservice.model.Order;

public interface OrderService {

	Order getOrderbyId(String orderId);

	Order saveOrder(Order order);

	List<Order> getOrderbyUserId(String userId);

	List<Order> getOrderbyRestaurantId(String restaurantId);

	Order updateOrder(Order _order);

}
