package com.xrs.history.service.client;

import com.xrs.assetmanagementsystem.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST Client for User Service
 * Used by History Service to get user information for history entries
 */
@Component
public class UserServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.user.url}")
    private String userServiceUrl;

    public UserServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    public UserDTO getUserById(Long userId) {
        String url = userServiceUrl + "/api/users/" + userId;
        return restTemplate.getForObject(url, UserDTO.class);
    }
}

