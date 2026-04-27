import React from "react";
import { Receipt, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  PurchasesHeader,
  PurchasesTable,
  PurchaseKPICard,
  PurchaseModal,
  ManageCategoriesModal,
  ReminderModal,
  BulkActionBar
} from "../components";
import { Purchase } from "../types";
import { mockPurchases } from "../data/mockPurchases";

export function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<Purchase[]>(mockPurchases);
  const [categories, setCategories] = React.useState<string[]>(["Software", "Hardware", "Rent", "Shipping", "Office Supplies", "Marketing", "Consulting", "Utilities"]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPurchase, setEditingPurchase] = React.useState<Purchase | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState<Purchase | null>(null);

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totals = {
    total: purchases.reduce((acc, curr) => acc + curr.amount, 0),
    unpaid: purchases.filter(p => p.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0),
    overdue: purchases.filter(p => p.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0),
  };

  const toggleRow = (id: string) => setExpandedRow(prev => prev === id ? null : id);
  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filteredPurchases.length ? [] : filteredPurchases.map(p => p.id));
  };

  const handleBulkMarkAsPaid = () => {
    setPurchases(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: "paid" as const } : p));
    toast.success(`Marked ${selectedIds.length} purchases as paid`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selected = purchases.filter(p => selectedIds.includes(p.id));
    const csvContent = [
      ["ID", "Vendor", "PO #", "Date", "Due Date", "Amount", "Status", "Category", "Address", "Phone", "Email", "Terms"],
      ...selected.map(p => [p.id, p.vendor, p.reference, p.date, p.dueDate, p.amount, p.status, p.category, `"${p.vendorAddress || ''}"`, p.vendorPhone || '', p.vendorEmail || '', p.paymentTerms || ''])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `bulk-purchases-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedIds.length} items`);
  };

  const handleAddPurchase = (newPurchase: Omit<Purchase, "id">) => {
    if (editingPurchase) {
      setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? { ...newPurchase, id: editingPurchase.id } as Purchase : p));
      toast.success("Purchase updated successfully");
    } else {
      const id = `PUR-${String(purchases.length + 1).padStart(3, '0')}`;
      setPurchases(prev => [{ ...newPurchase, id }, ...prev]);
      toast.success("Purchase recorded successfully");
    }
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleExport = () => {
    if (filteredPurchases.length === 0) { toast.error("No data to export."); return; }
    try {
      const csvContent = [
        ["ID", "Vendor", "Address", "Phone", "Email", "PO #", "Date", "Due Date", "Category", "Amount", "Status"].join(","),
        ...filteredPurchases.map(p => [p.id, `"${p.vendor}"`, `"${p.vendorAddress || ''}"`, `"${p.vendorPhone || ''}"`, `"${p.vendorEmail || ''}"`, `"${p.reference}"`, p.date, p.dueDate, `"${p.category}"`, p.amount, p.status].join(","))
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `novastone-purchases-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Purchases data exported successfully!");
    } catch (error) {
      toast.error("Failed to export purchase data.");
    }
  };

  const handleSaveReminder = (id: string, schedule: Purchase["reminderSchedule"], message: string) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, reminderSchedule: schedule, customReminderMessage: message } : p));
    toast.success("Reminder configuration saved");
    setIsReminderModalOpen(false);
    setReminderTarget(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen relative">
      {isModalOpen && (
        <PurchaseModal onClose={() => { setIsModalOpen(false); setEditingPurchase(null); }} onSubmit={handleAddPurchase} categories={categories} initialData={editingPurchase || undefined} />
      )}
      {isCategoryModalOpen && (
        <ManageCategoriesModal categories={categories} onClose={() => setIsCategoryModalOpen(false)} onSave={setCategories} />
      )}
      {isReminderModalOpen && reminderTarget && (
        <ReminderModal purchase={reminderTarget} onClose={() => { setIsReminderModalOpen(false); setReminderTarget(null); }} onSave={handleSaveReminder} />
      )}

      <PurchasesHeader onManageCategories={() => setIsCategoryModalOpen(true)} onExport={handleExport} onPrint={() => window.print()} onNewPurchase={() => setIsModalOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PurchaseKPICard title="Total Outstanding" amount={totals.unpaid + totals.overdue} subtitle={`${purchases.filter(p => p.status !== "paid").length} active bills`} icon={Receipt} color="blue" />
        <PurchaseKPICard title="Unpaid Bills" amount={totals.unpaid} subtitle="Awaiting payment date" icon={Clock} color="yellow" />
        <PurchaseKPICard title="Overdue" amount={totals.overdue} subtitle="Requires immediate action" icon={AlertCircle} color="red" />
      </div>

      <PurchasesTable
        purchases={purchases}
        filteredPurchases={filteredPurchases}
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
        onEdit={(p) => { setEditingPurchase(p); setIsModalOpen(true); }}
        onDelete={(id) => { setPurchases(prev => prev.filter(p => p.id !== id)); toast.success("Purchase record removed"); }}
        onReminderConfigure={(p) => { setReminderTarget(p); setIsReminderModalOpen(true); }}
      />

      {selectedIds.length > 0 && (
        <BulkActionBar selectedCount={selectedIds.length} onMarkAsPaid={handleBulkMarkAsPaid} onExport={handleBulkExport} onClear={() => setSelectedIds([])} />
      )}
    </motion.div>
  );
}
