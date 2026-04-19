package com.xrs.bffservice.dto;

import java.io.Serializable;

/**
 * Aggregated product detail with inventory and rating information
 */
public record ProductDetailDto(
    Integer productId,
    String productTitle,
    String imageUrl,
    String sku,
    Double priceUnit,
    Integer quantity,
    Object categoryDto,
    Boolean inStock,
    Double averageRating,
    Object inventoryDetails,
    Object ratings
) implements Serializable {
}
