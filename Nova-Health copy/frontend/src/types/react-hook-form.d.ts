declare module 'react-hook-form' {
  import type { BaseSyntheticEvent } from 'react';

  export type FieldValues = Record<string, any>;
  export type FieldPath<TFieldValues extends FieldValues> = string;
  export type FieldErrors<TFieldValues extends FieldValues = FieldValues> = Partial<Record<keyof TFieldValues, { message?: string; type?: string }>>;

  export interface UseFormRegisterReturn {
    onChange: (...event: any[]) => void;
    onBlur: (...event: any[]) => void;
    ref: (instance: any) => void;
    name: string;
  }

  export interface UseFormReturn<TFieldValues extends FieldValues = FieldValues> {
    register: (name: FieldPath<TFieldValues>, options?: any) => UseFormRegisterReturn;
    handleSubmit: (onValid: (data: TFieldValues, event?: BaseSyntheticEvent) => any) => (e?: BaseSyntheticEvent) => Promise<void>;
    formState: {
      errors: FieldErrors<TFieldValues>;
      isSubmitting: boolean;
      isValid: boolean;
      isDirty: boolean;
      touchedFields: Partial<Record<keyof TFieldValues, boolean>>;
      dirtyFields: Partial<Record<keyof TFieldValues, boolean>>;
    };
    watch: (name?: FieldPath<TFieldValues> | FieldPath<TFieldValues>[]) => any;
    setValue: (name: FieldPath<TFieldValues>, value: any, options?: any) => void;
    getValues: (name?: FieldPath<TFieldValues> | FieldPath<TFieldValues>[]) => any;
    reset: (values?: Partial<TFieldValues>) => void;
    control: any;
    trigger: (name?: FieldPath<TFieldValues> | FieldPath<TFieldValues>[]) => Promise<boolean>;
  }

  export interface UseFormProps<TFieldValues extends FieldValues = FieldValues> {
    defaultValues?: Partial<TFieldValues>;
    resolver?: any;
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
  }

  export function useForm<TFieldValues extends FieldValues = FieldValues>(
    props?: UseFormProps<TFieldValues>
  ): UseFormReturn<TFieldValues>;

  export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues>;

  export function useWatch(props?: any): any;
  export function useFieldArray(props?: any): any;
  export function useController(props?: any): any;

  export const Controller: any;
  export const FormProvider: any;
  export const Form: any;
}
