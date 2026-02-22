package com.xrs.bffservice.dto;

import java.io.Serializable;

/**
 * Summary product information for catalog listings
 */
public record ProductSummaryDto(
    Integer productId,
    String productTitle,
    String imageUrl,
    Double priceUnit,
    Boolean inStock,
    Double averageRating
) implements Serializable {
}
