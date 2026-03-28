package com.xrs.history.service.client;

import com.xrs.assetmanagementsystem.dto.AssetDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST Client for Asset Service
 * Used by History Service to get asset information for history entries
 */
@Component
public class AssetServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.asset.url}")
    private String assetServiceUrl;

    public AssetServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    public AssetDto getAssetById(Long assetId) {
        String url = assetServiceUrl + "/assets/" + assetId;
        return restTemplate.getForObject(url, AssetDto.class);
    }
}

