"use client";

import * as React from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Box } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { type AssetType, type AssetCategory } from "@/types";
import { assetsService } from "@/services/assets.service";
import { categoriesService } from "@/services/categories.service";

export default function TypesPage() {
  const [types, setTypes] = React.useState<AssetType[]>([]);
  const [categories, setCategories] = React.useState<AssetCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<AssetType | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", categoryId: "" });

  const fetchTypes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await assetsService.getTypes();
      setTypes(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to load types";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to load categories";
      toast.error(errorMessage);
    }
  }, []);

  React.useEffect(() => {
    void fetchTypes();
    void fetchCategories();
  }, [fetchTypes, fetchCategories]);

  const handleOpenDialog = (type?: AssetType) => {
    if (type) {
      setSelectedType(type);
      // Handle both categoryId and category.id from backend response
      const categoryId = type.categoryId ?? (type as unknown as { category?: { id: number } }).category?.id;
      setFormData({ name: type.name, categoryId: categoryId ? String(categoryId) : "" });
    } else {
      setSelectedType(null);
      setFormData({ name: "", categoryId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedType(null);
    setFormData({ name: "", categoryId: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Type name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const typeData = {
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
      };
      if (selectedType) {
        await assetsService.updateType(selectedType.id, typeData);
        toast.success("Type updated successfully");
      } else {
        await assetsService.createType(typeData);
        toast.success("Type created successfully");
      }
      void handleCloseDialog();
      void fetchTypes();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to save type";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;
    setIsSubmitting(true);
    try {
      await assetsService.deleteType(selectedType.id);
      toast.success("Type deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedType(null);
      void fetchTypes();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unable to delete type";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<AssetType>[] = [
    {
      key: "name",
      header: "Name",
      cell: (type) => (
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{type.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (type) => {
        // Handle both categoryId and category.name from backend
        const categoryId = type.categoryId ?? (type as unknown as { category?: { id: number } }).category?.id;
        const categoryName = type.categoryName ?? (type as unknown as { category?: { name: string } }).category?.name;
        const category = categoryId ? categories.find((c) => c.id === categoryId) : null;
        return <span className="text-muted-foreground">{categoryName ?? category?.name ?? "N/A"}</span>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (type) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDialog(type)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedType(type);
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
      <div className="p-6">
        <PageHeader
          title="Types"
          description="Manage asset types"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Types" },
          ]}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Type
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={types}
          isLoading={isLoading}
          emptyMessage="No types found"
          emptyDescription="Create your first type to get started"
          getRowKey={(type) => type.id}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedType ? "Edit Type" : "Add Type"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Laptop, Monitor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Type"
          description={`Are you sure you want to delete "${selectedType?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          isLoading={isSubmitting}
        />
      </div>
    </AuthGuard>
  );
}

