import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { type AppointmentFormData } from './appointment-form-types';
import { AppointmentFormFields } from './AppointmentFormFields';

export { type AppointmentFormData, emptyForm } from './appointment-form-types';

interface AppointmentFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  form: AppointmentFormData;
  onFormChange: (form: AppointmentFormData) => void;
  onSave: () => void;
}

export function AppointmentFormSheet({
  open,
  onOpenChange,
  mode,
  form,
  onFormChange,
  onSave,
}: AppointmentFormSheetProps) {
  const isValid = form.title && form.doctor && form.date && form.time;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline text-xl">
            {mode === 'add' ? 'New Appointment' : 'Edit Appointment'}
          </SheetTitle>
          <SheetDescription>
            {mode === 'add'
              ? 'Schedule a new medical appointment.'
              : 'Update appointment details.'}
          </SheetDescription>
        </SheetHeader>

        <AppointmentFormFields form={form} onFormChange={onFormChange} />

        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>
            Cancel
          </SheetClose>
          <Button
            disabled={!isValid}
            onClick={onSave}
            className="primary-gradient text-on-primary font-bold shadow-lg shadow-primary/20"
          >
            {mode === 'add' ? 'Create Appointment' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
