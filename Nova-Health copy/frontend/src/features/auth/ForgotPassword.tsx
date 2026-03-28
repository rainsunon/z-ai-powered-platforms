import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-body text-on-surface selection:bg-primary/20 selection:text-on-primary-container relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary-container/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-lg bg-surface-container-lowest rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 sm:p-12 border border-surface-variant/50 relative z-10">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px]">lock_reset</span>
          </div>
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-3">Reset Password</h2>
          <p className="font-body text-outline">
            {isSubmitted 
              ? "Check your email for a link to reset your password."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="font-headline font-semibold text-sm text-on-surface-variant block">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input 
                  type="email" 
                  {...register('email')}
                  placeholder="elena@example.com" 
                  className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 pl-12 pr-4 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl primary-gradient text-on-primary font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <Link 
            to="/login"
            className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface-variant font-headline font-bold text-lg hover:bg-outline-variant/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Login
          </Link>
        )}

        {!isSubmitted && (
          <p className="mt-10 text-center font-body text-sm text-outline">
            Remember your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
