import React from "react";
import { Modal, Button } from "@/shared";
import { useCustomerStore, Customer } from "@/features/customers";
import { toast } from "sonner";
import { CustomerContactFields } from "./CustomerContactFields";
import { CustomerAddressFields } from "./CustomerAddressFields";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerForm({ isOpen, onClose, customer }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useCustomerStore();
  const [formData, setFormData] = React.useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    address: {}
  });

  React.useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || {}
      });
    } else {
      setFormData({ name: "", email: "", phone: "", address: {} });
    }
  }, [customer, isOpen]);

  const handleContactChange = (field: keyof Pick<CustomerFormData, "name" | "email" | "phone">, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddressChange = (address: CustomerFormData["address"]) => {
    setFormData({ ...formData, address });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Customer name is required");
      return;
    }

    const customerData: Customer = {
      id: customer?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      savedCards: customer?.savedCards || 0,
      balance: customer?.balance || 0,
      overdue: customer?.overdue || 0
    };

    if (customer) {
      updateCustomer(customer.id, customerData);
      toast.success("Customer updated successfully");
    } else {
      addCustomer(customerData);
      toast.success("Customer added successfully");
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add a Customer"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomerContactFields
          data={{ name: formData.name, email: formData.email, phone: formData.phone }}
          onChange={handleContactChange}
        />

        <CustomerAddressFields
          address={formData.address || {}}
          onChange={handleAddressChange}
        />

        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {customer ? "Update Customer" : "Add Customer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
