import { apiFetch, buildQueryParams, type Page } from "@/lib/api";
import type { AssetHistory } from "@/types";

export interface CreateHistoryData {
    assetId: number;
    userId: number;
    note: string;
    status: string;
}

export const historyService = {
    // Get asset history with pagination
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

    // Create history entry
    async createHistory(data: CreateHistoryData): Promise<AssetHistory> {
        return apiFetch<AssetHistory>(
            "/api/history",
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            "history"
        );
    },
};
