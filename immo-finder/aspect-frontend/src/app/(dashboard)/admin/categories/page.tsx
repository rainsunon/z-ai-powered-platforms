"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MoreHorizontal, Tag } from "lucide-react";
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
import { type AssetCategory } from "@/types";
import { categoriesService } from "@/services/categories.service";
import { staggerContainer } from "@/lib/animations";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<AssetCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<AssetCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "" });

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load categories";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleOpenDialog = (category?: AssetCategory) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({ name: category.name });
    } else {
      setSelectedCategory(null);
      setFormData({ name: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await categoriesService.updateCategory(selectedCategory.id, formData);
        toast.success("Category updated successfully");
      } else {
        await categoriesService.createCategory(formData);
        toast.success("Category created successfully");
      }
      void handleCloseDialog();
      void fetchCategories();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save category";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await categoriesService.deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      void fetchCategories();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<AssetCategory>[] = [
    {
      key: "name",
      header: "Name",
      cell: (category) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{category.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedCategory(category);
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
          title="Categories"
          description="Manage asset categories"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Categories" },
          ]}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyMessage="No categories found"
          emptyDescription="Create your first category to get started"
          getRowKey={(category) => category.id}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electronics"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Category"
          description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          isLoading={isSubmitting}
        />
      </motion.div>
    </AuthGuard>
  );
}

