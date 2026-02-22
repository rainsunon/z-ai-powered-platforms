package com.xrs.fooddelivery.restaurant.service;

import com.xrs.fooddelivery.restaurant.dto.MenuItemDTO;

import java.util.List;

public interface MenuItemService {

    MenuItemDTO createMenuItem(MenuItemDTO dto);

    List<MenuItemDTO> getAllMenuItems();

    List<MenuItemDTO> getMenuItemsByRestaurantId(Long restaurantId);

    MenuItemDTO getMenuItemById(Long id);

    MenuItemDTO updateMenuItem(Long id, MenuItemDTO dto);

    void deleteMenuItem(Long id);
}
