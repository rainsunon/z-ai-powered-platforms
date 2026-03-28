package com.ofo.orderservice.dal;
import java.util.List;

import com.ofo.orderservice.model.Order;

/**
 * This interface extends the MongoRepository to perform the CRUD operations on PrescriptionRepository
 *
 */
public interface OrderDAL {
	public Order getOrderbyId(String orderId);

	public Order saveOrder(Order order);

	public List<Order> getOrderbyUserId(String userId);

	public List<Order> getOrderbyRestaurantId(String restaurantId);

	public Order updateOrder(Order _order);
}
