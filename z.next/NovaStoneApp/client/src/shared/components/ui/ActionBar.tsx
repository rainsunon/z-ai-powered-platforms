import React from "react";
import { Download, Printer, FileText, Plus } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/src/lib/utils";

interface ActionButton {
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

interface ActionBarProps {
  actions: ActionButton[];
  className?: string;
}

export function ActionBar({ actions, className }: ActionBarProps) {
  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="md"
            onClick={action.onClick}
            icon={Icon}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

// Preset action buttons
export const commonActions = {
  export: (onClick: () => void): ActionButton => ({
    label: "Export CSV",
    icon: Download,
    onClick,
    variant: "outline",
  }),
  print: (onClick: () => void): ActionButton => ({
    label: "Print",
    icon: Printer,
    onClick,
    variant: "outline",
  }),
  generate: (onClick: () => void, label = "Generate Report"): ActionButton => ({
    label,
    icon: FileText,
    onClick,
    variant: "outline",
  }),
  create: (onClick: () => void, label = "Create New"): ActionButton => ({
    label,
    icon: Plus,
    onClick,
    variant: "primary",
  }),
};
