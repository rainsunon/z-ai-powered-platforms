import { apiFetch } from "@/lib/api";
import type { Department } from "@/types";

// Note: Departments exist in both User Service (8081) and Asset Service (8082)
// This service uses Asset Service for asset-related department operations
// For user-related department operations, use usersService.getDepartments()

export const departmentsService = {
  // Get all departments (from Asset Service)
  async getDepartments(): Promise<Department[]> {
    return apiFetch<Department[]>("/api/departments", {}, "asset");
  },

  // Get department by ID
  async getDepartment(id: number): Promise<Department> {
    return apiFetch<Department>(`/api/departments/${id}`, {}, "asset");
  },

  // Create department
  async createDepartment(data: { name: string }): Promise<Department> {
    return apiFetch<Department>(
      "/api/departments",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Update department
  async updateDepartment(
    id: number,
    data: { name: string }
  ): Promise<Department> {
    return apiFetch<Department>(
      `/api/departments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Delete department
  async deleteDepartment(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/departments/${id}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },
};
