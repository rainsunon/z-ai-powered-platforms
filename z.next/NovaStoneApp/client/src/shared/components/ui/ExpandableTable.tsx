import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { ChevronRight, Check } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface ExpandableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  expandedRowRender?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  expandedRows?: string[];
  onExpandedChange?: (ids: string[]) => void;
  emptyState?: React.ReactNode;
}

export function ExpandableTable<T>({
  data,
  columns,
  keyExtractor,
  expandedRowRender,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  expandedRows = [],
  onExpandedChange,
  emptyState,
}: ExpandableTableProps<T>) {
  const toggleRow = (id: string) => {
    if (!onExpandedChange) return;
    const newExpanded = expandedRows.includes(id)
      ? expandedRows.filter((rowId) => rowId !== id)
      : [...expandedRows, id];
    onExpandedChange(newExpanded);
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(keyExtractor));
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12">
        {emptyState || (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No data found</p>
            <p className="text-sm">Try adjusting your filters or search</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {expandedRowRender && (
                <th className="px-4 py-3 w-12"></th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider",
                    column.width
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => {
              const id = keyExtractor(item);
              const isExpanded = expandedRows.includes(id);
              const isSelected = selectedIds.includes(id);

              return (
                <React.Fragment key={id}>
                  <motion.tr
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      isSelected && "bg-blue-50",
                      (onRowClick || expandedRowRender) && "cursor-pointer"
                    )}
                    onClick={() => {
                      if (expandedRowRender) {
                        toggleRow(id);
                      } else if (onRowClick) {
                        onRowClick(item);
                      }
                    }}
                  >
                    {selectable && (
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelect(e, id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {expandedRowRender && (
                      <td className="px-4 py-4">
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={16} className="text-gray-400" />
                        </motion.div>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("px-4 py-4 text-sm text-gray-900", column.width)}
                      >
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                  </motion.tr>

                  {/* Expanded Row */}
                  {expandedRowRender && (
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td
                            colSpan={
                              columns.length +
                              (selectable ? 1 : 0) +
                              (expandedRowRender ? 1 : 0)
                            }
                            className="px-4 py-4 bg-gray-50"
                          >
                            {expandedRowRender(item)}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
