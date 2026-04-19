export type InventoryItem = {
  _id: string;
  productId: string;
  productName: string;
  productPrice: number;
  currentStock: number;
  reservedStock: number;
  soldCount: number;
  reorderLevel: number;
  lastRestocked?: Date;
  restockHistory: Array<{
    date: Date;
    quantity: number;
    note: string;
  }>;
  salesHistory: Array<{
    date: Date;
    quantity: number;
    orderId: string;
    revenue: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export interface RestockRequest {
  quantity: number;
  note?: string;
}

export interface CreateInventoryRequest {
  productId: string;
  productName: string;
  productPrice: number;
  initialStock?: number;
  reorderLevel?: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  totalInventoryValue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  currentStock: number;
  averagePrice: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface InventoryValue {
  totalValue: number;
  breakdown: Array<{
    productId: string;
    productName: string;
    stock: number;
    pricePerUnit: number;
    totalValue: number;
  }>;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  currentStock: number;
  soldCount: number;
  totalRevenue: number;
  averageSalePrice: number;
  recentSales: number;
  lastSale: Date | null;
  restockCount: number;
  lastRestock?: Date;
}
