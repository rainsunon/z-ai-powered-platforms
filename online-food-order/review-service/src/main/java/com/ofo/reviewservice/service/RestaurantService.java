package com.ofo.reviewservice.service;

public interface RestaurantService {

	public void updateRating(String authToken, String restaurantId, String userRating);

}
