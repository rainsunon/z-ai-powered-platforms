"use client";

import * as React from "react";
import {
    Calendar,
    User,
    Package,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type AssetRequest, RequestStatus, RequestType } from "@/types";
import { requestsService } from "@/services/requests.service";

interface RequestDetailsModalProps {
    requestId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusColors: Record<
    RequestStatus,
    "default" | "secondary" | "destructive"
> = {
    [RequestStatus.PENDING]: "secondary",
    [RequestStatus.APPROVED]: "default",
    [RequestStatus.REJECTED]: "destructive",
};

const statusIcons: Record<RequestStatus, React.ElementType> = {
    [RequestStatus.PENDING]: Clock,
    [RequestStatus.APPROVED]: CheckCircle,
    [RequestStatus.REJECTED]: XCircle,
};

export function RequestDetailsModal({
    requestId,
    open,
    onOpenChange,
}: RequestDetailsModalProps) {
    const [request, setRequest] = React.useState<AssetRequest | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (open && requestId) {
            setIsLoading(true);
            requestsService
                .getRequest(requestId)
                .then((data) => {
                    setRequest(data);
                })
                .catch((error) => {
                    console.error("Failed to load request details:", error);
                    setRequest(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setRequest(null);
        }
    }, [open, requestId]);

    const StatusIcon = request ? statusIcons[request.status] : Clock;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Request Details
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : request ? (
                    <div className="space-y-6 py-4">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                            <Badge
                                variant={statusColors[request.status]}
                                className="flex items-center gap-1.5 px-3 py-1.5"
                            >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {request.status}
                            </Badge>
                            <Badge variant="outline">
                                {request.requestType === RequestType.NEW
                                    ? "New Asset"
                                    : "Maintenance"}
                            </Badge>
                        </div>

                        <Separator />

                        {/* Request Info */}
                        <div className="space-y-4">
                            <DetailRow
                                icon={User}
                                label="Requester"
                                value={request.requester ?? request.requesterName ?? "Unknown"}
                            />
                            <DetailRow
                                icon={Package}
                                label="Asset Type"
                                value={request.assetTypeName ?? request.typeName ?? "N/A"}
                            />
                            {request.assetName && (
                                <DetailRow
                                    icon={Package}
                                    label="Asset"
                                    value={request.assetName}
                                />
                            )}
                            <DetailRow
                                icon={Calendar}
                                label="Request Date"
                                value={new Date(request.requestDate).toLocaleDateString()}
                            />
                            {request.note && (
                                <DetailRow
                                    icon={MessageSquare}
                                    label="Note"
                                    value={request.note}
                                />
                            )}
                        </div>

                        {/* Approval/Rejection Info */}
                        {request.status !== RequestStatus.PENDING && (
                            <>
                                <Separator />
                                <div className="space-y-4">
                                    {request.approvedBy && (
                                        <DetailRow
                                            icon={User}
                                            label={
                                                request.status === RequestStatus.APPROVED
                                                    ? "Approved By"
                                                    : "Handled By"
                                            }
                                            value={request.approvedBy}
                                        />
                                    )}
                                    {request.approvedDate && (
                                        <DetailRow
                                            icon={Calendar}
                                            label="Decision Date"
                                            value={new Date(request.approvedDate).toLocaleDateString()}
                                        />
                                    )}
                                    {request.rejectionNote && (
                                        <DetailRow
                                            icon={MessageSquare}
                                            label="Rejection Reason"
                                            value={request.rejectionNote}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {/* Timeline */}
                        <Separator />
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                Timeline
                            </p>
                            <div className="relative pl-6">
                                <div className="absolute left-[9px] top-2 h-full w-px bg-border" />
                                <TimelineItem
                                    icon={FileText}
                                    title="Request Created"
                                    date={new Date(request.requestDate).toLocaleString()}
                                    isFirst
                                />
                                {request.status === RequestStatus.APPROVED && (
                                    <TimelineItem
                                        icon={CheckCircle}
                                        title="Request Approved"
                                        date={
                                            request.approvedDate
                                                ? new Date(request.approvedDate).toLocaleString()
                                                : "—"
                                        }
                                        variant="success"
                                    />
                                )}
                                {request.status === RequestStatus.REJECTED && (
                                    <TimelineItem
                                        icon={XCircle}
                                        title="Request Rejected"
                                        date={
                                            request.approvedDate
                                                ? new Date(request.approvedDate).toLocaleString()
                                                : "—"
                                        }
                                        variant="destructive"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        Request not found
                    </div>
                )}
            </DialogContent>
        </Dialog>
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
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium break-words">{value}</p>
            </div>
        </div>
    );
}

function TimelineItem({
    icon: Icon,
    title,
    date,
    variant = "default",
    isFirst = false,
}: {
    icon: React.ElementType;
    title: string;
    date: string;
    variant?: "default" | "success" | "destructive";
    isFirst?: boolean;
}) {
    const variantStyles = {
        default: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        destructive: "bg-destructive/10 text-destructive",
    };

    return (
        <div className="relative flex gap-3 pb-4 last:pb-0">
            <div
                className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${variantStyles[variant]}`}
            >
                <Icon className="h-3 w-3" />
            </div>
            <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
            </div>
        </div>
    );
}
