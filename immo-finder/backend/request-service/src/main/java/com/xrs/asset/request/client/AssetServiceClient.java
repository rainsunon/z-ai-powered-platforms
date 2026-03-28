package com.xrs.asset.request.client;

import com.xrs.assetmanagementsystem.dto.AssetDto;
import com.xrs.assetmanagementsystem.entity.Asset;
import com.xrs.assetmanagementsystem.enums.AssetStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST Client for Asset Service
 * Used by Request Service to check asset status and update assets
 */
@Component
public class AssetServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.asset.url}")
    private String assetServiceUrl;

    public AssetServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AssetDto getAssetById(Long assetId) {
        String url = assetServiceUrl + "/assets/" + assetId;
        return restTemplate.getForObject(url, AssetDto.class);
    }

    public boolean assetExists(Long assetId) {
        try {
            getAssetById(assetId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void updateAssetStatus(Long assetId, AssetStatus status) {
        String url = assetServiceUrl + "/assets/" + assetId + "/status";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AssetStatus> request = new HttpEntity<>(status, headers);
        
        restTemplate.exchange(url, HttpMethod.PUT, request, Void.class);
    }
}

