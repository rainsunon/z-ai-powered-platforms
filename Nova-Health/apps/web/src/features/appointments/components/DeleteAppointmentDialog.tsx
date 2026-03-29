import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface DeleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAppointmentDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAppointmentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-error-container">
            <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The appointment will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="default"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
