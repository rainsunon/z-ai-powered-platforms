package com.ofo.restaurantservice.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ofo.restaurantservice.dal.RestaurantDAL;
import com.ofo.restaurantservice.model.Restaurant;

/**
 *This service class reaches out to DAL layer to perform CRUD operations on User's object in Mongo DB
 *Reaches to AWS S3 bucket to upload the files and retrieve the file names
 *Sends the asynchronous notification to Kafka topic
 *
 */
@Service
public class RestaurantServiceImpl implements RestaurantService {

	private RestaurantDAL restaurantDAL;

	@Autowired
	public RestaurantServiceImpl(RestaurantDAL restaurantDAL) {
		this.restaurantDAL = restaurantDAL;
	}

	@Override
	public Restaurant getRestaurantById(String restaurantId) {
		Optional<Restaurant> oRestaurant = restaurantDAL.findById(restaurantId);
		return oRestaurant.orElse(null);
	}

	@Override
	public Restaurant saveRestaurant(Restaurant restaurant) {
		return restaurantDAL.insert(restaurant);
	}

	@Override
	public Restaurant updateRestaurant(Restaurant restaurant) {
		return restaurantDAL.save(restaurant);
	}

}
