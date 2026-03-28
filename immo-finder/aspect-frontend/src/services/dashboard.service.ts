import { apiFetch } from "@/lib/api";
import { usersService, type UserStats } from "./users.service";
import { requestsService, type RequestStats } from "./requests.service";

export interface DashboardStats {
  // Asset stats
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  underMaintenanceAssets: number;
  retiredAssets: number;
  // User stats
  totalUsers: number;
  activeUsers: number;
  // Request stats
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  // Entity counts
  totalDepartments: number;
  totalCategories: number;
  totalLocations: number;
}

export const dashboardService = {
  // Get dashboard statistics from Asset Service (primary source)
  async getDashboardStats(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>("/api/dashboard/stats", {}, "asset");
  },

  // Get user statistics from User Service
  async getUserStats(): Promise<UserStats> {
    return usersService.getUserStats();
  },

  // Get request statistics from Request Service
  async getRequestStats(): Promise<RequestStats> {
    return requestsService.getRequestStats();
  },

  // Get aggregated stats from all services
  async getAggregatedStats(): Promise<DashboardStats> {
    try {
      // Primary source: Asset Service dashboard stats
      const assetStats = await apiFetch<DashboardStats>(
        "/api/dashboard/stats",
        {},
        "asset"
      );

      // Try to get additional stats from other services
      try {
        const [userStats, requestStats] = await Promise.all([
          usersService.getUserStats(),
          requestsService.getRequestStats(),
        ]);

        // Merge with user and request stats if available
        return {
          ...assetStats,
          totalUsers: userStats.totalUsers ?? assetStats.totalUsers,
          activeUsers: userStats.activeUsers ?? assetStats.activeUsers,
          pendingRequests:
            requestStats.pending ?? assetStats.pendingRequests,
          approvedRequests:
            requestStats.approved ?? assetStats.approvedRequests,
          rejectedRequests:
            requestStats.rejected ?? assetStats.rejectedRequests,
        };
      } catch {
        // If other services fail, return asset stats only
        return assetStats;
      }
    } catch (error) {
      console.error("Failed to fetch aggregated stats:", error);
      throw error;
    }
  },
};
