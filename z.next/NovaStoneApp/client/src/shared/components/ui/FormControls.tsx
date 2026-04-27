import React from "react";
import { cn } from "@/src/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  containerClassName,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm",
          "focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none",
          "transition-colors",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

export function FormTextarea({
  label,
  error,
  helperText,
  required,
  containerClassName,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm",
          "focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none",
          "resize-none transition-colors",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  options: Array<{ value: string; label: string }>;
}

export function FormSelect({
  label,
  error,
  helperText,
  required,
  containerClassName,
  className,
  options,
  ...props
}: FormSelectProps) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={cn(
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm",
          "focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none",
          "transition-colors bg-white",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export function FormCheckbox({
  label,
  description,
  error,
  containerClassName,
  className,
  ...props
}: FormCheckboxProps) {
  return (
    <div className={cn("space-y-1", containerClassName)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className={cn(
            "mt-1 w-4 h-4 border-gray-300 rounded text-blue-600",
            "focus:ring-2 focus:ring-blue-100 cursor-pointer",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-600 font-medium ml-7">{error}</p>
      )}
    </div>
  );
}
