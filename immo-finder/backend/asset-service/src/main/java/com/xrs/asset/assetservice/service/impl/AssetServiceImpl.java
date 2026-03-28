package com.xrs.asset.assetservice.service.impl;

import com.xrs.asset.assetservice.repository.AssetRepository;
import com.xrs.asset.assetservice.repository.CategoryRepository;
import com.xrs.asset.assetservice.repository.TypeRepository;
import com.xrs.assetmanagementsystem.errors.ApiReturnCode;
import com.xrs.assetmanagementsystem.exception.BusinessException;
import com.xrs.assetmanagementsystem.mapper.AssetMapper;
import com.xrs.assetmanagementsystem.mapper.ListAssetDTOMapper;
import com.xrs.assetmanagementsystem.assetservice.repository.*;
import com.xrs.asset.assetservice.service.AssetService;
import com.xrs.assetmanagementsystem.specification.AssetSpecification;
import com.xrs.assetmanagementsystem.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;
    private final ListAssetDTOMapper mapper;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;

    public AssetServiceImpl(AssetRepository assetRepository,
            AssetMapper assetMapper,
            ListAssetDTOMapper listAssetDTOMapper,
            CategoryRepository categoryRepository,
            TypeRepository typeRepository) {

        this.assetRepository = assetRepository;
        this.assetMapper = assetMapper;
        this.mapper = listAssetDTOMapper;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
    }

    @Override
    public AssetDto addAsset(AssetRequestDto assetDto) {

        if (assetRepository.existsBySerialNumber(assetDto.getSerialNumber())) {
            throw new BusinessException(ApiReturnCode.ASSET_ALREADY_EXISTS,
                    "Another asset with this serial number already exists.");
        }

        // Validate category existence
        if (!categoryRepository.existsById(assetDto.getCategoryId())) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found");
        }

        // Validate type existence and related to category
        AssetType type = typeRepository.findById(assetDto.getTypeId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Type not found"));

        if (!type.getCategory().getId().equals(assetDto.getCategoryId())) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Type does not belong to the specified category.");
        }

        // Fetch the related entities for the mapper
        AssetCategory category = categoryRepository.findById(assetDto.getCategoryId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found"));
        Location location = null;
        if (assetDto.getLocationId() != null) {
            // Assuming there's a LocationRepository
            // location = locationRepository.findById(assetDto.getLocationId())...
        }

        Asset asset = assetMapper.toEntity(assetDto, category, type, location);
        Asset savedAsset = assetRepository.save(asset);
        return assetMapper.toDto(savedAsset);
    }

    @Override
    public AssetDto updateAsset(Long id, UpdateAssetDto assetDto) {
        Asset existingAsset = assetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND, "Asset not found"));

        // validation
        validateUpdateAssetDTO(assetDto, existingAsset);

        // Fetch the related entities for the mapper
        AssetCategory category = categoryRepository.findById(assetDto.getCategoryId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found"));
        AssetType type = typeRepository.findById(assetDto.getTypeId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Type not found"));
        Location location = null;
        if (assetDto.getLocationId() != null) {
            // Assuming there's a LocationRepository
            // location = locationRepository.findById(assetDto.getLocationId())...
        }

        Asset assetToUpdate = assetMapper.toEntity(assetDto, category, type, location);

        // set the id to ensure an update not an insert
        assetToUpdate.setId(id);

        Asset updatedAsset = assetRepository.save(assetToUpdate);

        return assetMapper.toDto(updatedAsset);
    }

    private void validateUpdateAssetDTO(UpdateAssetDto assetDto, Asset existingAsset) {
        // Validate serial number
        if (assetDto.getSerialNumber() != null && !assetDto.getSerialNumber().equals(existingAsset.getSerialNumber())) {
            if (assetRepository.existsBySerialNumber(assetDto.getSerialNumber())) {
                throw new BusinessException(ApiReturnCode.ASSET_ALREADY_EXISTS,
                        "Another asset with this serial number already exists.");
            }
        }

        // Validate category existence
        if (!categoryRepository.existsById(assetDto.getCategoryId())) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Category not found");
        }

        // Validate type existence and related to category
        AssetType type = typeRepository.findById(assetDto.getTypeId())
                .orElseThrow(() -> new BusinessException(ApiReturnCode.BAD_REQUEST, "Type not found"));

        if (!type.getCategory().getId().equals(assetDto.getCategoryId())) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST, "Type does not belong to the specified category.");
        }
    }

    @Override
    public Page<ListAssetDTO> getFilteredAsset(AssignedAssetFilterDTO filterDTO, Pageable pageable) {
        Specification<Asset> spec = AssetSpecification.buildSpecification(filterDTO,
                SecurityUtils.getCurrentUser());
        Page<Asset> assets = assetRepository.findAll(spec, pageable);
        return assets.map(mapper::toDto);
    }

    @Override
    public List<AssetDto> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(AssetMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssetDto> getAvailableAsset(String type) {
        Specification<Asset> spec = AssetSpecification.availableByType(type);
        List<Asset> availableAssets = assetRepository.findAll(spec);
        return assetMapper.toDtoList(availableAssets);
    }

    @Override
    public AssetDetailsDto getAssetDetails(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND,
                        "Asset not found with id " + id));

        return assetMapper.toDetailsDto(asset);
    }

    @Override
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiReturnCode.ASSET_NOT_FOUND,
                        "Asset not found with id " + id));

        // Check if asset is assigned - if so, don't allow deletion
        if (asset.getAssignments() != null && !asset.getAssignments().isEmpty()) {
            throw new BusinessException(ApiReturnCode.BAD_REQUEST,
                    "Cannot delete assigned asset. Please unassign it first.");
        }

        assetRepository.delete(asset);
    }
}
