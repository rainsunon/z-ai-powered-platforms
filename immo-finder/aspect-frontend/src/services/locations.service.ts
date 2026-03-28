import { apiFetch } from "@/lib/api";
import type { Location } from "@/types";

export const locationsService = {
  // Get all locations
  async getLocations(): Promise<Location[]> {
    return apiFetch<Location[]>("/api/locations", {}, "asset");
  },

  // Get location by ID
  async getLocation(id: number): Promise<Location> {
    return apiFetch<Location>(`/api/locations/${id}`, {}, "asset");
  },

  // Create location
  async createLocation(data: {
    name: string;
    address?: string;
    isActive?: boolean;
  }): Promise<Location> {
    return apiFetch<Location>(
      "/api/locations",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Update location
  async updateLocation(
    id: number,
    data: { name: string; address?: string; isActive?: boolean }
  ): Promise<Location> {
    return apiFetch<Location>(
      `/api/locations/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Delete location
  async deleteLocation(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/locations/${id}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },
};
