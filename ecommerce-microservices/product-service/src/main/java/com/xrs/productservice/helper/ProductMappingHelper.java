package com.xrs.productservice.helper;

import com.xrs.productservice.entity.Category;
import com.xrs.productservice.entity.Product;
import com.xrs.productservice.dto.CategoryDto;
import com.xrs.productservice.dto.ProductDto;

public interface ProductMappingHelper {
    static ProductDto map(final Product product) {
        return new ProductDto(
                product.getProductId(),
                product.getProductTitle(),
                product.getImageUrl(),
                product.getSku(),
                product.getPriceUnit(),
                product.getQuantity(),
                new CategoryDto(
                        product.getCategory().getCategoryId(),
                        product.getCategory().getCategoryTitle(),
                        product.getCategory().getImageUrl(),
                        null, // subCategoriesDtos
                        null, // parentCategoryDto
                        null  // productDtos
                )
        );
    }

    static Product map(final ProductDto productDto) {
        return Product.builder()
                .productId(productDto.productId())
                .productTitle(productDto.productTitle())
                .imageUrl(productDto.imageUrl())
                .sku(productDto.sku())
                .priceUnit(productDto.priceUnit())
                .quantity(productDto.quantity())
                .category(
                        Category.builder()
                                .categoryId(productDto.categoryDto().categoryId())
                                .categoryTitle(productDto.categoryDto().categoryTitle())
                                .imageUrl(productDto.categoryDto().imageUrl())
                                .build())
                .build();
    }

}
