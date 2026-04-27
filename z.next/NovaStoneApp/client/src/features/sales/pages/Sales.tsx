import React from "react";
import { Receipt, Clock, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  SalesHeader,
  SalesFilters,
  SaleKPICard,
  SaleModal,
  ManageCategoriesModal,
  ReminderModal,
  BulkActionBar,
  SalesTable,
} from "../components";
import { Sale } from "../types";
import { mockSales } from "../data/mockSales";

export { Sale, LineItem } from "../types";
export { mockSales } from "../data/mockSales";

export function SalesPage() {
  const [sales, setSales] = React.useState<Sale[]>(mockSales);
  const [categories, setCategories] = React.useState<string[]>(["Services", "Hardware", "Design", "Software License", "Subscription", "Consulting"]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSale, setEditingSale] = React.useState<Sale | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState<Sale | null>(null);

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.customer.toLowerCase().includes(searchTerm.toLowerCase()) || s.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totals = {
    total: sales.reduce((acc, curr) => acc + curr.amount, 0),
    unpaid: sales.filter(s => s.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0),
    overdue: sales.filter(s => s.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0),
  };

  const toggleRow = (id: string) => setExpandedRow(prev => prev === id ? null : id);
  const toggleSelect = (e: React.MouseEvent, id: string) => { e.stopPropagation(); setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const toggleSelectAll = () => setSelectedIds(prev => prev.length === filteredSales.length ? [] : filteredSales.map(s => s.id));

  const handleBulkMarkAsPaid = () => {
    setSales(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, status: "paid" as const } : s));
    toast.success(`Marked ${selectedIds.length} sales as paid`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selected = sales.filter(s => selectedIds.includes(s.id));
    const csvContent = [
      ["ID", "Customer", "Invoice #", "Date", "Due Date", "Amount", "Status", "Category", "Address", "Phone", "Email", "Terms"],
      ...selected.map(s => [s.id, s.customer, s.reference, s.date, s.dueDate, s.amount, s.status, s.category, `"${s.customerAddress || ''}"`, s.customerPhone || '', s.customerEmail || '', s.paymentTerms || ''])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `bulk-sales-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedIds.length} items`);
  };

  const handleAddSale = (newSale: Omit<Sale, "id">) => {
    if (editingSale) {
      setSales(prev => prev.map(s => s.id === editingSale.id ? { ...newSale, id: editingSale.id } as Sale : s));
      toast.success("Invoice updated successfully");
    } else {
      const id = `SLE-${String(sales.length + 1).padStart(3, '0')}`;
      setSales(prev => [{ ...newSale, id }, ...prev]);
      toast.success("Invoice recorded successfully");
    }
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const handleExport = () => {
    if (filteredSales.length === 0) { toast.error("No data to export."); return; }
    const csvContent = [
      ["ID", "Customer", "Address", "Phone", "Email", "Invoice #", "Date", "Due Date", "Category", "Amount", "Status"].join(","),
      ...filteredSales.map(s => [s.id, `"${s.customer}"`, `"${s.customerAddress || ''}"`, `"${s.customerPhone || ''}"`, `"${s.customerEmail || ''}"`, `"${s.reference}"`, s.date, s.dueDate, `"${s.category}"`, s.amount, s.status].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `novastone-sales-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Sales data exported!");
  };

  const handleSaveReminder = (id: string, schedule: Sale["reminderSchedule"], message: string) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, reminderSchedule: schedule, customReminderMessage: message } : s));
    toast.success("Reminder configuration saved");
    setIsReminderModalOpen(false);
    setReminderTarget(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen relative">
      <AnimatePresence>
        {isModalOpen && (
          <SaleModal onClose={() => { setIsModalOpen(false); setEditingSale(null); }} onSubmit={handleAddSale} categories={categories} initialData={editingSale || undefined} />
        )}
        {isCategoryModalOpen && (
          <ManageCategoriesModal categories={categories} onClose={() => setIsCategoryModalOpen(false)} onSave={setCategories} />
        )}
        {isReminderModalOpen && reminderTarget && (
          <ReminderModal sale={reminderTarget} onClose={() => { setIsReminderModalOpen(false); setReminderTarget(null); }} onSave={handleSaveReminder} />
        )}
      </AnimatePresence>

      <SalesHeader onManageCategories={() => setIsCategoryModalOpen(true)} onExport={handleExport} onPrint={() => window.print()} onNewInvoice={() => setIsModalOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SaleKPICard title="Total Receivables" amount={totals.unpaid + totals.overdue} subtitle={`${sales.filter(s => s.status !== "paid").length} active invoices`} icon={Receipt} color="blue" />
        <SaleKPICard title="Open Invoices" amount={totals.unpaid} subtitle="Waiting for payment" icon={Clock} color="yellow" />
        <SaleKPICard title="Overdue Payments" amount={totals.overdue} subtitle="Follow-up required" icon={AlertCircle} color="red" />
      </div>

      <SalesTable
        sales={sales}
        filteredSales={filteredSales}
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        expandedRow={expandedRow}
        onToggleRow={toggleRow}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={(s) => { setEditingSale(s); setIsModalOpen(true); }}
        onDelete={(id) => { setSales(prev => prev.filter(s => s.id !== id)); toast.success("Invoice record removed"); }}
        onReminderConfigure={(s) => { setReminderTarget(s); setIsReminderModalOpen(true); }}
      />

      <BulkActionBar selectedCount={selectedIds.length} onMarkAsPaid={handleBulkMarkAsPaid} onExport={handleBulkExport} onClear={() => setSelectedIds([])} />
    </motion.div>
  );
}
