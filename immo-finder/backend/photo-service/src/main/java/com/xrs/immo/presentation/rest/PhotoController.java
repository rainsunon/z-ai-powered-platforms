package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.service.PhotoService;
import com.xrs.immo.domain.model.Photo;
import com.xrs.immo.presentation.dto.CreatePhotoRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
@Tag(name = "Photos", description = "API for managing property photos")
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping
    @Operation(summary = "Add a new photo")
    public ResponseEntity<Photo> addPhoto(@Valid @RequestBody CreatePhotoRequest request) {
        Photo photo = Photo.builder()
                .propertyId(request.getPropertyId())
                .propertyType(request.getPropertyType())
                .url(request.getUrl())
                .altText(request.getAltText())
                .category(request.getCategory())
                .displayOrder(request.getDisplayOrder())
                .isPrimary(request.getIsPrimary())
                .build();
        
        Photo saved = photoService.addPhoto(photo);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a photo")
    public ResponseEntity<Photo> updatePhoto(
            @Parameter(description = "Photo ID") @PathVariable UUID id,
            @Valid @RequestBody CreatePhotoRequest request) {
        Photo photo = Photo.builder()
                .id(id)
                .propertyId(request.getPropertyId())
                .propertyType(request.getPropertyType())
                .url(request.getUrl())
                .altText(request.getAltText())
                .category(request.getCategory())
                .displayOrder(request.getDisplayOrder())
                .isPrimary(request.getIsPrimary())
                .build();
        
        Photo updated = photoService.updatePhoto(photo);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a photo")
    public ResponseEntity<Void> deletePhoto(
            @Parameter(description = "Photo ID") @PathVariable UUID id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/property/{propertyId}")
    @Operation(summary = "Delete all photos for a property")
    public ResponseEntity<Void> deleteAllPhotosForProperty(
            @Parameter(description = "Property ID") @PathVariable String propertyId) {
        photoService.deleteAllPhotosForProperty(propertyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Get all photos for a property")
    public ResponseEntity<List<Photo>> getPhotosByPropertyId(
            @Parameter(description = "Property ID") @PathVariable String propertyId) {
        return ResponseEntity.ok(photoService.getPhotosByPropertyId(propertyId));
    }

    @GetMapping("/property/{propertyId}/type/{propertyType}")
    @Operation(summary = "Get photos for a property by type")
    public ResponseEntity<List<Photo>> getPhotosByPropertyIdAndType(
            @Parameter(description = "Property ID") @PathVariable String propertyId,
            @Parameter(description = "Property type") @PathVariable String propertyType) {
        return ResponseEntity.ok(photoService.getPhotosByPropertyIdAndType(propertyId, propertyType));
    }

    @GetMapping("/property/{propertyId}/category/{category}")
    @Operation(summary = "Get photos for a property by category")
    public ResponseEntity<List<Photo>> getPhotosByPropertyIdAndCategory(
            @Parameter(description = "Property ID") @PathVariable String propertyId,
            @Parameter(description = "Photo category") @PathVariable String category) {
        return ResponseEntity.ok(photoService.getPhotosByPropertyIdAndCategory(propertyId, category));
    }

    @GetMapping("/property/{propertyId}/primary")
    @Operation(summary = "Get the primary photo for a property")
    public ResponseEntity<Photo> getPrimaryPhoto(
            @Parameter(description = "Property ID") @PathVariable String propertyId) {
        return photoService.getPrimaryPhoto(propertyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a photo by ID")
    public ResponseEntity<Photo> getPhotoById(
            @Parameter(description = "Photo ID") @PathVariable UUID id) {
        Photo photo = photoService.getPhotoById(id);
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(photo);
    }
}
