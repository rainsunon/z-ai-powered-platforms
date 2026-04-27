import React from "react";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

export function LoginPage({ onToggle }: { onToggle: () => void }) {
  return (
    <AuthLayout title="Node Entry" subtitle="Verify credentials to access the financial telemetry stream">
      <LoginForm onToggle={onToggle} />
    </AuthLayout>
  );
}

export function SignUpPage({ onToggle }: { onToggle: () => void }) {
  return (
    <AuthLayout title="Node Registry" subtitle="Create a new access point for your financial telemetry">
      <SignUpForm onToggle={onToggle} />
    </AuthLayout>
  );
}
