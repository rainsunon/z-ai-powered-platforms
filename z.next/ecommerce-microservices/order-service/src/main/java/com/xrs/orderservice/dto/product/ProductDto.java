package com.xrs.orderservice.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xrs.orderservice.dto.order.OrderDto;

import java.io.Serializable;

public record ProductDto(
    Integer productId,
    String productTitle,
    String imageUrl,
    String sku,
    Double priceUnit,
    Integer quantity,
    
    @JsonProperty("category")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    CategoryDto categoryDto,
    
    @JsonProperty("order")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    OrderDto orderDto
) implements Serializable {
}
