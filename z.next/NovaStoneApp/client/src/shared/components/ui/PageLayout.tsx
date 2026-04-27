import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "./Button";
import { SearchBar } from "./Common";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
}: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Icon className="text-blue-600" size={20} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      {onSearchChange && (
        <SearchBar
          value={searchValue || ""}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      )}
    </div>
  );
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("p-8 bg-gray-50 min-h-screen", className)}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
