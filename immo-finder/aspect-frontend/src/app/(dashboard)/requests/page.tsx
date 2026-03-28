"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Check, X, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-guard";
import { PageHeader } from "@/components/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { type AssetRequest, RequestStatus, RequestType } from "@/types";
import { requestsService } from "@/services/requests.service";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { RequestStatsCards } from "@/components/requests/request-stats-cards";
import { RequestDetailsModal } from "@/components/requests/request-details-modal";

const statusColors: Record<RequestStatus, "default" | "secondary" | "destructive"> = {
  [RequestStatus.PENDING]: "secondary",
  [RequestStatus.APPROVED]: "default",
  [RequestStatus.REJECTED]: "destructive",
};

const typeColors: Record<RequestType, "default" | "outline"> = {
  [RequestType.NEW]: "default",
  [RequestType.MAINTENANCE]: "outline",
};

export default function RequestsPage() {
  const { canManageRequests, isAdmin } = useAuth();

  const [requests, setRequests] = React.useState<AssetRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | "all">("all");
  const [typeFilter, setTypeFilter] = React.useState<RequestType | "all">("all");

  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<AssetRequest | null>(null);
  const [isActionLoading, setIsActionLoading] = React.useState(false);
  const [approvalNote, setApprovalNote] = React.useState("");
  const [rejectionNote, setRejectionNote] = React.useState("");

  const fetchRequests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await requestsService.getRequests(page, pageSize, {
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        requestType: typeFilter !== "all" ? typeFilter : undefined,
      });
      setRequests(response.content);
      setTotalItems(response.totalElements);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load requests. Please check your connection and try again.";
      toast.error(errorMessage);
      console.error("Error loading requests:", error);
      setRequests([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchValue, statusFilter, typeFilter]);

  React.useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const handleApprove = React.useCallback(async () => {
    if (!selectedRequest) return;
    setIsActionLoading(true);
    try {
      await requestsService.approveRequest(selectedRequest.id, approvalNote || undefined);
      toast.success("Request approved");
      void fetchRequests();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to approve request. Please try again.";
      toast.error(errorMessage);
      console.error("Error approving request:", error);
    } finally {
      setIsActionLoading(false);
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      setApprovalNote("");
    }
  }, [selectedRequest, approvalNote, fetchRequests]);

  const handleReject = React.useCallback(async () => {
    if (!selectedRequest) return;
    if (!rejectionNote.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsActionLoading(true);
    try {
      await requestsService.rejectRequest(selectedRequest.id, rejectionNote);
      toast.success("Request rejected");
      void fetchRequests();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to reject request. Please try again.";
      toast.error(errorMessage);
      console.error("Error rejecting request:", error);
    } finally {
      setIsActionLoading(false);
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionNote("");
    }
  }, [selectedRequest, rejectionNote, fetchRequests]);

  const handleViewDetails = (request: AssetRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const columns: Column<AssetRequest>[] = [
    {
      key: "requester",
      header: "Requester",
      cell: (req) => (
        <div>
          <p className="font-medium">{req.requester ?? req.requesterName}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(req.requestDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "requestType",
      header: "Type",
      cell: (req) => (
        <Badge variant={typeColors[req.requestType]}>{req.requestType}</Badge>
      ),
    },
    {
      key: "assetTypeName",
      header: "Asset Type",
      cell: (req) => (
        <div>
          <p>{req.assetTypeName ?? req.typeName}</p>
          {req.assetName && (
            <p className="text-xs text-muted-foreground">{req.assetName}</p>
          )}
        </div>
      ),
    },
    {
      key: "note",
      header: "Note",
      cell: (req) => (
        <p className="max-w-xs truncate text-sm text-muted-foreground">
          {req.note ?? "-"}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (req) => (
        <Badge variant={statusColors[req.status]}>{req.status}</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (req) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(req)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canManageRequests && req.status === RequestStatus.PENDING && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRequest(req);
                    setApproveDialogOpen(true);
                  }}
                  className="text-success"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRequest(req);
                    setRejectDialogOpen(true);
                  }}
                  className="text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <PageHeader
        title="Requests"
        description="View and manage asset requests"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Requests" },
        ]}
        actions={
          <Button asChild size="default">
            <Link href="/requests/add">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        }
      />

      {/* Stats Cards - Show for admins and managers */}
      {(isAdmin() || canManageRequests) && (
        <motion.div variants={staggerItem}>
          <RequestStatsCards />
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(RequestStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as RequestType | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(RequestType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        emptyMessage="No requests found"
        emptyDescription="Create a new request to get started"
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search requests..."
        getRowKey={(req) => req.id}
      />

      {/* Details Modal */}
      <RequestDetailsModal
        requestId={selectedRequest?.id ?? null}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      {/* Approve Dialog with Note */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve this {selectedRequest?.requestType.toLowerCase()} request from{" "}
              {selectedRequest?.requester ?? selectedRequest?.requesterName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="approvalNote">Note (optional)</Label>
            <Input
              id="approvalNote"
              placeholder="Add approval note..."
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setApprovalNote("");
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isActionLoading}>
              {isActionLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog with Note */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Reject this request from{" "}
              {selectedRequest?.requester ?? selectedRequest?.requesterName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionNote">Reason for rejection *</Label>
            <Input
              id="rejectionNote"
              placeholder="Please provide a reason..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionNote("");
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isActionLoading || !rejectionNote.trim()}
            >
              {isActionLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

