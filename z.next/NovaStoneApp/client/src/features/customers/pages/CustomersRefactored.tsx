import React from "react";
import { Edit, Trash2, FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { useCustomerStore, Customer } from "@/features/customers";
import { useUIStore } from "@/shared/store/uiStore";
import { DataTable, ActionMenu } from "@/shared/components/ui/DataTable";
import { SearchBar, Badge } from "@/shared/components/ui/Common";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/Modal";
import { CustomerForm, ImportCustomersModal } from "@/features/customers/components/CustomerForm";
import { formatCurrency } from "@/src/lib/utils";

export function CustomersPage() {
  const { customers, deleteCustomer, selectCustomer } = useCustomerStore();
  const { openModal, closeModal, modal } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState<Customer | null>(null);

  // Initialize with mock data (in production, fetch from API)
  React.useEffect(() => {
    // TODO: Fetch customers from API
  }, []);

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const handleEdit = (customer: Customer) => {
    selectCustomer(customer);
    openModal("editCustomer", customer);
  };

  const handleDelete = (customer: Customer) => {
    setDeleteConfirm(customer);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCustomer(deleteConfirm.id);
      toast.success("Customer deleted successfully");
      setDeleteConfirm(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
          {customer.subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{customer.subtitle}</p>
          )}
        </div>
      )
    },
    {
      key: "email",
      header: "Email",
      render: (customer: Customer) => (
        <span className="text-sm text-gray-600">{customer.email || "-"}</span>
      )
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer: Customer) => (
        <span className="text-sm text-gray-600">{customer.phone || "-"}</span>
      )
    },
    {
      key: "savedCards",
      header: "Saved Cards",
      render: (customer: Customer) => (
        <span className="text-sm text-gray-600">{customer.savedCards || "-"}</span>
      )
    },
    {
      key: "balance",
      header: "Balance | Overdue",
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          {customer.balance > 0 && (
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(customer.balance)}
            </span>
          )}
          {customer.overdue > 0 && (
            <Badge variant="danger" size="sm">
              {formatCurrency(customer.overdue)} overdue
            </Badge>
          )}
          {customer.balance === 0 && customer.overdue === 0 && (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      )
    },
    {
      key: "actions",
      header: "",
      className: "w-16",
      render: (customer: Customer) => (
        <ActionMenu
          items={[
            {
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: () => handleEdit(customer)
            },
            {
              label: "Create Invoice",
              icon: <FileText size={16} />,
              onClick: () => {
                toast.info("Create invoice feature coming soon");
              }
            },
            {
              label: "Send Statement",
              icon: <Mail size={16} />,
              onClick: () => {
                toast.info("Send statement feature coming soon");
              }
            },
            { label: "---", onClick: () => {} },
            {
              label: "Delete",
              icon: <Trash2 size={16} />,
              onClick: () => handleDelete(customer),
              variant: "danger" as const
            }
          ]}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customers</h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => openModal("importCustomers")}
            >
              Import from CSV
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                selectCustomer(null);
                openModal("addCustomer");
              }}
            >
              Add a customer
            </Button>
          </div>
        </div>

        {/* Search & Count */}
        <div className="flex items-center gap-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, or phone"
            containerClassName="flex-1 max-w-md"
          />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {filteredCustomers.length}
            </div>
            <span className="text-sm text-gray-600 font-medium">customers found</span>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filteredCustomers}
          columns={columns}
          emptyMessage="No customers found. Try adjusting your search or add a new customer."
        />

        {/* Modals */}
        <CustomerForm
          isOpen={modal.isOpen && (modal.type === "addCustomer" || modal.type === "editCustomer")}
          onClose={closeModal}
          customer={modal.data}
        />

        <ImportCustomersModal
          isOpen={modal.isOpen && modal.type === "importCustomers"}
          onClose={closeModal}
        />

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
          title="Delete Customer"
          message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
}
