"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Eye, History, Wrench } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type AssetListDTO, AssetStatus } from "@/types";
import { assetsService } from "@/services/assets.service";
import { staggerContainer } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusColors: Record<AssetStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AssetStatus.AVAILABLE]: "default",
  [AssetStatus.ASSIGNED]: "secondary",
  [AssetStatus.UNDER_MAINTENANCE]: "outline",
  [AssetStatus.RETIRED]: "destructive",
};

const statusLabels: Record<AssetStatus, string> = {
  [AssetStatus.AVAILABLE]: "Available",
  [AssetStatus.ASSIGNED]: "Assigned",
  [AssetStatus.UNDER_MAINTENANCE]: "Maintenance",
  [AssetStatus.RETIRED]: "Retired",
};

export default function MyAssetsPage() {
  const { user } = useAuth();
  
  const [assets, setAssets] = React.useState<AssetListDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  const fetchMyAssets = React.useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Use the backend's myAssetsFlag to filter assets assigned to current user
      const response = await assetsService.getMyAssets(
        page,
        pageSize,
        "name",
        "asc"
      );
      
      setAssets(response.content);
      setTotalItems(response.totalElements);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to load your assets";
      toast.error(errorMessage);
      console.error("Error loading assets:", error);
      setAssets([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, user]);

  React.useEffect(() => {
    void fetchMyAssets();
  }, [fetchMyAssets]);

  const columns: Column<AssetListDTO>[] = [
    {
      key: "name",
      header: "Name",
      cell: (asset) => (
        <div>
          <p className="font-medium">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.brand}</p>
        </div>
      ),
    },
    {
      key: "serialNumber",
      header: "Serial Number",
    },
    {
      key: "typeName",
      header: "Type",
      cell: (asset) => (
        <div>
          <p>{asset.typeName}</p>
          <p className="text-xs text-muted-foreground">{asset.categoryName}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "status",
      header: "Status",
      cell: (asset) => (
        <Badge variant={statusColors[asset.status]}>
          {statusLabels[asset.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (asset) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/assets/${asset.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/history/${asset.id}`}>
              <History className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/requests/add">
              <Wrench className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <PageHeader
        title="My Assets"
        description="View and manage your assigned assets"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "My Assets" },
        ]}
        actions={
          <Button asChild size="default" variant="outline">
            <Link href="/requests/add">
              <Wrench className="mr-2 h-4 w-4" />
              Request Maintenance
            </Link>
          </Button>
        }
      />

      {assets.length === 0 && !isLoading && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5 text-primary" />
              No Assets Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any assets assigned to you yet. Assets will appear here once they are assigned by an administrator.
            </p>
          </CardContent>
        </Card>
      )}

      {(assets.length > 0 || isLoading) && (
        <DataTable
          columns={columns}
          data={assets}
          isLoading={isLoading}
          emptyMessage="No assets assigned"
          emptyDescription="You don't have any assets assigned to you"
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          getRowKey={(asset) => asset.id}
        />
      )}
    </motion.div>
  );
}

