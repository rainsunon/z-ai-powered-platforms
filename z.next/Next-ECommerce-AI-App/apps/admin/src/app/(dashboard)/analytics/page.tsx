import { SalesSummary, TopProduct, RevenueDataPoint, InventoryItem } from "@repo/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLineChart from "@/components/AppLineChart";
import { DollarSign, ShoppingCart, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const getSalesSummary = async (): Promise<SalesSummary | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/analytics/sales-summary`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTopProducts = async (): Promise<TopProduct[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/analytics/top-products?limit=5`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getRevenueChart = async (): Promise<RevenueDataPoint[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/analytics/revenue-chart`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getLowStockItems = async (): Promise<InventoryItem[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/inventory/low-stock`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const AnalyticsPage = async () => {
  const [summary, topProducts, revenueData, lowStockItems] = await Promise.all([
    getSalesSummary(),
    getTopProducts(),
    getRevenueChart(),
    getLowStockItems(),
  ]);

  return (
    <div className="space-y-8">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Sales Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.totalRevenue.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products Sold
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalProductsSold || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.averageOrderValue.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <AppLineChart
            data={revenueData.map((d) => ({
              name: d.month,
              value: d.revenue,
            }))}
          />
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.unitsSold} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.currentStock} in stock
                  </p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No sales data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Low Stock Alerts ({lowStockItems.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-md border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={item.currentStock === 0 ? "destructive" : "secondary"}>
                        {item.currentStock} units left
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Reorder at: {item.reorderLevel} units
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/inventory"
                    className="text-sm text-primary hover:underline"
                  >
                    Restock →
                  </Link>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <Link
                  href="/inventory"
                  className="block text-center text-sm text-primary hover:underline pt-2"
                >
                  View all {lowStockItems.length} low stock items →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Value */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${summary?.totalInventoryValue.toFixed(2) || "0.00"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Total value of current stock
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
