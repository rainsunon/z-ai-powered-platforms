package com.xrs.shippingservice.helper;

import com.xrs.shippingservice.domain.OrderItem;
import com.xrs.shippingservice.dto.OrderDto;
import com.xrs.shippingservice.dto.OrderItemDto;
import com.xrs.shippingservice.dto.ProductDto;

public interface OrderItemMappingHelper {

    static OrderItemDto map(final OrderItem orderItem) {
        return OrderItemDto.builder()
                .productId(orderItem.getProductId())
                .orderId(orderItem.getOrderId())
                .orderedQuantity(orderItem.getOrderedQuantity())
                .productDto(
                        ProductDto.builder()
                                .productId(orderItem.getProductId())
                                .build())
                .orderDto(
                        OrderDto.builder()
                                .orderId(orderItem.getOrderId())
                                .build())
                .build();
    }

    static OrderItem map(final OrderItemDto orderItemDto) {
        return OrderItem.builder()
                .productId(orderItemDto.getProductId())
                .orderId(orderItemDto.getOrderId())
                .orderedQuantity(orderItemDto.getOrderedQuantity())
                .build();
    }

}