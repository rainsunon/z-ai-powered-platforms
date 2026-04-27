import React from "react";
import { FormInput } from "@/shared";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface CustomerContactFieldsProps {
  data: ContactInfo;
  onChange: (field: keyof ContactInfo, value: string) => void;
  nameRequired?: boolean;
}

export function CustomerContactFields({ 
  data, 
  onChange,
  nameRequired = true 
}: CustomerContactFieldsProps) {
  return (
    <>
      <FormInput
        label="Customer Name"
        required={nameRequired}
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Enter customer name"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="customer@example.com"
        />

        <FormInput
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </>
  );
}
