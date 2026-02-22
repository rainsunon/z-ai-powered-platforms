package com.xrs.paymentservice.dto;

import java.io.Serializable;

public record ProductDto(
    Integer productId,
    String productTitle,
    String imageUrl,
    String sku,
    Double priceUnit,
    Integer quantity
) implements Serializable {
}
