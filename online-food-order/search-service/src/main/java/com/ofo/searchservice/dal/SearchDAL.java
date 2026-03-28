package com.ofo.searchservice.dal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.ofo.searchservice.model.Restaurant;

/**
 * This interface extends the MongoRepository to perform the CRUD operations on PrescriptionRepository
 *
 */
@Repository
public interface SearchDAL {
	public Restaurant getRestaurantById(String restaurantId);
	public List<Restaurant> searchRestaurant(Map<String,String> allParams);
}
