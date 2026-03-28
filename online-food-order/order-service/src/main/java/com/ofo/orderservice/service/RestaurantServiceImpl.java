package com.ofo.orderservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ofo.orderservice.dal.RestaurantDAL;
import com.ofo.orderservice.model.Menu;
import com.ofo.orderservice.model.Restaurant;
/**
 *This service class reaches out to DAL layer to perform search operations on Restaurant object in Mongo DBc
 *
 */
@Service
public class RestaurantServiceImpl implements RestaurantService {

	@Autowired
	private RestaurantDAL restaurantDAL;

	@Override
	public Double getItemPrice(String restaurantId, int itemId) {
		Double itemPrice = 0.0;
		Optional<Restaurant> oRestaurant = restaurantDAL.findById(restaurantId);
		Restaurant _restaurant = oRestaurant.get();
		List<Menu> lMenu = _restaurant.getMenuList();
		
		for(Menu menu:lMenu) {
			if (menu.getItemId() == itemId) {
				itemPrice = Double.parseDouble(menu.getPrice());
			}
		}
		
		return itemPrice;
	}

}
