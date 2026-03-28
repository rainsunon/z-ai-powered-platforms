package com.xrs.asset.assetservice.service;

import com.xrs.assetmanagementsystem.dto.CategoryDto;
import com.xrs.assetmanagementsystem.entity.AssetCategory;

import java.util.List;

public interface CategoryService {
    List<AssetCategory> getAllCategories();
    AssetCategory getCategoryById(Long id);
    AssetCategory createCategory(CategoryDto categoryDto);
    AssetCategory updateCategory(Long id, CategoryDto categoryDto);
    void deleteCategory(Long id);
}
