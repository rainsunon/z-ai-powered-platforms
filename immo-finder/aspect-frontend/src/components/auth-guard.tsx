"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/lib/auth";
import { GlobalLoading } from "@/components/global-loading";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for zustand hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    // Don't check until hydrated
    if (!isHydrated) return;

    // Small delay to ensure state is stable
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Check role-based access
      if (allowedRoles && allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role)) {
          // Redirect to dashboard if user doesn't have required role
          router.replace("/");
          return;
        }
      }

      setIsChecking(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, allowedRoles, router, isHydrated]);

  if (isChecking) {
    return <GlobalLoading />;
  }

  if (!isAuthenticated) {
    return <GlobalLoading />;
  }

  return <>{children}</>;
}

// HOC version for wrapping pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Role[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for checking permissions
export function useAuth() {
  const { user, isAuthenticated, hasRole, isAdmin, isIT, isManager, isEmployee } =
    useAuthStore();

  const canManageAssets = React.useMemo(() => {
    return hasRole(Role.ADMIN);
  }, [hasRole]);

  const canAssignAssets = React.useMemo(() => {
    return hasRole(Role.ADMIN, Role.IT, Role.DEPARTMENT_MANAGER);
  }, [hasRole]);

  const canViewUsers = React.useMemo(() => {
    return hasRole(Role.ADMIN, Role.IT, Role.DEPARTMENT_MANAGER);
  }, [hasRole]);

  const canManageRequests = React.useMemo(() => {
    return hasRole(Role.ADMIN, Role.IT);
  }, [hasRole]);

  return {
    user,
    isAuthenticated,
    hasRole,
    isAdmin,
    isIT,
    isManager,
    isEmployee,
    canManageAssets,
    canAssignAssets,
    canViewUsers,
    canManageRequests,
  };
}

