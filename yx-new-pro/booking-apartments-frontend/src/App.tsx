import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/redux';
import { Toaster } from '@/components/ui/use-toast';
import {MainLayout } from '@/components/layout/MainLayout';
import '@/index.css';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const HomePage = lazy(() => import('@/features/availability/HomePage').then(m => ({ default: m.HomePage })));
const ApartmentDetailPage = lazy(() => import('@/features/apartments/ApartmentDetailPage').then(m => ({ default: m.ApartmentDetailPage })));
const BookingPage = lazy(() => import('@/features/bookings/BookingPage').then(m => ({ default: m.BookingPage })));
const BookingConfirmPage = lazy(() => import('@/features/bookings/BookingConfirmPage').then(m => ({ default: m.BookingConfirmPage })));

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
          
          <Route
            path="/bookings/new"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id/confirm"
            element={
              <ProtectedRoute>
                <BookingConfirmPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
};
