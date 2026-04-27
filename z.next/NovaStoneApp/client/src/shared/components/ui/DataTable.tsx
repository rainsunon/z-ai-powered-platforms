import React from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  rowClassName,
  emptyMessage = "No data available",
  isLoading = false
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden p-12 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b border-gray-100">
          <tr className="text-sm font-bold text-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn("py-4 px-6", column.className)}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    {column.header}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "text-gray-400 transition-transform",
                        sortKey === column.key && sortDirection === "desc" && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "group transition-colors hover:bg-gray-50/50",
                onRowClick && "cursor-pointer",
                rowClassName?.(item)
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn("py-4 px-6 text-sm", column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ActionMenuProps {
  trigger?: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
    icon?: React.ReactNode;
  }>;
  align?: "left" | "right";
}

export function ActionMenu({ trigger, items, align = "right" }: ActionMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {trigger || <MoreHorizontal size={16} className="text-gray-600" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-2 w-48 bg-white border border-gray-200",
              "rounded-xl shadow-2xl z-50 overflow-hidden",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="py-2">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.label === "---" ? (
                    <div className="h-px bg-gray-100 my-1" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-medium",
                        "transition-colors flex items-center gap-3",
                        item.variant === "danger"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
