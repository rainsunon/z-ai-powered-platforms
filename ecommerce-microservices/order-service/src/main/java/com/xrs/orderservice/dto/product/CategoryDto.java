package com.xrs.orderservice.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Set;

public record CategoryDto(
    Integer categoryId,
    String categoryTitle,
    String imageUrl,
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Set<CategoryDto> subCategoriesDtos,
    
    @JsonProperty("parentCategory")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    CategoryDto parentCategoryDto,
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Set<ProductDto> productDtos
) implements Serializable {
}
