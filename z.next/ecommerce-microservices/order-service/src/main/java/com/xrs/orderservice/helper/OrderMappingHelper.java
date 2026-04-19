package com.xrs.orderservice.helper;

import com.xrs.orderservice.dto.order.CartDto;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.dto.product.ProductDto;
import com.xrs.orderservice.entity.Cart;
import com.xrs.orderservice.entity.Order;

public interface OrderMappingHelper {
    static OrderDto map(Order order) {
        if (order == null) return null;
        return new OrderDto(
                order.getOrderId(),
                order.getOrderDate(),
                order.getOrderDesc(),
                order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0,
                !order.getItems().isEmpty() ? order.getItems().get(0).getProductId() : null,
                null, // productDto
                order.getCart() != null ? new CartDto(
                        order.getCart().getCartId(),
                        order.getCart().getUserId(),
                        null, // orderDtos
                        null  // userDto
                ) : null
        );
    }

    static Order map(final OrderDto orderDto) {
        if (orderDto == null) return null;
        return Order.builder()
                .orderId(orderDto.orderId())
                .orderDate(orderDto.orderDate())
                .orderDesc(orderDto.orderDesc())
                // Note: totalAmount will be calculated when items are added
                .cart(orderDto.cartDto() != null ? Cart.builder()
                        .cartId(orderDto.cartDto().cartId())
                        .userId(orderDto.cartDto().userId())
                        .build() : null)
                .build();
    }
}
