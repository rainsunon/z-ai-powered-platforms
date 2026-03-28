"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Eye, MoreHorizontal, Mail, Building } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Role } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type User, type UserDetails, type Department } from "@/types";
import { usersService } from "@/services/users.service";
import { staggerContainer } from "@/lib/animations";

const roleColors: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ADMIN: "default",
  IT: "secondary",
  DEPARTMENT_MANAGER: "outline",
  EMPLOYEE: "outline",
};

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  IT: "IT Support",
  DEPARTMENT_MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");

  const [selectedUser, setSelectedUser] = React.useState<UserDetails | null>(
    null,
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [loadingDetails, setLoadingDetails] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await usersService.getUsers(page, pageSize, {
        search: searchValue || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        departmentId:
          departmentFilter !== "all" ? Number(departmentFilter) : undefined,
      });
      setUsers(response.content);
      setTotalItems(response.totalElements);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load users. Please check your connection and try again.";
      toast.error(errorMessage);
      console.error("Error loading users:", error);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchValue, roleFilter, departmentFilter]);

  React.useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await usersService.getDepartments();
        setDepartments(data);
      } catch (error: unknown) {
        console.error("Error loading departments:", error);
        setDepartments([]);
      }
    }
    void fetchDepartments();
  }, []);

  const handleViewDetails = async (userId: number) => {
    setLoadingDetails(true);
    setDetailsDialogOpen(true);
    setSelectedUser(null); // Clear previous details
    try {
      const details = await usersService.getUserDetails(userId);
      setSelectedUser(details);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load user details. Please try again.";
      toast.error(errorMessage);
      console.error("Error loading user details:", error);
      setDetailsDialogOpen(false);
      setSelectedUser(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "username",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => (
        <Badge variant={roleColors[user.role] ?? "outline"}>
          {roleLabels[user.role] ?? user.role}
        </Badge>
      ),
    },
    {
      key: "departmentName",
      header: "Department",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Building className="text-muted-foreground h-4 w-4" />
          <span>{user.departmentName ?? "-"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (window.location.href = `mailto:${user.email}`)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AuthGuard allowedRoles={[Role.ADMIN, Role.IT, Role.DEPARTMENT_MANAGER]}>
      <motion.div
        className="p-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <PageHeader
          title="Users"
          description="View and manage user accounts"
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Users" }]}
        />

        {/* Filters */}
        <div className="mb-4 flex items-center gap-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(roleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          emptyMessage="No users found"
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search users..."
          getRowKey={(user) => user.id}
        />

        {/* User Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {loadingDetails ? (
              <div className="space-y-4 py-4">
                <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
              </div>
            ) : selectedUser ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(
                        selectedUser.fullName || selectedUser.username,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">
                      {selectedUser.fullName || selectedUser.username}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 border-t pt-4">
                  <DetailItem
                    label="Role"
                    value={roleLabels[selectedUser.role] ?? selectedUser.role}
                  />
                  <DetailItem
                    label="Department"
                    value={selectedUser.departmentName ?? "-"}
                  />
                  <DetailItem label="Phone" value={selectedUser.phone ?? "-"} />
                  <DetailItem
                    label="Hire Date"
                    value={
                      selectedUser.hireDate
                        ? new Date(selectedUser.hireDate).toLocaleDateString()
                        : "-"
                    }
                  />
                  <DetailItem
                    label="Status"
                    value={
                      <Badge
                        variant={
                          selectedUser.isActive ? "default" : "destructive"
                        }
                      >
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                    }
                  />
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AuthGuard>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
