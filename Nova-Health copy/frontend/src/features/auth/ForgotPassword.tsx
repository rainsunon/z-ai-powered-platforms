import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { ResetEmailForm } from './components/ResetEmailForm';
import { ResetSuccess } from './components/ResetSuccess';

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AuthLayout
      icon="lock_reset"
      title="Reset Password"
      description={
        isSubmitted
          ? "Check your email for a link to reset your password."
          : "Enter your email address and we'll send you a link to reset your password."
      }
    >
      {!isSubmitted ? (
        <>
          <ResetEmailForm onSubmitted={() => setIsSubmitted(true)} />
          <p className="mt-10 text-center font-body text-sm text-outline">
            Remember your password?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <ResetSuccess />
      )}
    </AuthLayout>
  );
}
