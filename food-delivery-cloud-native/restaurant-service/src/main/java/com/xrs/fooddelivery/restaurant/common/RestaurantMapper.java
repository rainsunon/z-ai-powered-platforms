package com.xrs.fooddelivery.restaurant.common;

import com.xrs.fooddelivery.common.dto.RestaurantDTO;
import com.xrs.fooddelivery.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    RestaurantDTO toDTO(Restaurant restaurant);
    Restaurant toEntity(RestaurantDTO restaurantDTO);

    List<RestaurantDTO> toDTOList(List<Restaurant> restaurants);
    List<Restaurant> toEntityList(List<RestaurantDTO> restaurantDTOs);

    void updateRestaurantFromDTO(RestaurantDTO dto, @MappingTarget Restaurant restaurant);
}
