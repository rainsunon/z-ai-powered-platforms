"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MoreHorizontal, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Role } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { type Location } from "@/types";
import { locationsService } from "@/services/locations.service";
import { staggerContainer } from "@/lib/animations";

export default function LocationsPage() {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", address: "", isActive: true });

  const fetchLocations = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await locationsService.getLocations();
      setLocations(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load locations";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchLocations();
  }, [fetchLocations]);

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setSelectedLocation(location);
      setFormData({ name: location.name, address: location.address ?? "", isActive: location.isActive });
    } else {
      setSelectedLocation(null);
      setFormData({ name: "", address: "", isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLocation(null);
    setFormData({ name: "", address: "", isActive: true });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Location name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedLocation) {
        await locationsService.updateLocation(selectedLocation.id, formData);
        toast.success("Location updated successfully");
      } else {
        await locationsService.createLocation(formData);
        toast.success("Location created successfully");
      }
      void handleCloseDialog();
      void fetchLocations();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save location";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;
    setIsSubmitting(true);
    try {
      await locationsService.deleteLocation(selectedLocation.id);
      toast.success("Location deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
      void fetchLocations();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete location";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Location>[] = [
    {
      key: "name",
      header: "Name",
      cell: (location) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{location.name}</span>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      cell: (location) => location.address ?? "-",
    },
    {
      key: "isActive",
      header: "Status",
      cell: (location) => (
        <Badge variant={location.isActive ? "default" : "secondary"}>
          {location.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (location) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDialog(location)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedLocation(location);
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
          title="Locations"
          description="Manage asset locations"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Locations" },
          ]}
          actions={
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={locations}
          isLoading={isLoading}
          emptyMessage="No locations found"
          emptyDescription="Create your first location to get started"
          getRowKey={(location) => location.id}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedLocation ? "Edit Location" : "Add Location"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Headquarters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City, State"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedLocation ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Location"
          description={`Are you sure you want to delete "${selectedLocation?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          isLoading={isSubmitting}
        />
      </motion.div>
    </AuthGuard>
  );
}

