"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  LogOut,
  ChevronUp,
  MapPin,
  Tag,
  Building,
  UserPlus,
  Box,
} from "lucide-react";

import { Role, useAuthStore } from "@/lib/auth";
import { useAuth } from "@/components/auth-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "My Assets",
    href: "/my-assets",
    icon: Package,
    roles: [Role.EMPLOYEE as Role],
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Package,
    roles: [
      Role.ADMIN as Role,
      Role.IT as Role,
      Role.DEPARTMENT_MANAGER as Role,
    ],
  },
  {
    title: "Requests",
    href: "/requests",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: [
      Role.ADMIN as Role,
      Role.IT as Role,
      Role.DEPARTMENT_MANAGER as Role,
    ],
  },
];

const adminNavItems: NavItem[] = [
  {
    title: "Locations",
    href: "/admin/locations",
    icon: MapPin,
    roles: [Role.ADMIN as Role],
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
    roles: [Role.ADMIN as Role],
  },
  {
    title: "Types",
    href: "/admin/types",
    icon: Box,
    roles: [Role.ADMIN as Role],
  },
  {
    title: "Departments",
    href: "/admin/departments",
    icon: Building,
    roles: [Role.ADMIN as Role],
  },
  {
    title: "Add User",
    href: "/admin/users/add",
    icon: UserPlus,
    roles: [Role.ADMIN as Role],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [Role.ADMIN]: "Admin",
    [Role.IT]: "IT Support",
    [Role.DEPARTMENT_MANAGER]: "Manager",
    [Role.EMPLOYEE]: "Employee",
  };
  return labels[role] || role;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { hasRole } = useAuth();
  const { state } = useSidebar();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for Zustand hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const filteredNavItems = React.useMemo(
    () => {
      // Don't filter until hydrated and user is available
      if (!isHydrated || !user) {
        return navItems.filter((item) => !item.roles); // Return only items without role restrictions
      }
      return navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((role) => hasRole(role));
      });
    },
    [hasRole, isHydrated, user],
  );

  const handleLogout = React.useCallback(() => {
    logout();
    window.location.href = "/login";
  }, [logout]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b">
        <div
          className={`flex h-16 items-center ${state === "collapsed" ? "justify-center px-2" : "px-4"}`}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 ${state === "collapsed" ? "w-full justify-center" : ""}`}
          >
            <div className="from-primary to-primary/80 text-primary-foreground shadow-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-lg transition-all">
              <Package className="h-5 w-5" />
            </div>
            {state !== "collapsed" && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-lg font-bold tracking-tight">
                  Asset Manager
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  Management System
                </span>
              </div>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-muted-foreground px-4 text-xs font-semibold tracking-wider uppercase">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {filteredNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`group hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent relative h-10 rounded-lg transition-all data-[active=true]:font-semibold ${state === "collapsed" ? "justify-center p-2!" : "justify-start"}`}
                    >
                      <Link
                        href={item.href}
                        className={`flex w-full items-center ${state === "collapsed" ? "justify-center" : "gap-3"}`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-sidebar-primary" : ""}`}
                        />
                        {state !== "collapsed" && (
                          <span className="truncate text-sm">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {isHydrated && user && hasRole(Role.ADMIN) && (
          <SidebarGroup>
            {state !== "collapsed" && (
              <SidebarGroupLabel className="text-muted-foreground px-4 text-xs font-semibold tracking-wider uppercase">
                Admin
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {adminNavItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={`group hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent relative h-10 rounded-lg transition-all data-[active=true]:font-semibold ${state === "collapsed" ? "justify-center p-2!" : "justify-start"}`}
                      >
                        <Link
                          href={item.href}
                          className={`flex w-full items-center ${state === "collapsed" ? "justify-center" : "gap-3"}`}
                        >
                          <item.icon
                            className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-sidebar-primary" : ""}`}
                          />
                          {state !== "collapsed" && (
                            <span className="truncate text-sm">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          {/* Theme toggle */}
          <SidebarMenuItem>
            <div
              className={`flex items-center ${state === "collapsed" ? "justify-center" : "justify-between"} px-2 py-1`}
            >
              {state !== "collapsed" && (
                <span className="text-muted-foreground text-xs">Theme</span>
              )}
              <div
                className={
                  state === "collapsed" ? "flex w-full justify-center" : ""
                }
              >
                <ThemeToggle />
              </div>
            </div>
          </SidebarMenuItem>

          {/* User menu */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`data-[state=open]:bg-sidebar-accent ${state === "collapsed" ? "justify-center" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user ? getInitials(user.username) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  {state !== "collapsed" && (
                    <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                      <span className="max-w-[140px] truncate text-sm font-semibold">
                        {user?.username ?? "User"}
                      </span>
                      <span className="text-muted-foreground truncate text-xs font-medium">
                        {user ? getRoleLabel(user.role) : ""}
                      </span>
                    </div>
                  )}
                  {state !== "collapsed" && (
                    <ChevronUp className="ml-auto h-4 w-4 shrink-0" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side="top"
                align="start"
                sideOffset={8}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
