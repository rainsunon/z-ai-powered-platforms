"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, History, User, Calendar, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { type AssetHistory, AssetStatus } from "@/types";
import { historyService } from "@/services/history.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const statusColors: Record<AssetStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AssetStatus.AVAILABLE]: "default",
  [AssetStatus.ASSIGNED]: "secondary",
  [AssetStatus.UNDER_MAINTENANCE]: "outline",
  [AssetStatus.RETIRED]: "destructive",
};

export default function AssetHistoryPage() {
  const params = useParams();
  const router = useRouter();

  const [history, setHistory] = React.useState<AssetHistory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const assetId = Number(params.id);

  React.useEffect(() => {
    async function fetchHistory() {
      if (!assetId || isNaN(assetId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await historyService.getAssetHistory(assetId, 0, 100);
        
        // Map backend response to frontend format
        // Backend returns ListAssetHistoryResponseDto with: id, assetName, assignedTo, note, timestamp, status
        // Frontend expects AssetHistory with: id, assetId, userId, userName, note, timestamp, status
        const mappedHistory = (response.content || []).map((item: any) => ({
          id: item.id ?? 0,
          assetId: assetId,
          userId: 0, // Backend doesn't return userId
          userName: item.assignedTo ?? item.userName ?? "System", // Backend uses 'assignedTo' field
          note: item.note ?? "",
          timestamp: item.timestamp || new Date().toISOString(),
          status: item.status,
        }));
        setHistory(mappedHistory);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load history";
        toast.error(errorMessage);
        console.error("Error loading history:", error);
        if (error instanceof Error && 'status' in error) {
          console.error("Error status:", (error as any).status);
          console.error("Error details:", error);
        }
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchHistory();
  }, [assetId]);

  return (
    <motion.div
      className="p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Asset History"
        description="View the complete history of this asset"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Assets", href: "/assets" },
          { label: "History" },
        ]}
      />

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3).keys()].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <EmptyState
                icon={History}
                title="No history found"
                description={
                  <div className="space-y-2">
                    <p>This asset has no recorded history yet.</p>
                    <p className="text-sm text-muted-foreground">
                      History entries are created automatically when you:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Assign this asset to a user</li>
                      <li>Unassign this asset from a user</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      To create history, go to the asset details page and assign/unassign the asset.
                    </p>
                  </div>
                }
              />
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 h-full w-px bg-border" />

                <div className="space-y-8">
                  {history.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      className="relative flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
                        <Package className="h-4 w-4 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant={statusColors[entry.status]} className="mb-2">
                              {entry.status.replace("_", " ")}
                            </Badge>
                            <p className="text-sm">{entry.note ?? "No note provided"}</p>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          {entry.userName && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {entry.userName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "Unknown date"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

