package com.ofo.orderservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ofo.orderservice.dal.OrderDAL;
import com.ofo.orderservice.model.Order;

/**
 *This service class reaches out to DAL layer to perform search operations on Restaurant object in Mongo DBc
 *
 */
@Service
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderDAL orderDAL;

	@Override
	public Order getOrderbyId(String orderId) {
		return orderDAL.getOrderbyId(orderId);
	}

	@Override
	public Order saveOrder(Order order) {
		return orderDAL.saveOrder(order);
	}

	@Override
	public List<Order> getOrderbyUserId(String userId) {
		return orderDAL.getOrderbyUserId(userId);
	}

	@Override
	public List<Order> getOrderbyRestaurantId(String restaurantId) {
		return orderDAL.getOrderbyRestaurantId(restaurantId);
	}

	@Override
	public Order updateOrder(Order _order) {
		return orderDAL.updateOrder(_order);
	}

}
