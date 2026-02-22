package com.xrs.bffservice.api;

import com.xrs.bffservice.dto.UserProfileDto;
import com.xrs.bffservice.service.UserAggregationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/bff/users")
@RequiredArgsConstructor
@Tag(name = "BFF User API", description = "Backend for Frontend - User Profile Operations")
public class BffUserController {
    
    private final UserAggregationService userAggregationService;
    
    @GetMapping("/{userId}/profile")
    @Operation(summary = "Get user profile with orders and favorites")
    public Mono<ResponseEntity<UserProfileDto>> getUserProfile(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        log.info("BFF: Fetching user profile for: {}", userId);
        return userAggregationService.getUserProfile(userId)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/profile")
    @Operation(summary = "Get current user profile with orders and favorites")
    public Mono<ResponseEntity<UserProfileDto>> getCurrentUserProfile() {
        log.info("BFF: Fetching current user profile");
        return userAggregationService.getCurrentUserProfile()
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
