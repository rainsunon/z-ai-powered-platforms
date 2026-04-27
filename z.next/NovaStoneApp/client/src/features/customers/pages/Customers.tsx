import React from "react";
import { Edit, Trash2, FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { useCustomerStore, Customer, useUIStore } from "@/src/store/stores";
import { DataTable, ActionMenu } from "@/shared/components/ui/DataTable";
import { SearchBar, Badge } from "@/shared/components/ui/Common";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/Modal";
import { CustomerForm, ImportCustomersModal } from "@/src/components/customers/CustomerForm";
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
Button
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
          emptyMessage="No customers found. Try adjusting your search or add a new customer.ame="text-sm text-gray-600">{customer.email || ""}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{customer.phone || ""}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{customer.savedCards || ""}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {customer.balance > 0 || customer.overdue > 0 ? `$${customer.balance.toFixed(2)}` : ""}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === customer.id ? null : customer.id)}
                        className="w-8 h-8 rounded-full border border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>

                      <AnimatePresence>
                        {showActionMenu === customer.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute right-8 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                            >
                              <div className="py-2">
                                <ActionMenuItem
                                  label="View"
                                  onClick={() => handleAction("View", customer.id)}
                                />
                                <ActionMenuItem
                                  label="Edit"
                                  onClick={() => handleAction("Edit", customer.id)}
                                />
                                <ActionMenuItem
                                  label="Create invoice"
                                  onClick={() => handleAction("Create invoice", customer.id)}
                                />
                                <ActionMenuItem
                                  label="Send statement"
                                  onClick={() => handleAction("Send statement", customer.id)}
                                />
                                <div className="h-px bg-gray-100 my-1" />
                                <ActionMenuItem
                                  label="Delete"
                                  variant="danger"
                                  onClick={() => handleDelete(customer.id)}
                                />
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-lg font-bold text-gray-900">No customers found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white hover:file:bg-gray-50"
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (csvFile) {
                            toast.success("CSV file uploaded successfully");
                            setShowImportModal(false);
                            setCsvFile(null);
                          } else {
                            toast.error("Please select a CSV file");
                          }
                        }}
                        className="px-10 py-3 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all"
                      >
                        Upload and preview customers
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      Maximum 10MB file size. CSV file type only.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <HelpCircle size={20} className="text-gray-400" />
                    <span className="text-gray-600">Need help creating your CSV file?</span>
                    <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                      View instructions <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Add Customer Modal */}
        <AnimatePresence>
          {showAddCustomerModal && (
            <>
              <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAddCustomerModal(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">New customer</h2>
                  <button
                    onClick={() => setShowAddCustomerModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Basic Information</h3>
                    <div className="space-y-4">
                      <FormField label="Customer">
                        <input
                          type="text"
                          placeholder="Name of a business or person"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                        />
                      </FormField>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary contact</label>
                        <div className="space-y-3 bg-blue-50/30 p-4 rounded-lg">
                          <input
                            type="text"
                            placeholder="First name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Last name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                            <Plus size={14} /> Add phone
                          </button>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mt-2">
                          <Plus size={14} /> Add contact
                        </button>
                      </div>

                      <FormField label="Account number">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </FormField>

                      <FormField label="Website">
                        <input
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </FormField>

                      <FormField label="Notes">
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Billing */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Billing</h3>
                    <div className="space-y-4">
                      <FormField label="Currency">
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none">
                          <option>Invoice for this customer will default to this currency</option>
                        </select>
                      </FormField>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Billing address</label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Address 2 (optional)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-gray-400">
                              <option>Country</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-gray-400">
                              <option>Province, State...</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Postal"
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                            />
                          </div>
                          <button className="text-blue-600 text-sm font-medium hover:underline">
                            Clear address
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Shipping</h3>
                    <div className="space-y-4">
                      <FormField label="Ship to">
                        <input
                          type="text"
                          placeholder="Name of business or person"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                        />
                      </FormField>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shipping address</label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Address 2 (optional)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-gray-400">
                              <option>Country</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-gray-400">
                              <option>Province, State...</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Postal"
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-400"
                            />
                          </div>
                          <button className="text-blue-600 text-sm font-medium hover:underline">
                            Clear address
                          </button>
                        </div>
                      </div>

                      <FormField label="Phone">
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </FormField>

                      <FormField label="Delivery instructions">
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-center gap-3">
                  <button
                    onClick={() => setShowAddCustomerModal(false)}
                    className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Customer added successfully");
                      setShowAddCustomerModal(false);
                    }}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <label className="text-sm font-medium text-gray-700 w-40 pt-2 text-right">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ActionMenuItem({
  label,
  variant,
  onClick
}: {
  label: string;
  variant?: "danger";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
        variant === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  );
}
