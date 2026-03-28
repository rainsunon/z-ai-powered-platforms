package com.xrs.asset.request.client;

import com.xrs.assetmanagementsystem.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST Client for User Service
 * Used by Request Service to validate users and get user information
 */
@Component
public class UserServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.user.url}")
    private String userServiceUrl;

    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UserDTO getUserById(Long userId) {
        String url = userServiceUrl + "/api/users/" + userId;
        return restTemplate.getForObject(url, UserDTO.class);
    }

    public boolean userExists(Long userId) {
        try {
            getUserById(userId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

