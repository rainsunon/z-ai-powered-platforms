"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  History,
  Package,
  User,
  MapPin,
  Calendar,
  Shield,
  Tag,
  Hash,
  UserPlus,
  UserX,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AssetAssignmentModal } from "@/components/assets/asset-assignment-modal";
import { AssetUnassignDialog } from "@/components/assets/asset-unassign-dialog";
import type { AssetDetails } from "@/types";
import { AssetStatus } from "@/types";
import { assetsService } from "@/services/assets.service";
import { staggerContainer, staggerItem } from "@/lib/animations";

const statusColors: Record<AssetStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [AssetStatus.AVAILABLE]: "default",
  [AssetStatus.ASSIGNED]: "secondary",
  [AssetStatus.UNDER_MAINTENANCE]: "outline",
  [AssetStatus.RETIRED]: "destructive",
};

const statusLabels: Record<AssetStatus, string> = {
  [AssetStatus.AVAILABLE]: "Available",
  [AssetStatus.ASSIGNED]: "Assigned",
  [AssetStatus.UNDER_MAINTENANCE]: "Under Maintenance",
  [AssetStatus.RETIRED]: "Retired",
};

export default function AssetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { canManageAssets, isAdmin } = useAuth();

  const [asset, setAsset] = React.useState<AssetDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [unassignDialogOpen, setUnassignDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const assetId = Number(params.id);

  const fetchAsset = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await assetsService.getAssetDetails(assetId);
      setAsset(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load asset details. Please try again later.";
      toast.error(errorMessage);
      console.error("Error loading asset details:", error);
      void router.push("/assets");
    } finally {
      setIsLoading(false);
    }
  }, [assetId, router]);

  React.useEffect(() => {
    if (assetId) {
      void fetchAsset();
    }
  }, [assetId, fetchAsset]);

  const handleDelete = async () => {
    if (!asset || !asset.id) {
      toast.error("Asset information is missing. Please refresh the page.");
      return;
    }
    setIsDeleting(true);
    try {
      await assetsService.deleteAsset(asset.id);
      toast.success(`Asset "${asset.name}" deleted successfully`);
      void router.push("/assets");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete asset. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting asset:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Asset not found</p>
      </div>
    );
  }

  const canAssign = canManageAssets && asset.status === AssetStatus.AVAILABLE;
  const canUnassign = canManageAssets && asset.status === AssetStatus.ASSIGNED && asset.assignedTo;

  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <PageHeader
          title={asset.name}
          description={`${asset.brand} • ${asset.typeName}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Assets", href: "/assets" },
            { label: asset.name },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/history/${asset.id}`}>
                  <History className="mr-2 h-4 w-4" />
                  History
                </Link>
              </Button>
              {canAssign && (
                <Button variant="outline" onClick={() => setAssignModalOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </Button>
              )}
              {canUnassign && (
                <Button variant="outline" onClick={() => setUnassignDialogOpen(true)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Unassign
                </Button>
              )}
              {canManageAssets && (
                <Button asChild>
                  <Link href={`/assets/${asset.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
              {isAdmin() && (
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Asset Details Card */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5 text-primary" />
                Asset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow icon={Tag} label="Name" value={asset.name} />
              <DetailRow icon={Tag} label="Brand" value={asset.brand} />
              <DetailRow icon={Hash} label="Serial Number" value={asset.serialNumber} />
              <DetailRow
                icon={Package}
                label="Type"
                value={`${asset.typeName} (${asset.categoryName})`}
              />
              <DetailRow icon={MapPin} label="Location" value={asset.location} />
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Status
                </div>
                <Badge variant={statusColors[asset.status] ?? "default"}>
                  {statusLabels[asset.status] ?? asset.status}
                </Badge>
              </div>
              {asset.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{asset.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Dates & Assignment Card */}
        <motion.div variants={staggerItem} className="space-y-6">
          {/* Dates */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-primary" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow
                icon={Calendar}
                label="Purchase Date"
                value={new Date(asset.purchaseDate).toLocaleDateString()}
              />
              <DetailRow
                icon={Shield}
                label="Warranty Ends"
                value={new Date(asset.warrantyEndDate).toLocaleDateString()}
              />
            </CardContent>
          </Card>

          {/* Assignment */}
          {asset.assignedTo && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  Current Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DetailRow icon={User} label="Assigned To" value={asset.assignedTo.username} />
                <DetailRow icon={Tag} label="Email" value={asset.assignedTo.email} />
                {asset.assignmentDate && (
                  <DetailRow
                    icon={Calendar}
                    label="Since"
                    value={new Date(asset.assignmentDate).toLocaleDateString()}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Assignment Modal */}
      <AssetAssignmentModal
        asset={asset}
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        onSuccess={fetchAsset}
      />

      {/* Unassign Dialog */}
      <AssetUnassignDialog
        asset={asset}
        open={unassignDialogOpen}
        onOpenChange={setUnassignDialogOpen}
        onSuccess={fetchAsset}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Asset"
        description={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </motion.div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

