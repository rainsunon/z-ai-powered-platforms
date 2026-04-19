package com.xrs.orderservice.helper;

import com.xrs.orderservice.dto.order.CartDto;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.dto.user.UserDto;
import com.xrs.orderservice.entity.Cart;
import com.xrs.orderservice.entity.Order;

import java.util.Set;
import java.util.stream.Collectors;

public interface CartMappingHelper {
    static CartDto map( Cart cart) {
        if (cart == null) return null;
        return new CartDto(
                cart.getCartId(),
                cart.getUserId(),
                cart.getOrders()
                        .stream()
                        .map(order -> new OrderDto(
                                order.getOrderId(),
                                order.getOrderDate(),
                                order.getOrderDesc(),
                                order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0,
                                !order.getItems().isEmpty() ? order.getItems().get(0).getProductId() : null,
                                null, // productDto
                                null  // cartDto
                        ))
                        .collect(Collectors.toSet()),
                new UserDto(
                        cart.getUserId(),
                        null, // fullname
                        null, // username
                        null, // email
                        null, // gender
                        null, // phone
                        null  // avatar
                )
        );
    }

    static Cart map(final CartDto cartDto) {
        if (cartDto == null) return null;
        Set<Order> orders = cartDto.orderDtos() != null ? cartDto.orderDtos()
                .stream()
                .map(orderDto -> Order.builder()
                        .orderId(orderDto.orderId())
                        .orderDate(orderDto.orderDate())
                        .orderDesc(orderDto.orderDesc())
                        // Note: totalAmount will be calculated when items are added
                        .build())
                .collect(Collectors.toSet()) : Set.of();
        
        return Cart.builder()
                .cartId(cartDto.cartId())
                .userId(cartDto.userId())
                .orders(orders)
                .build();
    }
}

