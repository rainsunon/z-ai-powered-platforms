package com.xrs.asset.assetservice.service.impl;

import com.xrs.asset.assetservice.repository.AssetRepository;
import com.xrs.asset.assetservice.repository.CategoryRepository;
import com.xrs.asset.assetservice.repository.DepartmentRepository;
import com.xrs.asset.assetservice.repository.LocationRepository;
import com.xrs.assetmanagementsystem.dto.DashboardStatsDto;
import com.xrs.assetmanagementsystem.enums.AssetStatus;
import com.xrs.assetmanagementsystem.assetservice.repository.*;
import com.xrs.asset.assetservice.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Transactional(readOnly = true)
@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Value("${service.user.url}")
    private String userServiceUrl;

    @Value("${service.request.url}")
    private String requestServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        // Asset statistics (local to this service)
        stats.setTotalAssets(assetRepository.count());
        stats.setAvailableAssets((long) assetRepository.findByStatus(AssetStatus.AVAILABLE).size());
        stats.setAssignedAssets((long) assetRepository.findByStatus(AssetStatus.ASSIGNED).size());
        stats.setUnderMaintenanceAssets((long) assetRepository.findByStatus(AssetStatus.UNDER_MAINTENANCE).size());
        stats.setRetiredAssets((long) assetRepository.findByStatus(AssetStatus.RETIRED).size());

        // User statistics (call User Service)
        try {
            Map<String, Long> userStats = restTemplate.exchange(
                userServiceUrl + "/api/users/stats",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Long>>() {}
            ).getBody();
            if (userStats != null) {
                stats.setTotalUsers(userStats.getOrDefault("total", 0L));
                stats.setActiveUsers(userStats.getOrDefault("active", 0L));
            }
        } catch (Exception e) {
            // Fallback values if User Service is unavailable
            stats.setTotalUsers(0L);
            stats.setActiveUsers(0L);
        }

        // Request statistics (call Request Service)
        try {
            Map<String, Long> requestStats = restTemplate.exchange(
                requestServiceUrl + "/api/requests/stats",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Long>>() {}
            ).getBody();
            if (requestStats != null) {
                stats.setPendingRequests(requestStats.getOrDefault("pending", 0L));
                stats.setApprovedRequests(requestStats.getOrDefault("approved", 0L));
                stats.setRejectedRequests(requestStats.getOrDefault("rejected", 0L));
            }
        } catch (Exception e) {
            // Fallback values if Request Service is unavailable
            stats.setPendingRequests(0L);
            stats.setApprovedRequests(0L);
            stats.setRejectedRequests(0L);
        }

        // System statistics (local to this service - departments owned by user service, but keeping here for compatibility)
        stats.setTotalDepartments(departmentRepository.count());
        stats.setTotalCategories(categoryRepository.count());
        stats.setTotalLocations(locationRepository.count());

        return stats;
    }
}


