package com.xrs.fooddelivery.common.dto;

import lombok.Data;

@Data
public class OrderItem {

    private Long menuItem;

    private Integer quantity;
}
