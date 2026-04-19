import mongoose, { Schema, Document } from "mongoose";

export interface IDiscount extends Document {
  code: string;
  type: "PERCENTAGE" | "FIXED";
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

const DiscountSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
  value: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  minOrderValue: { type: Number },
  applicableProducts: [{ type: String }],
  applicableUsers: [{ type: String }],
}, { timestamps: true });

export const Discount = mongoose.model<IDiscount>("Discount", DiscountSchema);
