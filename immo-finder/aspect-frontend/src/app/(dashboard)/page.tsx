"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { useAuth } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { dashboardService } from "@/services/dashboard.service";
import { requestsService, type RequestStats } from "@/services/requests.service";
import { assetsService } from "@/services/assets.service";
import type { DashboardStats } from "@/services/dashboard.service";
import { AssetStatus } from "@/types";

export default function DashboardPage() {
  const { user, isAdmin, isIT, isManager, isEmployee } = useAuth();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      if (isAdmin() && isMounted) {
        setIsLoadingStats(true);
        try {
          const data = await dashboardService.getDashboardStats();
          if (isMounted) {
            setStats(data);
            setIsLoadingStats(false);
          }
        } catch (error: unknown) {
          console.error("Failed to load dashboard stats:", error);
          if (isMounted) {
            setStats(null);
            setIsLoadingStats(false);
          }
        }
      } else if (isMounted) {
        setIsLoadingStats(false);
      }
    }

    void fetchStats();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <PageHeader
        title={`${getGreeting()}, ${user?.username ?? "User"}!`}
        description="Here's an overview of your asset management system"
        actions={
          isAdmin() && (
            <Button asChild size="default">
              <Link href="/assets/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Link>
            </Button>
          )
        }
      />

      {/* Stats Grid - Role Based */}
      {isAdmin() && (
        <AdminStats stats={stats} isLoading={isLoadingStats} />
      )}
      {isIT() && <ITStats />}
      {isManager() && <ManagerStats />}
      {isEmployee() && <EmployeeStats />}

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {isAdmin() && (
              <>
                <QuickAction
                  href="/assets/add"
                  icon={Package}
                  label="Add New Asset"
                  description="Register a new asset in the system"
                />
                <QuickAction
                  href="/users"
                  icon={Users}
                  label="Manage Users"
                  description="View and manage user accounts"
                />
              </>
            )}
            {(isAdmin() || isIT() || isManager()) && (
              <QuickAction
                href="/requests"
                icon={FileText}
                label="View Requests"
                description="Review pending asset requests"
              />
            )}
            {isEmployee() && (
              <QuickAction
                href="/my-assets"
                icon={Package}
                label="My Assets"
                description="View your assigned assets"
              />
            )}
            <QuickAction
              href="/requests/add"
              icon={Plus}
              label="New Request"
              description="Submit a new asset request"
            />
            {(isAdmin() || isIT() || isManager()) && (
              <QuickAction
                href="/assets"
                icon={Package}
                label="Browse Assets"
                description="View all available assets"
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Admin Stats Component
function AdminStats({
  stats,
  isLoading,
}: {
  stats: DashboardStats | null;
  isLoading: boolean;
}) {
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

  // Don't render if no stats or all values are zero
  if (
    !stats ||
    (stats.totalAssets === 0 &&
      stats.totalUsers === 0 &&
      stats.pendingRequests === 0 &&
      stats.availableAssets === 0)
  ) {
    return null;
  }
  return (
    <StatCardGrid>
      <StatCard
        title="Total Assets"
        value={stats.totalAssets ?? 0}
        icon={Package}
        variant="primary"
        description="All registered assets"
      />
      <StatCard
        title="Available"
        value={stats.availableAssets ?? 0}
        icon={CheckCircle}
        variant="success"
        description="Ready for assignment"
      />
      <StatCard
        title="Pending Requests"
        value={stats.pendingRequests ?? 0}
        icon={Clock}
        variant="warning"
        description="Awaiting review"
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers ?? 0}
        icon={Users}
        description="Active users"
      />
    </StatCardGrid>
  );
}

// IT Stats Component - Shows maintenance-focused stats
function ITStats() {
  const [maintenanceCount, setMaintenanceCount] = React.useState<number | null>(null);
  const [requestStats, setRequestStats] = React.useState<RequestStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchITStats() {
      try {
        // Fetch assets under maintenance and pending requests
        const [assetsResponse, reqStats] = await Promise.all([
          assetsService.getAssets(0, 1, { status: AssetStatus.UNDER_MAINTENANCE }),
          requestsService.getRequestStats(),
        ]);

        if (isMounted) {
          setMaintenanceCount(assetsResponse.totalElements);
          setRequestStats(reqStats);
        }
      } catch (error) {
        console.error("Failed to load IT stats:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchITStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <StatCardGrid>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-border/50 p-6 shadow-sm">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-2 h-10 w-16" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </StatCardGrid>
    );
  }

  return (
    <StatCardGrid>
      <StatCard
        title="Under Maintenance"
        value={maintenanceCount ?? 0}
        icon={Wrench}
        variant="warning"
        description="Assets requiring attention"
      />
      <StatCard
        title="Pending Requests"
        value={requestStats?.pending ?? 0}
        icon={Clock}
        variant="warning"
        description="Awaiting your review"
      />
      <StatCard
        title="Approved Today"
        value={requestStats?.approved ?? 0}
        icon={CheckCircle}
        variant="success"
        description="Requests approved"
      />
      <StatCard
        title="Total Handled"
        value={(requestStats?.approved ?? 0) + (requestStats?.rejected ?? 0)}
        icon={TrendingUp}
        description="Total processed requests"
      />
    </StatCardGrid>
  );
}

// Manager Stats Component - Shows department-focused stats
function ManagerStats() {
  const [requestStats, setRequestStats] = React.useState<RequestStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchManagerStats() {
      try {
        const reqStats = await requestsService.getRequestStats();
        if (isMounted) {
          setRequestStats(reqStats);
        }
      } catch (error) {
        console.error("Failed to load manager stats:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchManagerStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <StatCardGrid>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-border/50 p-6 shadow-sm">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-2 h-10 w-16" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </StatCardGrid>
    );
  }

  return (
    <StatCardGrid>
      <StatCard
        title="Pending Approvals"
        value={requestStats?.pending ?? 0}
        icon={Clock}
        variant="warning"
        description="Requests awaiting your approval"
      />
      <StatCard
        title="Approved Requests"
        value={requestStats?.approved ?? 0}
        icon={CheckCircle}
        variant="success"
        description="Total approved requests"
      />
    </StatCardGrid>
  );
}

// Employee Stats Component - Shows personal asset stats
function EmployeeStats() {
  const { user } = useAuth();
  const [myAssetCount, setMyAssetCount] = React.useState<number | null>(null);
  const [myRequestCount, setMyRequestCount] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchEmployeeStats() {
      if (!user) return;

      try {
        // Fetch assigned assets and my requests
        const [assetsResponse, requestsResponse] = await Promise.all([
          assetsService.getMyAssets(0, 100),
          requestsService.getRequests(0, 100),
        ]);

        if (isMounted) {
          // Backend already filters by myAssetsFlag, so use the response directly
          setMyAssetCount(assetsResponse.totalElements);

          // Filter requests by current user
          const myRequests = requestsResponse.content.filter(
            (req) => req.requester === user.username || req.requesterName === user.username
          );
          setMyRequestCount(myRequests.length);
        }
      } catch (error) {
        console.error("Failed to load employee stats:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchEmployeeStats();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <StatCardGrid>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-border/50 p-6 shadow-sm">
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-2 h-10 w-16" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </StatCardGrid>
    );
  }

  return (
    <StatCardGrid>
      <StatCard
        title="My Assets"
        value={myAssetCount ?? 0}
        icon={Package}
        variant="primary"
        description="Assets assigned to you"
      />
      <StatCard
        title="My Requests"
        value={myRequestCount ?? 0}
        icon={FileText}
        description="Your submitted requests"
      />
    </StatCardGrid>
  );
}

// Quick Action Component
function QuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group border-border/60 bg-card hover:border-primary/40 hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 transition-all hover:shadow-sm"
    >
      <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-sm leading-none font-semibold">{label}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
