import React from "react";
import { LineItem } from "./types";
import { InvoiceCreateView } from "./components/InvoiceCreateView";
import { InvoiceListView } from "./components/InvoiceListView";
import { mockInvoices } from "./data/mockInvoices";

export function InvoicesPage() {
  const [view, setView] = React.useState<"list" | "create">("list");
  const [activeTab, setActiveTab] = React.useState<"unpaid" | "draft" | "all">("unpaid");
  const [showActionMenu, setShowActionMenu] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    invoiceNumber: "2025-06G1",
    poNumber: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    currency: "CAD ($)",
    discount: 0,
    lineItems: [] as LineItem[],
    notes: ""
  });

  if (view === "create") {
    return (
      <InvoiceCreateView
        formData={formData}
        setFormData={setFormData}
        onDone={() => setView("list")}
      />
    );
  }

  return (
    <InvoiceListView
      invoices={mockInvoices}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onCreateNew={() => setView("create")}
      showActionMenu={showActionMenu}
      onToggleActionMenu={setShowActionMenu}
    />
  );
}
