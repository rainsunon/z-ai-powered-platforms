import { apiFetch } from "@/lib/api";
import type { AssetCategory } from "@/types";

export const categoriesService = {
  // Get all categories
  async getCategories(): Promise<AssetCategory[]> {
    return apiFetch<AssetCategory[]>("/api/categories", {}, "asset");
  },

  // Get category by ID
  async getCategory(id: number): Promise<AssetCategory> {
    return apiFetch<AssetCategory>(`/api/categories/${id}`, {}, "asset");
  },

  // Create category
  async createCategory(data: { name: string }): Promise<AssetCategory> {
    return apiFetch<AssetCategory>(
      "/api/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Update category
  async updateCategory(
    id: number,
    data: { name: string }
  ): Promise<AssetCategory> {
    return apiFetch<AssetCategory>(
      `/api/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Delete category
  async deleteCategory(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/categories/${id}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },
};
