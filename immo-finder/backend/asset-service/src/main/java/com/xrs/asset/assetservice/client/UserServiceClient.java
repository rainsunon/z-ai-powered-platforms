package com.xrs.asset.assetservice.client;

import com.xrs.assetmanagementsystem.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * REST Client for User Service
 * Used by Asset Service to validate users and get user information
 */
@Component
public class UserServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceClient.class);
    private final RestTemplate restTemplate;
    
    @Value("${service.user.url}")
    private String userServiceUrl;

    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UserDTO getUserById(Long userId) {
        // Trim and validate URL
        String baseUrl = userServiceUrl != null ? userServiceUrl.trim() : "";
        if (baseUrl.isEmpty()) {
            throw new RestClientException("User service URL is not configured");
        }
        
        String url = baseUrl + "/api/users/" + userId;
        
        // Validate URI format using Spring's URI builder (same as RestTemplate uses)
        try {
            UriComponentsBuilder.fromUriString(url).build();
        } catch (Exception e) {
            logger.error("Invalid user service URL: {}. Error: {}", url, e.getMessage());
            throw new RestClientException("Invalid user service URL: " + url + " - " + e.getMessage(), e);
        }
        
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

