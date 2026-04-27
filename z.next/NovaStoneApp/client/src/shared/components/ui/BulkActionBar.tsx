import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Check, Trash2, Download, Send, MoreHorizontal } from "lucide-react";
import { Button } from "./Button";

interface BulkAction {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <Check size={14} />
          </div>
          <span className="font-bold text-sm">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-700" />

        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105",
                  action.variant === "danger" && "bg-red-600 hover:bg-red-700",
                  action.variant === "primary" && "bg-blue-600 hover:bg-blue-700",
                  !action.variant && "bg-gray-800 hover:bg-gray-700"
                )}
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon size={16} />}
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClearSelection}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// Common preset actions
export const commonBulkActions = {
  markAsPaid: (onClick: () => void): BulkAction => ({
    label: "Mark as Paid",
    icon: Check,
    onClick,
    variant: "primary",
  }),
  delete: (onClick: () => void): BulkAction => ({
    label: "Delete",
    icon: Trash2,
    onClick,
    variant: "danger",
  }),
  export: (onClick: () => void): BulkAction => ({
    label: "Export",
    icon: Download,
    onClick,
  }),
  send: (onClick: () => void): BulkAction => ({
    label: "Send",
    icon: Send,
    onClick,
  }),
};
