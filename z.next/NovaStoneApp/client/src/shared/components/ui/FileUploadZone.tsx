import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/shared";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function FileUploadZone({
  onFileSelect,
  selectedFile,
  accept = ".csv",
  title = "Upload CSV File",
  description = "CSV should include: name, email, phone, address",
  buttonLabel = "Choose File"
}: FileUploadZoneProps) {
  const inputId = React.useId();

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <p className="text-xs text-gray-500 mb-4">{description}</p>
      
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="hidden"
        id={inputId}
      />
      
      <label htmlFor={inputId} className="cursor-pointer">
        <Button type="button" variant="outline" size="sm">
          {buttonLabel}
        </Button>
      </label>
      
      {selectedFile && (
        <p className="text-sm text-green-600 mt-4 font-medium">
          Selected: {selectedFile.name}
        </p>
      )}
    </div>
  );
}
