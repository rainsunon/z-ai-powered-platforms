"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InventoryItem } from "@repo/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, TrendingUp, Calendar } from "lucide-react";

interface InventoryHistoryProps {
  inventory: InventoryItem;
}

const InventoryHistory = ({ inventory }: InventoryHistoryProps) => {
  const totalRevenue = inventory.salesHistory.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalRestocked = inventory.restockHistory.reduce((sum, restock) => sum + restock.quantity, 0);

  return (
    <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-2xl">{inventory.productName}</SheetTitle>
        <SheetDescription>
          Product ID: {inventory.productId}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.currentStock}</div>
                <p className="text-xs text-muted-foreground">
                  Reorder at {inventory.reorderLevel} units
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.soldCount}</div>
                <p className="text-xs text-muted-foreground">
                  ${totalRevenue.toFixed(2)} revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Restocked</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRestocked}</div>
                <p className="text-xs text-muted-foreground">
                  {inventory.restockHistory.length} times
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Restock History */}
          <Card>
            <CardHeader>
              <CardTitle>Restock History</CardTitle>
            </CardHeader>
            <CardContent>
              {inventory.restockHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.restockHistory
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((restock, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(new Date(restock.date), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">+{restock.quantity}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {restock.note || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No restock history available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sales History */}
          <Card>
            <CardHeader>
              <CardTitle>Sales History (Last 10)</CardTitle>
            </CardHeader>
            <CardContent>
              {inventory.salesHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.salesHistory
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((sale, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(new Date(sale.date), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {sale.orderId.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sale.quantity}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${sale.revenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No sales history available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Sale Price</p>
                  <p className="text-2xl font-bold">
                    ${inventory.soldCount > 0 
                      ? (totalRevenue / inventory.soldCount).toFixed(2) 
                      : "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Turnover</p>
                  <p className="text-2xl font-bold">
                    {totalRestocked > 0 
                      ? ((inventory.soldCount / totalRestocked) * 100).toFixed(1) 
                      : "0"}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Sale</p>
                  <p className="text-lg font-semibold">
                    {inventory.salesHistory.length > 0
                      ? format(
                          new Date(inventory.salesHistory[inventory.salesHistory.length - 1]!.date),
                          "MMM dd, yyyy"
                        )
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Restock</p>
                  <p className="text-lg font-semibold">
                    {inventory.lastRestocked
                      ? format(new Date(inventory.lastRestocked), "MMM dd, yyyy")
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    );
  };
  
  export default InventoryHistory;
