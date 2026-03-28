package com.xrs.immo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    // Asset statistics
    private Long totalAssets;
    private Long availableAssets;
    private Long assignedAssets;
    private Long underMaintenanceAssets;
    private Long retiredAssets;

    // User statistics
    private Long totalUsers;
    private Long activeUsers;

    // Request statistics
    private Long pendingRequests;
    private Long approvedRequests;
    private Long rejectedRequests;

    // System statistics
    private Long totalDepartments;
    private Long totalCategories;
    private Long totalLocations;
}

