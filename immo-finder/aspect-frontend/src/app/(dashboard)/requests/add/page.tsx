"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

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
import {  RequestType, type AssetType, type AssetCategory, type AssetListDTO } from "@/types";
import { requestsService } from "@/services/requests.service";
import { assetsService } from "@/services/assets.service";
import { useAuth } from "@/components/auth-guard";
import { useAuthStore } from "@/lib/auth";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "framer-motion";

const requestSchema = z.object({
  requestType: z.nativeEnum(RequestType),
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  assetId: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  // For NEW requests: categoryId and typeId are required
  if (data.requestType === RequestType.NEW) {
    return data.categoryId && data.categoryId.length > 0 && data.typeId && data.typeId.length > 0;
  }
  // For MAINTENANCE requests: assetId is required
  if (data.requestType === RequestType.MAINTENANCE) {
    return data.assetId && data.assetId.length > 0;
  }
  return true;
}, {
  message: "Please fill all required fields",
  path: ["requestType"],
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function AddRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [categories, setCategories] = React.useState<AssetCategory[]>([]);
  const [types, setTypes] = React.useState<AssetType[]>([]);
  const [myAssets, setMyAssets] = React.useState<AssetListDTO[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = React.useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for Zustand hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if not authenticated after hydration
  React.useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      requestType: RequestType.NEW,
    },
  });

  const selectedCategoryId = watch("categoryId");
  const requestType = watch("requestType");

  React.useEffect(() => {
    async function fetchCategories() {
      setIsLoadingData(true);
      try {
        const data = await assetsService.getCategories();
        setCategories(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load categories";
        toast.error(errorMessage);
      } finally {
        setIsLoadingData(false);
      }
    }
    void fetchCategories();
  }, []);

  React.useEffect(() => {
    async function fetchTypes() {
      if (selectedCategoryId) {
        setIsLoadingTypes(true);
        setTypes([]); // Clear previous types immediately
        try {
          const data = await assetsService.getTypes(Number(selectedCategoryId));
          setTypes(data);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load asset types";
          toast.error(errorMessage);
          setTypes([]);
        } finally {
          setIsLoadingTypes(false);
        }
      } else {
        setTypes([]);
        setIsLoadingTypes(false);
      }
    }
    void fetchTypes();
  }, [selectedCategoryId]);

  // Fetch user's assigned assets when request type is MAINTENANCE
  React.useEffect(() => {
    async function fetchMyAssets() {
      if (requestType === RequestType.MAINTENANCE && user) {
        setIsLoadingAssets(true);
        try {
          const response = await assetsService.getMyAssets(0, 100);
          if (response && typeof response === "object" && "content" in response) {
            setMyAssets(response.content);
          } else {
            setMyAssets([]);
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load your assets";
          toast.error(errorMessage);
          setMyAssets([]);
        } finally {
          setIsLoadingAssets(false);
        }
      } else {
        setMyAssets([]);
      }
    }
    void fetchMyAssets();
  }, [requestType, user]);

  const onSubmit = async (data: RequestFormData) => {
    // Double-check user is available (should not happen if properly authenticated)
    const currentUser = user ?? useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("You must be logged in to submit a request");
      router.replace("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      // For maintenance requests, typeId should come from the selected asset
      // For new requests, typeId comes from the form
      const assetTypeId = data.typeId ? Number(data.typeId) : undefined;
      
      if (!assetTypeId) {
        toast.error("Asset type is required");
        setIsLoading(false);
        return;
      }

      await requestsService.createRequest({
        assetTypeId: assetTypeId,
        requesterId: currentUser.id,
        requestType: data.requestType,
        assetId: data.assetId ? Number(data.assetId) : undefined,
        note: data.note,
      });
      toast.success("Request submitted successfully");
      router.push("/requests");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit request";
      toast.error(errorMessage);
      console.error("Request submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while waiting for hydration or if not authenticated
  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="New Request"
        description="Submit a new asset request"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Requests", href: "/requests" },
          { label: "New Request" },
        ]}
      />

      <motion.div variants={staggerItem}>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="space-y-6">
                {[...Array(4).keys()].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Request Type */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="requestType">Request Type</Label>
                  <Select
                    defaultValue={RequestType.NEW}
                    onValueChange={(value) => setValue("requestType", value as RequestType)}
                  >
                    <SelectTrigger className="transition-all">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RequestType.NEW}>New Asset</SelectItem>
                      <SelectItem value={RequestType.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Category - Only for NEW requests */}
                {requestType === RequestType.NEW && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="categoryId">Category *</Label>
                    <Select onValueChange={(value) => setValue("categoryId", value)}>
                      <SelectTrigger className={`transition-all ${errors.categoryId ? "border-destructive animate-shake" : ""}`}>
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
                    <AnimatePresence>
                      {errors.categoryId && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-destructive"
                        >
                          {errors.categoryId.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Asset Selection - Only for Maintenance requests */}
                {requestType === RequestType.MAINTENANCE && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="assetId">Select Asset *</Label>
                    <Select
                      value={watch("assetId")}
                      onValueChange={async (value) => {
                        setValue("assetId", value);
                        // Fetch asset details to get typeId
                        try {
                          const assetDetails = await assetsService.getAssetDetails(Number(value));
                          if (assetDetails?.typeId) {
                            setValue("typeId", String(assetDetails.typeId));
                            setValue("categoryId", String(assetDetails.categoryId));
                          }
                        } catch (err: unknown) {
                          console.error("Failed to load asset details:", err);
                        }
                      }}
                      disabled={isLoadingAssets}
                    >
                      <SelectTrigger className={`transition-all ${errors.assetId ? "border-destructive animate-shake" : ""}`}>
                        <SelectValue 
                          placeholder={
                            isLoadingAssets 
                              ? "Loading your assets..." 
                              : myAssets.length === 0 
                                ? "No assigned assets available" 
                                : "Select an asset"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {myAssets.length > 0 ? (
                          myAssets.map((asset) => (
                            <SelectItem key={asset.id} value={String(asset.id)}>
                              {asset.name} - {asset.serialNumber} {asset.brand ? `(${asset.brand})` : ""}
                            </SelectItem>
                          ))
                        ) : isLoadingAssets ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading assets...
                          </div>
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No assigned assets available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {isLoadingAssets && (
                      <p className="text-xs text-muted-foreground">Loading your assigned assets...</p>
                    )}
                    {!isLoadingAssets && myAssets.length === 0 && (
                      <p className="text-xs text-amber-600">
                        You don&apos;t have any assigned assets. Please request an asset assignment first.
                      </p>
                    )}
                    <AnimatePresence>
                      {errors.assetId && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-destructive"
                        >
                          {errors.assetId.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Asset Type - Only for NEW requests */}
                {requestType === RequestType.NEW && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="typeId">Asset Type *</Label>
                    <Select
                      value={watch("typeId")}
                      onValueChange={(value) => setValue("typeId", value)}
                      disabled={!selectedCategoryId || isLoadingTypes || types.length === 0}
                    >
                      <SelectTrigger className={`transition-all ${errors.typeId ? "border-destructive animate-shake" : ""}`}>
                        <SelectValue 
                          placeholder={
                            !selectedCategoryId 
                              ? "Select category first" 
                              : isLoadingTypes 
                                ? "Loading types..." 
                                : types.length === 0 
                                  ? "No types available" 
                                  : "Select asset type"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {types.length > 0 ? (
                          types.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : selectedCategoryId && isLoadingTypes ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading types...
                          </div>
                        ) : selectedCategoryId && !isLoadingTypes ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No types available
                          </div>
                        ) : null}
                      </SelectContent>
                    </Select>
                    {!selectedCategoryId && (
                      <p className="text-xs text-muted-foreground">Please select a category first</p>
                    )}
                    {selectedCategoryId && isLoadingTypes && (
                      <p className="text-xs text-muted-foreground">Loading types for selected category...</p>
                    )}
                    {selectedCategoryId && !isLoadingTypes && types.length === 0 && (
                      <p className="text-xs text-amber-600">No types available for this category. Please create a type first.</p>
                    )}
                    <AnimatePresence>
                      {errors.typeId && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-destructive"
                        >
                          {errors.typeId.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Display Asset Type info for MAINTENANCE requests */}
                {requestType === RequestType.MAINTENANCE && watch("typeId") && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label>Asset Type</Label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                      Automatically determined from selected asset
                    </div>
                  </motion.div>
                )}

                {/* Note */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="Additional details about your request"
                    {...register("note")}
                    className="transition-all"
                  />
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

