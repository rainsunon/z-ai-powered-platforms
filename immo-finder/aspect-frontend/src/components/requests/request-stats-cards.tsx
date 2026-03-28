"use client";

import * as React from "react";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requestsService, type RequestStats } from "@/services/requests.service";

interface RequestStatsCardsProps {
    className?: string;
}

export function RequestStatsCards({ className }: RequestStatsCardsProps) {
    const [stats, setStats] = React.useState<RequestStats | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;

        async function fetchStats() {
            try {
                const data = await requestsService.getRequestStats();
                if (isMounted) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to load request stats:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void fetchStats();
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <StatCardGrid>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-border/50 p-6 shadow-sm">
                        <Skeleton className="mb-3 h-5 w-24" />
                        <Skeleton className="mb-2 h-10 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </Card>
                ))}
            </StatCardGrid>
        );
    }

    if (!stats) {
        return null;
    }

    const total = stats.pending + stats.approved + stats.rejected;

    return (
        <StatCardGrid>
            <StatCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                variant="warning"
                description="Awaiting review"
            />
            <StatCard
                title="Approved"
                value={stats.approved}
                icon={CheckCircle}
                variant="success"
                description="Requests approved"
            />
            <StatCard
                title="Rejected"
                value={stats.rejected}
                icon={XCircle}
                variant="destructive"
                description="Requests rejected"
            />
            <StatCard
                title="Total"
                value={total}
                icon={TrendingUp}
                description="All time requests"
            />
        </StatCardGrid>
    );
}
