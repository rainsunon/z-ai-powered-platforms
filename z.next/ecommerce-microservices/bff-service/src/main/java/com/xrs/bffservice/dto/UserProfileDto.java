package com.xrs.bffservice.dto;

import java.io.Serializable;
import java.util.List;

/**
 * Comprehensive user profile with orders and favorites
 */
public record UserProfileDto(
    Long userId,
    String fullname,
    String username,
    String email,
    String phone,
    String avatar,
    List<Object> recentOrders,
    List<Object> favoriteProducts
) implements Serializable {
}
