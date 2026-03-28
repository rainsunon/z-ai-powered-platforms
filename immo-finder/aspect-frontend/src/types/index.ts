// Asset Status Enum
export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  ASSIGNED = "ASSIGNED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  RETIRED = "RETIRED",
}

// Request Status Enum
export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Request Type Enum
export enum RequestType {
  NEW = "NEW",
  MAINTENANCE = "MAINTENANCE",
}

// Asset Category
export interface AssetCategory {
  id: number;
  name: string;
}

// Asset Type
export interface AssetType {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
}

// Department
export interface Department {
  id: number;
  name: string;
}

// Location
export interface Location {
  id: number;
  name: string;
  address?: string;
  isActive: boolean;
}

// Role
export interface Role {
  id: number;
  name: string;
}

// Asset
export interface Asset {
  id: number;
  name: string;
  brand: string;
  description?: string;
  serialNumber: string;
  location: string;
  status: AssetStatus;
  purchaseDate: string;
  warrantyEndDate: string;
  categoryId: number;
  categoryName?: string;
  typeId: number;
  typeName?: string;
  imagePath?: string;
}

// Asset List DTO (for table display)
export interface AssetListDTO {
  id: number;
  name: string;
  brand: string;
  serialNumber: string;
  status: AssetStatus;
  typeName: string;
  categoryName: string;
  location: string;
  assignedTo?: string;
}

// Asset Details (full details)
export interface AssetDetails extends Asset {
  assignedTo?: {
    id: number;
    username: string;
    email: string;
  };
  assignmentDate?: string;
}

// Asset History
export interface AssetHistory {
  id: number;
  assetId: number;
  userId: number;
  userName: string;
  note?: string;
  timestamp: string;
  status: AssetStatus;
}

// Asset Request (matches backend ResponseDTO)
export interface AssetRequest {
  id: number;
  assetId?: number;
  assetName?: string;
  assetTypeId: number;
  assetTypeName: string;
  categoryId?: number;
  categoryName?: string;
  requesterId: number;
  requester: string; // Backend uses "requester" not "requesterName"
  requestDate: string;
  status: RequestStatus;
  requestType: RequestType;
  approvedBy?: string;
  approvedDate?: string;
  note?: string;
  rejectionNote?: string;
  // For backward compatibility
  typeId?: number;
  typeName?: string;
  requesterName?: string;
}

// User (basic info)
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  departmentName: string | null;
}

// User Details (extended)
export interface UserDetails extends User {
  fullName: string;
  phone?: string;
  hireDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Filter types
export interface AssetFilter {
  search?: string;
  status?: AssetStatus;
  categoryId?: number;
  typeId?: number;
  location?: string;
}

export interface RequestFilter {
  search?: string;
  status?: RequestStatus;
  requestType?: RequestType;
}

export interface UserFilter {
  search?: string;
  role?: string;
  departmentId?: number;
}

