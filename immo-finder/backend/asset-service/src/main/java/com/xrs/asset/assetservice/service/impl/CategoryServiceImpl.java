package com.xrs.asset.assetservice.service.impl;

import com.xrs.assetmanagementsystem.dto.CategoryDto;
import com.xrs.assetmanagementsystem.entity.AssetCategory;
import com.xrs.asset.assetservice.repository.CategoryRepository;
import com.xrs.asset.assetservice.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<AssetCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public AssetCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public AssetCategory createCategory(CategoryDto categoryDto) {
        if (categoryRepository.findByName(categoryDto.getName()) != null) {
            throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        AssetCategory category = new AssetCategory();
        category.setName(categoryDto.getName());
        
        return categoryRepository.save(category);
    }

    @Override
    public AssetCategory updateCategory(Long id, CategoryDto categoryDto) {
        AssetCategory category = getCategoryById(id);
        
        // Check if name is being changed and if new name already exists
        if (!category.getName().equals(categoryDto.getName())) {
            AssetCategory existingCategory = categoryRepository.findByName(categoryDto.getName());
            if (existingCategory != null && !existingCategory.getId().equals(id)) {
                throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
            }
        }
        
        category.setName(categoryDto.getName());
        
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        AssetCategory category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
