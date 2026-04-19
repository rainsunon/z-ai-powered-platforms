package com.xrs.bffservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Mono;

@FeignClient(
    name = "USER-SERVICE",
    fallback = UserServiceFallback.class,
    configuration = com.xrs.bffservice.config.FeignConfig.class
)
public interface UserServiceClient {
    
    @GetMapping("/api/users/{userId}")
    Mono<Object> findUserById(@PathVariable("userId") Long userId);
    
    @GetMapping("/api/users/profile")
    Mono<Object> getCurrentUserProfile();
}
