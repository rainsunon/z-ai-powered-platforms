import { apiFetch, buildQueryParams, type Page } from "@/lib/api";
import type {
  Asset,
  AssetListDTO,
  AssetDetails,
  AssetFilter,
  AssetHistory,
  AssetCategory,
  AssetType,
  AssetStatus,
} from "@/types";

// Backend DTO interface (matches AssetDetailsDto from backend)
interface AssetDetailsDtoResponse {
  assetId: number;
  assetName: string;
  brand: string;
  assetDescription?: string;
  categoryId: number;
  categoryName: string;
  typeId: number;
  typeName: string;
  location: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: AssetStatus;
  imagePath?: string;
  assignedToId?: number;
  assignedToName?: string;
  assignedToEmail?: string;
  assignmentDate?: string;
}

export const assetsService = {
  // Get all assets with pagination and filters
  async getAssets(
    page = 0,
    size = 10,
    filter?: AssetFilter,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    myAssetsFlag?: boolean
  ): Promise<Page<AssetListDTO>> {
    const query = buildQueryParams({
      page,
      size,
      search: filter?.search,
      status: filter?.status,
      categoryId: filter?.categoryId,
      typeId: filter?.typeId,
      location: filter?.location,
      sort: sortBy ? `${sortBy},${sortOrder ?? "asc"}` : undefined,
      myAssetsFlag: myAssetsFlag ? "true" : undefined,
    });
    return apiFetch<Page<AssetListDTO>>(`/assets${query}`, {}, "asset");
  },

  // Get my assigned assets (for employees)
  async getMyAssets(
    page = 0,
    size = 10,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<Page<AssetListDTO>> {
    return this.getAssets(page, size, undefined, sortBy, sortOrder, true);
  },

  // Get all assets without pagination (ADMIN only)
  async getAllAssets(): Promise<Asset[]> {
    return apiFetch<Asset[]>("/assets/all", {}, "asset");
  },

  // Get asset details
  async getAssetDetails(id: number): Promise<AssetDetails> {
    const response = await apiFetch<AssetDetailsDtoResponse>(`/assets/details/${id}`, {}, "asset");
    
    // Map backend AssetDetailsDto fields to frontend AssetDetails interface
    // Backend uses: assetId, assetName, assetDescription, assignedToId, assignedToName, assignedToEmail
    // Frontend expects: id, name, description, assignedTo { id, username, email }
    const mapped: AssetDetails = {
      id: response.assetId ?? id, // Backend returns assetId, map to id
      name: response.assetName ?? "", // Backend returns assetName, map to name
      brand: response.brand ?? "",
      description: response.assetDescription,
      serialNumber: response.serialNumber ?? "",
      location: response.location ?? "",
      status: response.status,
      purchaseDate: response.purchaseDate ?? "",
      warrantyEndDate: response.warrantyEndDate ?? "",
      categoryId: response.categoryId,
      categoryName: response.categoryName,
      typeId: response.typeId,
      typeName: response.typeName,
      imagePath: response.imagePath,
      assignedTo: response.assignedToId ? {
        id: response.assignedToId,
        username: response.assignedToName ?? "",
        email: response.assignedToEmail ?? "",
      } : undefined,
      assignmentDate: response.assignmentDate,
    };
    
    return mapped;
  },

  // Create asset
  async createAsset(data: Partial<Asset>): Promise<Asset> {
    return apiFetch<Asset>(
      "/assets",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Update asset
  async updateAsset(id: number, data: Partial<Asset>): Promise<Asset> {
    return apiFetch<Asset>(
      `/assets/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Delete asset
  async deleteAsset(id: number): Promise<void> {
    return apiFetch<void>(
      `/assets/${id}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },

  // Get asset history (from History Service)
  async getAssetHistory(
    assetId: number,
    page = 0,
    size = 10
  ): Promise<Page<AssetHistory>> {
    const query = buildQueryParams({ page, size });
    return apiFetch<Page<AssetHistory>>(
      `/api/history/asset/${assetId}${query}`,
      {},
      "history"
    );
  },

  // Get available assets (ADMIN/IT only) with optional type filter
  async getAvailableAssets(type?: string): Promise<Asset[]> {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    return apiFetch<Asset[]>(`/assets/available${query}`, {}, "asset");
  },

  // Assign asset
  async assignAsset(data: {
    assetId: number;
    userId: number;
    typeId: number;
    categoryId: number;
    note?: string;
  }): Promise<void> {
    return apiFetch<void>(
      "/assets/assign",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Unassign asset
  async unassignAsset(assignmentId: number): Promise<void> {
    return apiFetch<void>(
      `/assets/assign/${assignmentId}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },

  // Get categories
  async getCategories(): Promise<AssetCategory[]> {
    return apiFetch<AssetCategory[]>("/assets/categories", {}, "asset");
  },

  // Get types with optional category filter
  async getTypes(categoryId?: number): Promise<AssetType[]> {
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    return apiFetch<AssetType[]>(`/assets/types${query}`, {}, "asset");
  },

  // Create type
  async createType(data: {
    name: string;
    categoryId: number;
  }): Promise<AssetType> {
    return apiFetch<AssetType>(
      "/assets/types",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Update type
  async updateType(
    id: number,
    data: { name: string; categoryId: number }
  ): Promise<AssetType> {
    return apiFetch<AssetType>(
      `/assets/types/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "asset"
    );
  },

  // Delete type
  async deleteType(id: number): Promise<void> {
    return apiFetch<void>(
      `/assets/types/${id}`,
      {
        method: "DELETE",
      },
      "asset"
    );
  },
};
