package com.xrs.bffservice.dto;

import java.io.Serializable;
import java.util.List;

/**
 * Product catalog with category and availability information
 */
public record ProductCatalogDto(
    List<ProductSummaryDto> products,
    Object category,
    Integer totalProducts
) implements Serializable {
}
