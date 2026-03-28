"use client";

import * as React from "react";
import { toast } from "sonner";
import { Package, User as UserIcon, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { type AssetDetails, type User } from "@/types";
import { assetsService } from "@/services/assets.service";
import { usersService } from "@/services/users.service";

interface AssetAssignmentModalProps {
    asset: AssetDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function AssetAssignmentModal({
    asset,
    open,
    onOpenChange,
    onSuccess,
}: AssetAssignmentModalProps) {
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = React.useState<string>("");
    const [note, setNote] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);

    React.useEffect(() => {
        if (open) {
            setIsLoadingUsers(true);
            usersService
                .getUsers(0, 100)
                .then((response) => {
                    setUsers(response.content);
                })
                .catch((error) => {
                    console.error("Failed to load users:", error);
                    toast.error("Failed to load users");
                })
                .finally(() => {
                    setIsLoadingUsers(false);
                });
        } else {
            // Reset form on close
            setSelectedUserId("");
            setNote("");
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!asset || !selectedUserId) {
            toast.error("Please select a user");
            return;
        }

        setIsLoading(true);
        try {
            await assetsService.assignAsset({
                assetId: asset.id,
                userId: Number(selectedUserId),
                typeId: asset.typeId,
                categoryId: asset.categoryId,
                note: note || undefined,
            });

            toast.success(`Asset "${asset.name}" assigned successfully`);
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to assign asset. Please try again.";
            toast.error(errorMessage);
            console.error("Error assigning asset:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Assign Asset
                    </DialogTitle>
                    <DialogDescription>
                        Assign &quot;{asset?.name}&quot; to a user
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Asset Info */}
                    <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm font-medium">{asset?.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {asset?.brand} • {asset?.typeName}
                        </p>
                    </div>

                    {/* User Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="user" className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Assign To *
                        </Label>
                        <Select
                            value={selectedUserId}
                            onValueChange={setSelectedUserId}
                            disabled={isLoadingUsers}
                        >
                            <SelectTrigger id="user">
                                <SelectValue
                                    placeholder={isLoadingUsers ? "Loading users..." : "Select user"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        <div className="flex flex-col">
                                            <span>{user.username}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label htmlFor="note" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Note (optional)
                        </Label>
                        <Input
                            id="note"
                            placeholder="Add a note about this assignment..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
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
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedUserId}
                    >
                        {isLoading ? "Assigning..." : "Assign Asset"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
