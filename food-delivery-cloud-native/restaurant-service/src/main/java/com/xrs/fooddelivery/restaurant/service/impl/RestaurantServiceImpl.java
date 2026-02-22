package com.xrs.fooddelivery.restaurant.service.impl;

import com.xrs.fooddelivery.common.dto.RestaurantDTO;
import com.xrs.fooddelivery.common.exception.ResourceNotFoundException;
import com.xrs.fooddelivery.restaurant.common.RestaurantMapper;
import com.xrs.fooddelivery.restaurant.entity.Restaurant;
import com.xrs.fooddelivery.restaurant.repository.RestaurantRepository;
import com.xrs.fooddelivery.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    private final RestaurantMapper restaurantMapper;

    @Override
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = restaurantMapper.toEntity(restaurantDTO);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return restaurantMapper.toDTO(savedRestaurant);
    }

    @Override
    public List<RestaurantDTO> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();

        return restaurantMapper.toDTOList(restaurants);
    }

    @Override
    public RestaurantDTO getRestaurantById(Long id) {
        Restaurant restaurant = findById(id);
        return restaurantMapper.toDTO(restaurant);
    }

    @Override
    public RestaurantDTO updateRestaurantById(Long id, RestaurantDTO restaurantDTO) {
        Restaurant restaurant = findById(id);
        restaurantMapper.updateRestaurantFromDTO(restaurantDTO, restaurant);

        return restaurantMapper.toDTO(restaurantRepository.save(restaurant));
    }

    @Override
    public void deleteRestaurantById(Long id) {
        boolean exists = restaurantRepository.existsById(id);
        if (!exists) {
            throw new ResourceNotFoundException("Restaurant is not found with ID: " + id);
        }

        restaurantRepository.deleteById(id);
    }

    @Override
    public List<RestaurantDTO> searchRestaurants(String city, String menuItem) {
        return restaurantMapper.toDTOList(restaurantRepository.searchByCityAndMenuItem(city, menuItem));
    }

    private Restaurant findById(Long id) {
        return restaurantRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Restaurant is not found with ID: " + id));
    }
}
