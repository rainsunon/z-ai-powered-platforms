package com.xrs.asset.assetservice.client;

import com.xrs.assetmanagementsystem.dto.CreateAssetHistoryDto;
import com.xrs.assetmanagementsystem.entity.AssetHistory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * REST Client for History Service
 * Used by Asset Service to create history entries
 */
@Component
public class HistoryServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(HistoryServiceClient.class);
    private final RestTemplate restTemplate;
    
    @Value("${service.history.url}")
    private String historyServiceUrl;

    public HistoryServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AssetHistory createHistory(AssetHistory assetHistory) {
        try {
            // Validate URL before constructing
            String url = historyServiceUrl + "/api/history";
            
            // Validate URI format - if invalid, log and return null instead of throwing
            try {
                new URI(url);
            } catch (URISyntaxException e) {
                logger.error("Invalid history service URL: {}. Error: {}. History entry will not be created.", url, e.getMessage());
                return null; // Return null instead of throwing to prevent transaction rollback
            }
            
            // Convert AssetHistory entity to DTO (only IDs)
            CreateAssetHistoryDto dto = new CreateAssetHistoryDto();
            dto.setAssetId(assetHistory.getAsset() != null ? assetHistory.getAsset().getId() : null);
            dto.setUserId(assetHistory.getUser() != null ? assetHistory.getUser().getId() : null);
            dto.setStatus(assetHistory.getStatus());
            dto.setNote(assetHistory.getNote());
            dto.setTimestamp(assetHistory.getTimestamp());
            
            logger.debug("Creating history entry: assetId={}, userId={}, status={}, note={}", 
                        dto.getAssetId(), dto.getUserId(), dto.getStatus(), dto.getNote());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<CreateAssetHistoryDto> request = new HttpEntity<>(dto, headers);
            
            AssetHistory result = restTemplate.postForObject(url, request, AssetHistory.class);
            if (result != null) {
                logger.debug("History entry created successfully: id={}", result.getId());
            } else {
                logger.warn("History service returned null response");
            }
            return result;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            logger.error("HTTP client error creating history entry: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return null;
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            logger.error("HTTP server error creating history entry: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return null;
        } catch (RestClientException e) {
            logger.error("Failed to create history entry: {}", e.getMessage(), e);
            // Don't throw - return null to allow the calling code to continue
            return null;
        } catch (Exception e) {
            // Catch any other exceptions (including URI parsing errors from RestTemplate)
            logger.error("Unexpected error creating history entry: {}", e.getMessage(), e);
            return null; // Return null instead of throwing
        }
    }
}

