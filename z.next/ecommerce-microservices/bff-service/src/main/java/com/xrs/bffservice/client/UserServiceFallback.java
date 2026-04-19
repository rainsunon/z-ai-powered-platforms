package com.xrs.bffservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class UserServiceFallback implements UserServiceClient {
    
    @Override
    public Mono<Object> findUserById(Long userId) {
        log.error("User service is unavailable - cannot fetch user: {}", userId);
        return Mono.empty();
    }
    
    @Override
    public Mono<Object> getCurrentUserProfile() {
        log.error("User service is unavailable - cannot fetch current user profile");
        return Mono.empty();
    }
}
