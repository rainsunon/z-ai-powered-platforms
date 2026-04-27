import React from "react";
import { Modal, Button, FileUploadZone } from "@/shared";
import { toast } from "sonner";

interface ImportCustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportCustomersModal({ isOpen, onClose }: ImportCustomersModalProps) {
  const [csvFile, setCsvFile] = React.useState<File | null>(null);

  const handleImport = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    // TODO: Implement CSV import logic
    toast.success(`Importing customers from ${csvFile.name}`);
    onClose();
    setCsvFile(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Customers from CSV"
      size="md"
    >
      <div className="space-y-6">
        <FileUploadZone
          onFileSelect={setCsvFile}
          selectedFile={csvFile}
          accept=".csv"
          title="Upload CSV File"
          description="CSV should include: name, email, phone, address"
          buttonLabel="Choose File"
        />

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImport}>
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
