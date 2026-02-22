package com.xrs.productservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    CategoryDto categoryDto
) implements Serializable {
}
