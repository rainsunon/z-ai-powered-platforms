import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface AuthLayoutProps {
  icon: string;
  title: string;
  description: string;
  /** Max-width class for the card, e.g. "max-w-lg" or "max-w-5xl" */
  maxWidth?: string;
  children: React.ReactNode;
}

/**
 * Shared layout for single-panel auth pages (ForgotPassword, etc.).
 * Renders ambient background orbs + a centered Card.
 */
export function AuthLayout({
  icon,
  title,
  description,
  maxWidth = 'max-w-lg',
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-body text-on-surface selection:bg-primary/20 selection:text-on-primary-container relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary-container/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <Card className={`w-full ${maxWidth} rounded-[2.5rem] shadow-2xl shadow-primary/5 border-surface-variant/50 relative z-10`}>
        <CardHeader className="text-center pb-0 pt-8 sm:pt-12 px-8 sm:px-12">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px]">{icon}</span>
          </div>
          <CardTitle className="font-headline font-bold text-3xl text-on-surface mb-3">
            {title}
          </CardTitle>
          <CardDescription className="font-body text-outline">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 sm:px-12 pb-8 sm:pb-12 pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
