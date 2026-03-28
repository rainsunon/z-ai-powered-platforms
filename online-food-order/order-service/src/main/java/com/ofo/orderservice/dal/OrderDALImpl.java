package com.ofo.orderservice.dal;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.ofo.orderservice.model.Order;

@Repository
public class OrderDALImpl implements OrderDAL {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Override
	public Order getOrderbyId(String orderId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("orderId").is(orderId));
		return mongoTemplate.findOne(query, Order.class);
	}

	@Override
	public Order saveOrder(Order order) {
		Order _order = mongoTemplate.save(order);
		return _order;
	}

	@Override
	public List<Order> getOrderbyUserId(String userId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId));;
		return mongoTemplate.find(query,Order.class);
	}

	@Override
	public List<Order> getOrderbyRestaurantId(String restaurantId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("restaurantId").is(restaurantId));;
		return mongoTemplate.find(query,Order.class);
	}

	@Override
	public Order updateOrder(Order _order) {
		Order order = mongoTemplate.save(_order);
		return order;
	}

}
