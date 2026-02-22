package com.xrs.productservice.helper;

import com.xrs.productservice.entity.Category;
import com.xrs.productservice.dto.CategoryDto;

import java.util.Optional;

public interface CategoryMappingHelper {

    static CategoryDto map(final Category category) {
        final var parentCategory = Optional.ofNullable(category.getParentCategory())
                .orElseGet(Category::new);
        return new CategoryDto(
                category.getCategoryId(),
                category.getCategoryTitle(),
                category.getImageUrl(),
                null, // subCategoriesDtos
                new CategoryDto(
                        parentCategory.getCategoryId(),
                        parentCategory.getCategoryTitle(),
                        parentCategory.getImageUrl(),
                        null,
                        null,
                        null // productDtos
                ),
                null // productDtos
        );
    }

    static Category map(CategoryDto categoryDto) {
        final var parentCategoryDto = Optional.ofNullable(categoryDto.parentCategoryDto())
                .orElse(null);
        return Category.builder()
                .categoryId(categoryDto.categoryId())
                .categoryTitle(categoryDto.categoryTitle())
                .imageUrl(categoryDto.imageUrl())
                .parentCategory(parentCategoryDto != null ? Category.builder()
                        .categoryId(parentCategoryDto.categoryId())
                        .categoryTitle(parentCategoryDto.categoryTitle())
                        .imageUrl(parentCategoryDto.imageUrl())
                        .build() : null)
                .build();
    }

}
