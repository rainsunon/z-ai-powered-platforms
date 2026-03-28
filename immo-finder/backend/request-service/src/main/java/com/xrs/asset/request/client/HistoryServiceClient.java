package com.xrs.asset.request.client;

import com.xrs.assetmanagementsystem.entity.AssetHistory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * REST Client for History Service
 * Used by Request Service to create history entries
 */
@Component
public class HistoryServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${service.history.url}")
    private String historyServiceUrl;

    public HistoryServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AssetHistory createHistory(AssetHistory assetHistory) {
        String url = historyServiceUrl + "/api/history";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AssetHistory> request = new HttpEntity<>(assetHistory, headers);
        
        return restTemplate.postForObject(url, request, AssetHistory.class);
    }
}

