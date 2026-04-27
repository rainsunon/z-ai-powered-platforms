import React from "react";
import { FormInput } from "@/shared";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface CustomerAddressFieldsProps {
  address: Address;
  onChange: (address: Address) => void;
}

export function CustomerAddressFields({ address, onChange }: CustomerAddressFieldsProps) {
  const handleChange = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-sm font-bold text-gray-900 mb-4">Address (Optional)</h4>
      
      <div className="space-y-4">
        <FormInput
          label="Street Address"
          value={address.street || ""}
          onChange={(e) => handleChange("street", e.target.value)}
          placeholder="123 Main St"
        />

        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="City"
            value={address.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="San Francisco"
          />

          <FormInput
            label="State"
            value={address.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="CA"
          />

          <FormInput
            label="ZIP Code"
            value={address.zip || ""}
            onChange={(e) => handleChange("zip", e.target.value)}
            placeholder="94102"
          />
        </div>
      </div>
    </div>
  );
}
