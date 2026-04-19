export type DiscountType = "PERCENTAGE" | "FIXED";

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  usedCount: number;
  minOrderValue?: number;
  applicableProducts?: string[];
  applicableUsers?: string[];
}

export interface ValidateDiscountRequest {
  code: string;
  userId?: string;
  cartTotal: number;
  productIds?: string[];
}

export interface ValidateDiscountResponse {
  valid: boolean;
  message?: string;
  discount?: DiscountCode;
}

export interface CalculateDiscountRequest {
  code: string;
  userId?: string;
  cart: Array<{
    id: string;
    price: number;
    quantity: number;
  }>;
}

export interface CalculateDiscountResponse {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  discountedItems: Array<{
    id: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
  }>;
}

export interface CreateDiscountRequest {
  code: string;
  type: DiscountType;
  value: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  minOrderValue?: number;
  applicableProducts?: string[];
  applicableUsers?: string[];
}

export interface UpdateDiscountStatusRequest {
  code: string;
  isActive: boolean;
}
