import mongoose, { Schema, Document } from "mongoose";

interface RestockEntry {
  date: Date;
  quantity: number;
  note: string;
}

interface SaleEntry {
  date: Date;
  quantity: number;
  orderId: string;
  revenue: number;
}

export interface IInventory extends Document {
  productId: string;
  productName: string;
  productPrice: number;
  currentStock: number;
  reservedStock: number;
  soldCount: number;
  reorderLevel: number;
  lastRestocked?: Date;
  restockHistory: RestockEntry[];
  salesHistory: SaleEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema: Schema = new Schema({
  productId: { type: String, required: true, unique: true, index: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  currentStock: { type: Number, default: 0, index: true },
  reservedStock: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  lastRestocked: { type: Date },
  restockHistory: [{
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    note: { type: String, default: "" }
  }],
  salesHistory: [{
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    orderId: { type: String, required: true },
    revenue: { type: Number, required: true }
  }]
}, { timestamps: true });

// Index for analytics queries
InventorySchema.index({ soldCount: -1 });
InventorySchema.index({ currentStock: 1 });

export const Inventory = mongoose.model<IInventory>("Inventory", InventorySchema);
