package com.ofo.searchservice.service;

import java.util.List;
import java.util.Map;

import com.ofo.searchservice.model.Restaurant;

public interface SearchService {

	Restaurant getRestaurantById(String restaurantId);

	List<Restaurant> searchRestaurants(Map<String, String> allParamse);

}
