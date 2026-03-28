package com.xrs.immo.presentation.rest;

import com.xrs.immo.application.service.FavoriteService;
import com.xrs.immo.domain.model.Favorite;
import com.xrs.immo.presentation.dto.CreateFavoriteRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "API for managing user favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    @Operation(summary = "Add a property to favorites")
    public ResponseEntity<Favorite> addFavorite(@Valid @RequestBody CreateFavoriteRequest request) {
        Favorite favorite = Favorite.builder()
                .userId(request.getUserId())
                .propertyId(request.getPropertyId())
                .propertyType(request.getPropertyType())
                .notes(request.getNotes())
                .build();
        
        Favorite saved = favoriteService.addFavorite(favorite);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @DeleteMapping
    @Operation(summary = "Remove a property from favorites")
    public ResponseEntity<Void> removeFavorite(
            @Parameter(description = "User ID") @RequestParam String userId,
            @Parameter(description = "Property ID") @RequestParam String propertyId,
            @Parameter(description = "Property type") @RequestParam String propertyType) {
        favoriteService.removeFavorite(userId, propertyId, propertyType);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all favorites for a user")
    public ResponseEntity<List<Favorite>> getUserFavorites(
            @Parameter(description = "User ID") @PathVariable String userId) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @GetMapping("/user/{userId}/type/{propertyType}")
    @Operation(summary = "Get favorites for a user by property type")
    public ResponseEntity<List<Favorite>> getUserFavoritesByType(
            @Parameter(description = "User ID") @PathVariable String userId,
            @Parameter(description = "Property type (RENT or BUY)") @PathVariable String propertyType) {
        return ResponseEntity.ok(favoriteService.getUserFavoritesByType(userId, propertyType));
    }

    @GetMapping("/check")
    @Operation(summary = "Check if a property is in user's favorites")
    public ResponseEntity<Boolean> isFavorite(
            @Parameter(description = "User ID") @RequestParam String userId,
            @Parameter(description = "Property ID") @RequestParam String propertyId,
            @Parameter(description = "Property type") @RequestParam String propertyType) {
        boolean isFavorite = favoriteService.isFavorite(userId, propertyId, propertyType);
        return ResponseEntity.ok(isFavorite);
    }
}
