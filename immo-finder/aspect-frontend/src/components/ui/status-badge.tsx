"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, Clock, XCircle, Shield, Wrench, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetStatus, RequestStatus } from "@/types";

const statusBadgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                available: "bg-success/10 text-success border border-success/20",
                assigned: "bg-primary/10 text-primary border border-primary/20",
                maintenance: "bg-warning/10 text-warning border border-warning/20",
                retired: "bg-destructive/10 text-destructive border border-destructive/20",
                pending: "bg-warning/10 text-warning border border-warning/20",
                approved: "bg-success/10 text-success border border-success/20",
                rejected: "bg-destructive/10 text-destructive border border-destructive/20",
                default: "bg-muted text-muted-foreground border border-border",
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                md: "px-2.5 py-1 text-xs",
                lg: "px-3 py-1.5 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    status: AssetStatus | RequestStatus | string;
    showIcon?: boolean;
    className?: string;
}

const statusConfig: Record<
    string,
    {
        variant: "available" | "assigned" | "maintenance" | "retired" | "pending" | "approved" | "rejected" | "default";
        icon: React.ElementType;
        label: string;
    }
> = {
    [AssetStatus.AVAILABLE]: {
        variant: "available",
        icon: CheckCircle,
        label: "Available",
    },
    [AssetStatus.ASSIGNED]: {
        variant: "assigned",
        icon: Package,
        label: "Assigned",
    },
    [AssetStatus.UNDER_MAINTENANCE]: {
        variant: "maintenance",
        icon: Wrench,
        label: "Maintenance",
    },
    [AssetStatus.RETIRED]: {
        variant: "retired",
        icon: XCircle,
        label: "Retired",
    },
    [RequestStatus.PENDING]: {
        variant: "pending",
        icon: Clock,
        label: "Pending",
    },
    [RequestStatus.APPROVED]: {
        variant: "approved",
        icon: CheckCircle,
        label: "Approved",
    },
    [RequestStatus.REJECTED]: {
        variant: "rejected",
        icon: XCircle,
        label: "Rejected",
    },
};

export function StatusBadge({
    status,
    showIcon = true,
    size,
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status] ?? {
        variant: "default" as const,
        icon: Shield,
        label: status,
    };

    const Icon = config.icon;

    return (
        <span className={cn(statusBadgeVariants({ variant: config.variant, size }), className)}>
            {showIcon && <Icon className="h-3 w-3" />}
            {config.label}
        </span>
    );
}
