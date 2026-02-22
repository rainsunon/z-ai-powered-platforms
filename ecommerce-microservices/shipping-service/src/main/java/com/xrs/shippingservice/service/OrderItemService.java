package com.xrs.shippingservice.service;

import com.xrs.shippingservice.domain.id.OrderItemId;
import com.xrs.shippingservice.dto.OrderItemDto;

import java.util.List;

public interface OrderItemService {

    List<OrderItemDto> findAll();
    OrderItemDto findById(final OrderItemId orderItemId);
    OrderItemDto save(final OrderItemDto orderItemDto);
    OrderItemDto update(final OrderItemDto orderItemDto);
    void deleteById(final OrderItemId orderItemId);

}