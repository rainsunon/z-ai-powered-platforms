"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, MoreHorizontal, History } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AssetListDTO, AssetStatus } from "@/types";
import { assetsService } from "@/services/assets.service";
import { staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";

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

export default function AssetsPage() {
  const { canManageAssets } = useAuth();
  const router = useRouter();
  
  const [assets, setAssets] = React.useState<AssetListDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AssetStatus | "all">("all");
  const [sortBy, setSortBy] = React.useState<string>("name");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const fetchAssets = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await assetsService.getAssets(
        page,
        pageSize,
        {
          search: searchValue || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
        sortBy,
        sortOrder
      );
      setAssets(response.content);
      setTotalItems(response.totalElements);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to load assets. Please check your connection and try again.";
      toast.error(errorMessage);
      console.error("Error loading assets:", error);
      setAssets([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchValue, statusFilter, sortBy, sortOrder]);

  React.useEffect(() => {
    void fetchAssets();
  }, [fetchAssets]);

  const handleSort = React.useCallback((key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }, [sortBy, sortOrder]);

  const columns: Column<AssetListDTO>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
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
      sortable: true,
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
      sortable: true,
      cell: (asset) => (
        <Badge variant={statusColors[asset.status]}>
          {statusLabels[asset.status]}
        </Badge>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      cell: (asset) => asset.assignedTo ?? "-",
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (asset) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/assets/${asset.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {canManageAssets && (
              <DropdownMenuItem asChild>
                <Link href={`/assets/${asset.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/history/${asset.id}`}>
                <History className="mr-2 h-4 w-4" />
                View History
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        title="Assets"
        description="Manage and track all assets in your organization"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Assets" },
        ]}
        actions={
          canManageAssets && (
            <Button asChild size="default">
              <Link href="/assets/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Link>
            </Button>
          )
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as AssetStatus | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        isLoading={isLoading}
        emptyMessage="No assets found"
        emptyDescription="Get started by adding your first asset"
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search assets..."
        onRowClick={(asset) => void router.push(`/assets/${asset.id}`)}
        getRowKey={(asset) => asset.id}
      />
    </motion.div>
  );
}

