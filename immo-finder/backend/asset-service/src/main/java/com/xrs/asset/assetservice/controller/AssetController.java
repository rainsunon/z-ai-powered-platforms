package com.xrs.asset.assetservice.controller;

import com.xrs.asset.assetservice.service.AssetAssignmentService;
import com.xrs.asset.assetservice.service.AssetService;
import com.xrs.asset.assetservice.service.AssetTypeService;
import com.xrs.asset.assetservice.service.CategoryService;
import jakarta.validation.Valid;
import com.xrs.assetmanagementsystem.dto.AssetDto;
import com.xrs.assetmanagementsystem.dto.AssetRequestDto;
import com.xrs.assetmanagementsystem.dto.AssignedAssetFilterDTO;
import com.xrs.assetmanagementsystem.dto.ListAssetDTO;
import com.xrs.assetmanagementsystem.entity.AssetCategory;
import com.xrs.assetmanagementsystem.entity.AssetType;
import com.xrs.assetmanagementsystem.assetservice.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetAssignmentService assetAssignmentService;
    private final AssetService assetService;
    private final AssetTypeService typeService;
    private final CategoryService categoryService;

    public AssetController(AssetService assetService, AssetTypeService typeService, CategoryService categoryService, AssetAssignmentService assetAssignmentService) {
        this.assetService = assetService;
        this.typeService = typeService;
        this.categoryService = categoryService;
        this.assetAssignmentService = assetAssignmentService;
    }
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetDto> addAsset(@Valid @RequestBody AssetRequestDto assetRequestDto) {
        AssetDto dto = assetService.addAsset(assetRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetDto> updateAsset(@PathVariable Long id, @Valid @RequestBody UpdateAssetDto Dto) {
        AssetDto dto = assetService.updateAsset(id, Dto);
        return ResponseEntity.ok(dto);
    }



    @GetMapping("/types")
    public List<AssetType> getAllTypes(
            @RequestParam(required = false) Long categoryId

    ) {
        return typeService.getAllTypes(categoryId);
    }

    @PostMapping("/types")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetType> createType(@Valid @RequestBody com.xrs.assetmanagementsystem.dto.TypeDto typeDto) {
        AssetType type = typeService.createType(typeDto);
        return ResponseEntity.<AssetType>status(HttpStatus.CREATED).body(type);
    }

    @PutMapping("/types/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AssetType> updateType(@PathVariable Long id, @Valid @RequestBody com.xrs.assetmanagementsystem.dto.TypeDto typeDto) {
        AssetType type = typeService.updateType(id, typeDto);
        return ResponseEntity.ok(type);
    }

    @DeleteMapping("/types/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteType(@PathVariable Long id) {
        typeService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/categories")
    public List<AssetCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<AssetDto>> getAllAssets() {
        List<AssetDto> assets = assetService.getAllAssets();
        return ResponseEntity.ok(assets);
    }


    @GetMapping
    public ResponseEntity<Page<ListAssetDTO>> getFilteredAsset(AssignedAssetFilterDTO filterDTO, Pageable pageable) {
        Page<ListAssetDTO> assets = assetService.getFilteredAsset(filterDTO, pageable);
        return ResponseEntity.ok(assets);
    }
    @GetMapping("/available")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('IT')")
    public List<AssetDto> getAvailableAsset(
            @RequestParam(required = false) String type
    ) {
        return assetService.getAvailableAsset(type);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<AssetDetailsDto> getAssetDetails(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetDetails(id));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('IT')")
    public ResponseEntity<Map<String, String>> assignAsset(
            @Valid  @RequestBody AssetAssignmentRequest request
    ) {
        assetAssignmentService.assignAsset(request);
        return ResponseEntity.ok(Map.of("message", "Asset Assigned Successfully"));
    }

    @DeleteMapping("/assign/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('IT')")
    public ResponseEntity<Map<String, String>> unassignAsset(@PathVariable Long id) {
        assetAssignmentService.unassignAsset(id);
        return ResponseEntity.ok(Map.of("message", "Asset Unassigned Successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}

