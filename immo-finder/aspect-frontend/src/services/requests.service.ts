import { apiFetch, buildQueryParams, type Page } from "@/lib/api";
import type { AssetRequest, RequestFilter } from "@/types";

export interface RequestStats {
  pending: number;
  approved: number;
  rejected: number;
}

export const requestsService = {
  // Get all requests with pagination and filters
  async getRequests(
    page = 0,
    size = 10,
    filter?: RequestFilter,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<Page<AssetRequest>> {
    const query = buildQueryParams({
      page,
      size,
      search: filter?.search,
      status: filter?.status,
      requestType: filter?.requestType,
      sort: sortBy ? `${sortBy},${sortOrder ?? "asc"}` : undefined,
    });
    return apiFetch<Page<AssetRequest>>(`/request${query}`, {}, "request");
  },

  // Get request by ID
  async getRequest(id: number): Promise<AssetRequest> {
    return apiFetch<AssetRequest>(`/request/${id}`, {}, "request");
  },

  // Get request statistics
  async getRequestStats(): Promise<RequestStats> {
    return apiFetch<RequestStats>("/request/stats", {}, "request");
  },

  // Create request
  async createRequest(data: {
    assetTypeId: number;
    assetId?: number;
    requesterId: number;
    requestType: string;
    note?: string;
  }): Promise<AssetRequest> {
    return apiFetch<AssetRequest>(
      "/request",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "request"
    );
  },

  // Approve request
  async approveRequest(id: number, note?: string): Promise<AssetRequest> {
    return apiFetch<AssetRequest>(
      `/request/${id}/approve`,
      {
        method: "PUT",
        body: JSON.stringify({ note }),
      },
      "request"
    );
  },

  // Reject request
  async rejectRequest(
    id: number,
    rejectionNote: string
  ): Promise<AssetRequest> {
    return apiFetch<AssetRequest>(
      `/request/${id}/reject`,
      {
        method: "PUT",
        body: JSON.stringify({ rejectionNote }),
      },
      "request"
    );
  },
};
