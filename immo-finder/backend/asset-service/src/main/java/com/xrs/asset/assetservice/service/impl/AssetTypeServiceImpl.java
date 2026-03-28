package com.xrs.asset.assetservice.service.impl;

import com.xrs.assetmanagementsystem.dto.TypeDto;
import com.xrs.assetmanagementsystem.entity.AssetCategory;
import com.xrs.assetmanagementsystem.entity.AssetType;
import com.xrs.assetmanagementsystem.errors.ApiReturnCode;
import com.xrs.assetmanagementsystem.exception.BusinessException;
import com.xrs.asset.assetservice.repository.CategoryRepository;
import com.xrs.asset.assetservice.repository.TypeRepository;
import com.xrs.asset.assetservice.service.AssetTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class AssetTypeServiceImpl implements AssetTypeService {

    private final TypeRepository typeRepository;
    private final CategoryRepository categoryRepository;

    public AssetTypeServiceImpl(TypeRepository typeRepository, CategoryRepository categoryRepository) {
        this.typeRepository = typeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<AssetType> getAllTypes(Long categoryId) {
        return (categoryId == null)
                ? typeRepository.findAll()
                : typeRepository.findByCategory_Id(categoryId);
    }

    @Override
    public AssetType createType(TypeDto typeDto) {
        // Check if type with same name already exists
        if (typeRepository.findByName(typeDto.getName()) != null) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Type with name " + typeDto.getName() + " already exists.");
        }

        // Validate category exists
        AssetCategory category = categoryRepository.findById(typeDto.getCategoryId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found with id: " + typeDto.getCategoryId()));

        AssetType type = new AssetType();
        type.setName(typeDto.getName());
        type.setCategory(category);
        return typeRepository.save(type);
    }

    @Override
    public AssetType updateType(Long id, TypeDto typeDto) {
        AssetType existingType = typeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Type not found with id: " + id));

        // Check if another type with same name exists (excluding current type)
        AssetType typeWithSameName = typeRepository.findByName(typeDto.getName());
        if (typeWithSameName != null && !typeWithSameName.getId().equals(id)) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Type with name " + typeDto.getName() + " already exists.");
        }

        // Validate category exists
        AssetCategory category = categoryRepository.findById(typeDto.getCategoryId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found with id: " + typeDto.getCategoryId()));

        existingType.setName(typeDto.getName());
        existingType.setCategory(category);
        return typeRepository.save(existingType);
    }

    @Override
    public void deleteType(Long id) {
        if (!typeRepository.existsById(id)) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Type not found with id: " + id);
        }
        typeRepository.deleteById(id);
    }

}
