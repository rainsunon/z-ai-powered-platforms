package com.xrs.fooddelivery.restaurant.service;

import com.xrs.fooddelivery.common.dto.RestaurantDTO;

import java.util.List;

public interface RestaurantService {
    RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO);
    List<RestaurantDTO> getAllRestaurants();
    RestaurantDTO getRestaurantById(Long id);
    RestaurantDTO updateRestaurantById(Long id, RestaurantDTO restaurantDTO);
    void deleteRestaurantById(Long id);
    List<RestaurantDTO> searchRestaurants(String city, String menuItem);
}
