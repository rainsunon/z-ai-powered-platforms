"use client";

import * as React from "react";
import { toast } from "sonner";
import { UserX, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type AssetDetails } from "@/types";
import { assetsService } from "@/services/assets.service";

interface AssetUnassignDialogProps {
    asset: AssetDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function AssetUnassignDialog({
    asset,
    open,
    onOpenChange,
    onSuccess,
}: AssetUnassignDialogProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUnassign = async () => {
        if (!asset || !asset.id) {
            toast.error("Asset information is missing. Please refresh the page.");
            return;
        }
        
        if (!asset.assignedTo) {
            toast.error("No assignment found");
            return;
        }

        setIsLoading(true);
        try {
            await assetsService.unassignAsset(asset.id);

            toast.success(`Asset "${asset.name}" unassigned successfully`);
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to unassign asset. Please try again.";
            toast.error(errorMessage);
            console.error("Error unassigning asset:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserX className="h-5 w-5 text-destructive" />
                        Unassign Asset
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to unassign this asset?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Warning */}
                    <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-warning shrink-0" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">This action will:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                                <li>Remove the asset from {asset?.assignedTo?.username ?? "the user"}</li>
                                <li>Mark the asset as Available</li>
                                <li>Create a history entry for this change</li>
                            </ul>
                        </div>
                    </div>

                    {/* Asset Info */}
                    <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm font-medium">{asset?.name}</p>
                        <p className="text-xs text-muted-foreground">
                            Currently assigned to: {asset?.assignedTo?.username ?? "Unknown"}
                        </p>
                        {asset?.assignmentDate && (
                            <p className="text-xs text-muted-foreground">
                                Since: {new Date(asset.assignmentDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleUnassign}
                        disabled={isLoading}
                    >
                        {isLoading ? "Unassigning..." : "Unassign Asset"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
