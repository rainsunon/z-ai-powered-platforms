import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { IconInput } from './IconInput';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ResetEmailFormProps {
  onSubmitted: () => void;
}

export function ResetEmailForm({ onSubmitted }: ResetEmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <IconInput
        id="reset-email"
        label="Email Address"
        icon="mail"
        type="email"
        placeholder="elena@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-2xl primary-gradient text-on-primary font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 h-14"
      >
        {isSubmitting ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          'Send Reset Link'
        )}
      </Button>
    </form>
  );
}
