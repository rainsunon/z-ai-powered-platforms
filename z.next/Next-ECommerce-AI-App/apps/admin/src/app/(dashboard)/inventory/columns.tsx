"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "@repo/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import RestockProduct from "@/components/RestockProduct";
import InventoryHistory from "@/components/InventoryHistory";
import { useState } from "react";

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as number;
      const reorderLevel = row.original.reorderLevel;
      
      const variant = stock === 0 ? "destructive" : stock <= reorderLevel ? "secondary" : "default";
      
      return <Badge variant={variant}>{stock} units</Badge>;
    },
  },
  {
    accessorKey: "soldCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.getValue("soldCount")} units</span>;
    },
  },
  {
    accessorKey: "productPrice",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("productPrice") as number;
      return <span>${price.toFixed(2)}</span>;
    },
  },
  {
    id: "stockValue",
    header: "Stock Value",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const price = row.original.productPrice;
      const value = stock * price;
      return <span>${value.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "reorderLevel",
    header: "Reorder Level",
    cell: ({ row }) => {
      return <span>{row.getValue("reorderLevel")} units</span>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const reorderLevel = row.original.reorderLevel;
      
      if (stock === 0) {
        return <Badge variant="destructive">Out of Stock</Badge>;
      } else if (stock <= reorderLevel) {
        return <Badge variant="secondary">Low Stock</Badge>;
      } else {
        return <Badge variant="default">In Stock</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const inventory = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(inventory.productId)
              }
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Sheet>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Restock
                </DropdownMenuItem>
              </SheetTrigger>
              <RestockProduct
                productId={inventory.productId}
                productName={inventory.productName}
                currentStock={inventory.currentStock}
              />
            </Sheet>
            <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
            <Sheet>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  View History
                </DropdownMenuItem>
              </SheetTrigger>
              <InventoryHistory inventory={inventory} />
            </Sheet>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
