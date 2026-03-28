"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MoreHorizontal, Building } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Role } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { type Department } from "@/types";
import { departmentsService } from "@/services/departments.service";
import { staggerContainer } from "@/lib/animations";

export default function DepartmentsPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "" });

  const fetchDepartments = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await departmentsService.getDepartments();
      setDepartments(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load departments";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({ name: department.name });
    } else {
      setSelectedDepartment(null);
      setFormData({ name: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDepartment(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await departmentsService.updateDepartment(selectedDepartment.id, formData);
        toast.success("Department updated successfully");
      } else {
        await departmentsService.createDepartment(formData);
        toast.success("Department created successfully");
      }
      void handleCloseDialog();
      void fetchDepartments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save department";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    setIsSubmitting(true);
    try {
      await departmentsService.deleteDepartment(selectedDepartment.id);
      toast.success("Department deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      void fetchDepartments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete department";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Department>[] = [
    {
      key: "name",
      header: "Name",
      cell: (department) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{department.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (department) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDialog(department)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedDepartment(department);
                setIsDeleteDialogOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <motion.div
        className="p-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <PageHeader
          title="Departments"
          description="Manage departments"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Departments" },
          ]}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={departments}
          isLoading={isLoading}
          emptyMessage="No departments found"
          emptyDescription="Create your first department to get started"
          getRowKey={(department) => department.id}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDepartment ? "Edit Department" : "Add Department"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedDepartment ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Department"
          description={`Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          isLoading={isSubmitting}
        />
      </motion.div>
    </AuthGuard>
  );
}

