"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth-guard";
import { Role } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetStatus } from "@/types";
import type { AssetCategory, Location, AssetType } from "@/types";
import { assetsService } from "@/services/assets.service";
import { locationsService } from "@/services/locations.service";
import { Skeleton } from "@/components/ui/skeleton";

const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  description: z.string().optional(),
  locationId: z.string().min(1, "Location is required"),
  categoryId: z.string().min(1, "Category is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyEndDate: z.string().min(1, "Warranty end date is required"),
  status: z.nativeEnum(AssetStatus),
});

type AssetFormData = z.infer<typeof assetSchema>;

export default function AddAssetPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [categories, setCategories] = React.useState<AssetCategory[]>([]);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedTypeId, setSelectedTypeId] = React.useState<number | null>(
    null,
  );
  const [types, setTypes] = React.useState<AssetType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = React.useState(false);
  const [showCreateTypeDialog, setShowCreateTypeDialog] = React.useState(false);
  const [newTypeName, setNewTypeName] = React.useState("");
  const [isCreatingType, setIsCreatingType] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      status: AssetStatus.AVAILABLE,
    },
  });

  const selectedCategoryId = watch("categoryId");

  React.useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      try {
        const [categoriesData, locationsData] = await Promise.all([
          assetsService.getCategories(),
          locationsService.getLocations(),
        ]);
        setCategories(categoriesData);
        setLocations(locationsData.filter((loc) => loc.isActive));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to load form data";
        toast.error(errorMessage);
      } finally {
        setIsLoadingData(false);
      }
    }
    void fetchData();
  }, []);

  // Auto-fetch and set first type when category is selected
  React.useEffect(() => {
    async function fetchAndSetFirstType() {
      if (selectedCategoryId) {
        setIsLoadingTypes(true);
        setSelectedTypeId(null); // Clear previous selection
        try {
          const fetchedTypes = await assetsService.getTypes(
            Number(selectedCategoryId),
          );
          setTypes(fetchedTypes);
          if (fetchedTypes.length > 0 && fetchedTypes[0]) {
            const firstTypeId = fetchedTypes[0].id;
            setSelectedTypeId(firstTypeId);
          } else {
            setSelectedTypeId(null);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unable to load types";
          toast.error(errorMessage);
          setSelectedTypeId(null);
          setTypes([]);
        } finally {
          setIsLoadingTypes(false);
        }
      } else {
        setSelectedTypeId(null);
        setTypes([]);
      }
    }
    void fetchAndSetFirstType();
  }, [selectedCategoryId, setValue]);

  const handleCreateType = async (): Promise<void> => {
    if (!newTypeName.trim() || !selectedCategoryId) {
      toast.error("Please enter a type name");
      return;
    }

    setIsCreatingType(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await assetsService.createType({
        name: newTypeName.trim(),
        categoryId: Number(selectedCategoryId),
      });
      const newType: AssetType = {
        id: response.id,
        name: response.name,
        categoryId: response.categoryId,
        categoryName: response.categoryName,
      };
      toast.success("Type created successfully");
      setTypes((prevTypes) => [...prevTypes, newType]);
      setSelectedTypeId(newType.id);
      setNewTypeName("");
      setShowCreateTypeDialog(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to create type";
      toast.error(errorMessage);
    } finally {
      setIsCreatingType(false);
    }
  };

  const onSubmit = async (data: AssetFormData) => {
    setIsLoading(true);
    try {
      // Validate that we have a typeId
      if (!selectedTypeId || !data.categoryId) {
        toast.error(
          "Please select a category first. No types available for the selected category.",
        );
        setIsLoading(false);
        return;
      }

      // Map frontend form data to backend DTO structure
      const assetData = {
        name: data.name,
        brand: data.brand,
        assetDescription: data.description,
        serialNumber: data.serialNumber,
        locationId: Number(data.locationId),
        categoryId: Number(data.categoryId),
        typeId: selectedTypeId, // Use the automatically selected first type
        purchaseDate: data.purchaseDate
          ? `${data.purchaseDate}T00:00:00`
          : undefined,
        warrantyEndDate: data.warrantyEndDate
          ? `${data.warrantyEndDate}T00:00:00`
          : undefined,
        status: data.status,
      };
      await assetsService.createAsset(assetData);
      toast.success("Asset created successfully");
      router.push("/assets");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to create asset";
      toast.error(errorMessage);
      console.error("Asset creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <div className="flex min-h-screen flex-col items-center justify-start p-6">
        <div className="w-full max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <PageHeader
            title="Add New Asset"
            description="Register a new asset in the system"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Assets", href: "/assets" },
              { label: "Add Asset" },
            ]}
          />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder='e.g., MacBook Pro 16"'
                        {...register("name")}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-destructive text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Apple"
                        {...register("brand")}
                        className={errors.brand ? "border-destructive" : ""}
                      />
                      {errors.brand && (
                        <p className="text-destructive text-xs">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>

                    {/* Serial Number */}
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Serial Number *</Label>
                      <Input
                        id="serialNumber"
                        placeholder="e.g., SN12345678"
                        {...register("serialNumber")}
                        className={
                          errors.serialNumber ? "border-destructive" : ""
                        }
                      />
                      {errors.serialNumber && (
                        <p className="text-destructive text-xs">
                          {errors.serialNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="locationId">Location *</Label>
                      <Select
                        onValueChange={(value) => setValue("locationId", value)}
                      >
                        <SelectTrigger
                          className={`w-full ${errors.locationId ? "border-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {locations.map((loc) => (
                            <SelectItem
                              key={loc.id}
                              value={String(loc.id)}
                              className="cursor-pointer"
                            >
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.locationId && (
                        <p className="text-destructive text-xs">
                          {errors.locationId.message}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category *</Label>
                      <Select
                        value={watch("categoryId")}
                        onValueChange={(value) => {
                          setValue("categoryId", value);
                        }}
                      >
                        <SelectTrigger
                          className={`w-full ${errors.categoryId ? "border-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent
                          className="max-h-[300px]"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={String(cat.id)}
                              className="cursor-pointer"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-destructive text-xs">
                          {errors.categoryId.message}
                        </p>
                      )}
                    </div>

                    {/* Type - Always visible, disabled until loaded */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={selectedTypeId ? String(selectedTypeId) : ""}
                        onValueChange={(value) =>
                          setSelectedTypeId(Number(value))
                        }
                        disabled={
                          !selectedCategoryId ||
                          isLoadingTypes ||
                          types.length === 0
                        }
                      >
                        <SelectTrigger
                          className={`w-full ${errors.categoryId ? "border-destructive" : ""}`}
                        >
                          <SelectValue
                            placeholder={
                              !selectedCategoryId
                                ? "Select category first"
                                : isLoadingTypes
                                  ? "Loading types..."
                                  : types.length === 0
                                    ? "No types available"
                                    : "Select type"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {types.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={String(type.id)}
                              className="cursor-pointer"
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!selectedCategoryId && (
                        <p className="text-muted-foreground text-xs">
                          Please select a category first
                        </p>
                      )}
                      {selectedCategoryId && isLoadingTypes && (
                        <p className="text-muted-foreground text-xs">
                          Loading types for selected category...
                        </p>
                      )}
                      {selectedCategoryId &&
                        !isLoadingTypes &&
                        types.length === 0 && (
                          <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                            <p className="mb-2 text-sm text-amber-800">
                              No types available for this category.
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCreateTypeDialog(true)}
                              className="w-full"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create Type
                            </Button>
                          </div>
                        )}
                    </div>

                    {/* Purchase Date */}
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date *</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        {...register("purchaseDate")}
                        className={
                          errors.purchaseDate ? "border-destructive" : ""
                        }
                      />
                      {errors.purchaseDate && (
                        <p className="text-destructive text-xs">
                          {errors.purchaseDate.message}
                        </p>
                      )}
                    </div>

                    {/* Warranty End Date */}
                    <div className="space-y-2">
                      <Label htmlFor="warrantyEndDate">
                        Warranty End Date *
                      </Label>
                      <Input
                        id="warrantyEndDate"
                        type="date"
                        {...register("warrantyEndDate")}
                        className={
                          errors.warrantyEndDate ? "border-destructive" : ""
                        }
                      />
                      {errors.warrantyEndDate && (
                        <p className="text-destructive text-xs">
                          {errors.warrantyEndDate.message}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        defaultValue={AssetStatus.AVAILABLE}
                        onValueChange={(value) =>
                          setValue("status", value as AssetStatus)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {Object.values(AssetStatus).map((status) => {
                            const statusConfig: Record<
                              AssetStatus,
                              { label: string; className: string }
                            > = {
                              [AssetStatus.AVAILABLE]: {
                                label: "Available",
                                className:
                                  "text-green-700 bg-green-100 border-green-300",
                              },
                              [AssetStatus.ASSIGNED]: {
                                label: "Assigned",
                                className:
                                  "text-blue-700 bg-blue-100 border-blue-300",
                              },
                              [AssetStatus.UNDER_MAINTENANCE]: {
                                label: "Under Maintenance",
                                className:
                                  "text-amber-700 bg-amber-100 border-amber-300",
                              },
                              [AssetStatus.RETIRED]: {
                                label: "Retired",
                                className:
                                  "text-gray-700 bg-gray-100 border-gray-300",
                              },
                            };
                            const config = statusConfig[status];
                            return (
                              <SelectItem
                                key={status}
                                value={status}
                                className="cursor-pointer"
                              >
                                <span
                                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${config.className}`}
                                >
                                  {config.label}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        placeholder="Additional details about the asset"
                        {...register("description")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-4 border-t pt-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Asset
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Type Dialog */}
      {showCreateTypeDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCreatingType) {
              setShowCreateTypeDialog(false);
              setNewTypeName("");
            }
          }}
        >
          <Card
            className="m-4 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Type</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!isCreatingType) {
                    setShowCreateTypeDialog(false);
                    setNewTypeName("");
                  }
                }}
                disabled={isCreatingType}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newTypeName">Type Name *</Label>
                <Input
                  id="newTypeName"
                  placeholder="e.g., Laptop, Monitor, Keyboard"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleCreateType();
                    }
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  Category:{" "}
                  {categories.find((c) => String(c.id) === selectedCategoryId)
                    ?.name ?? "N/A"}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateTypeDialog(false);
                    setNewTypeName("");
                  }}
                  disabled={isCreatingType}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateType}
                  disabled={isCreatingType || !newTypeName.trim()}
                >
                  {isCreatingType ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Type
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AuthGuard>
  );
}
