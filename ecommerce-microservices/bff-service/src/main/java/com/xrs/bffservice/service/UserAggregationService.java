package com.xrs.bffservice.service;

import com.xrs.bffservice.client.OrderServiceClient;
import com.xrs.bffservice.client.UserServiceClient;
import com.xrs.bffservice.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAggregationService {
    
    private final UserServiceClient userServiceClient;
    private final OrderServiceClient orderServiceClient;
    
    /**
     * Get complete user profile with recent orders and favorites
     */
    public Mono<UserProfileDto> getUserProfile(Long userId) {
        log.info("Fetching user profile for userId: {}", userId);
        
        Mono<Object> userMono = userServiceClient.findUserById(userId);
        Mono<List<Object>> ordersMono = orderServiceClient.findAllOrders()
            .take(5)  // Get only 5 most recent orders
            .collectList()
            .onErrorReturn(List.of());
        
        return Mono.zip(userMono, ordersMono)
            .map(tuple -> {
                Map<String, Object> user = (Map<String, Object>) tuple.getT1();
                return new UserProfileDto(
                    ((Number) user.get("id")).longValue(),
                    (String) user.get("fullname"),
                    (String) user.get("username"),
                    (String) user.get("email"),
                    (String) user.get("phone"),
                    (String) user.get("avatar"),
                    tuple.getT2(),
                    List.of()  // Favorites can be added later
                );
            })
            .doOnSuccess(profile -> log.info("Successfully aggregated user profile for: {}", userId))
            .doOnError(error -> log.error("Error fetching user profile for: {}", userId, error));
    }
    
    /**
     * Get current authenticated user profile
     */
    public Mono<UserProfileDto> getCurrentUserProfile() {
        log.info("Fetching current user profile");
        
        Mono<Object> userMono = userServiceClient.getCurrentUserProfile();
        Mono<List<Object>> ordersMono = orderServiceClient.findAllOrders()
            .take(5)
            .collectList()
            .onErrorReturn(List.of());
        
        return Mono.zip(userMono, ordersMono)
            .map(tuple -> {
                Map<String, Object> user = (Map<String, Object>) tuple.getT1();
                return new UserProfileDto(
                    ((Number) user.get("id")).longValue(),
                    (String) user.get("fullname"),
                    (String) user.get("username"),
                    (String) user.get("email"),
                    (String) user.get("phone"),
                    (String) user.get("avatar"),
                    tuple.getT2(),
                    List.of()
                );
            })
            .doOnSuccess(profile -> log.info("Successfully aggregated current user profile"))
            .doOnError(error -> log.error("Error fetching current user profile", error));
    }
}
