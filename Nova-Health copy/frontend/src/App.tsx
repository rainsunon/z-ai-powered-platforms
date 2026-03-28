/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// Auth pages
const Login = lazy(() => import('./features/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./features/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const VerifyMethod = lazy(() => import('./features/auth/VerifyMethod').then(m => ({ default: m.VerifyMethod })));
const VerifyCode = lazy(() => import('./features/auth/VerifyCode').then(m => ({ default: m.VerifyCode })));
const VerifySuccess = lazy(() => import('./features/auth/VerifySuccess').then(m => ({ default: m.VerifySuccess })));

// Dashboard
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));

// Billing
const Billing = lazy(() => import('./features/billing/Billing').then(m => ({ default: m.Billing })));
const BillingDetail = lazy(() => import('./features/billing/BillingDetail').then(m => ({ default: m.BillingDetail })));
const PaymentHistory = lazy(() => import('./features/billing/PaymentHistory').then(m => ({ default: m.PaymentHistory })));
const PaymentMethods = lazy(() => import('./features/billing/PaymentMethods').then(m => ({ default: m.PaymentMethods })));
const AddPaymentMethod = lazy(() => import('./features/billing/AddPaymentMethod').then(m => ({ default: m.AddPaymentMethod })));
const AddBankAccount = lazy(() => import('./features/billing/AddBankAccount').then(m => ({ default: m.AddBankAccount })));
const ACHVerification = lazy(() => import('./features/billing/ACHVerification').then(m => ({ default: m.ACHVerification })));
const BankLinkedSuccess = lazy(() => import('./features/billing/BankLinkedSuccess').then(m => ({ default: m.BankLinkedSuccess })));
const PaymentMethodSuccess = lazy(() => import('./features/billing/PaymentMethodSuccess').then(m => ({ default: m.PaymentMethodSuccess })));
const BulkPaymentReview = lazy(() => import('./features/billing/BulkPaymentReview').then(m => ({ default: m.BulkPaymentReview })));
const BulkPaymentMethod = lazy(() => import('./features/billing/BulkPaymentMethod').then(m => ({ default: m.BulkPaymentMethod })));
const InstallmentSchedule = lazy(() => import('./features/billing/InstallmentSchedule').then(m => ({ default: m.InstallmentSchedule })));
const PaymentPlanConfirmed = lazy(() => import('./features/billing/PaymentPlanConfirmed').then(m => ({ default: m.PaymentPlanConfirmed })));
const PaymentFailed = lazy(() => import('./features/billing/PaymentFailed').then(m => ({ default: m.PaymentFailed })));
const Subscription = lazy(() => import('./features/billing/Subscription').then(m => ({ default: m.Subscription })));

// Health
const Symptoms = lazy(() => import('./features/health/Symptoms').then(m => ({ default: m.Symptoms })));
const SleepData = lazy(() => import('./features/health/SleepData').then(m => ({ default: m.SleepData })));
const ActivityTracking = lazy(() => import('./features/health/ActivityTracking').then(m => ({ default: m.ActivityTracking })));
const VitalsTracking = lazy(() => import('./features/health/VitalsTracking').then(m => ({ default: m.VitalsTracking })));
const GoalManagement = lazy(() => import('./features/health/GoalManagement').then(m => ({ default: m.GoalManagement })));
const DailySchedule = lazy(() => import('./features/health/DailySchedule').then(m => ({ default: m.DailySchedule })));
const HealthPlan = lazy(() => import('./features/health/HealthPlan').then(m => ({ default: m.HealthPlan })));
const HabitTracker = lazy(() => import('./features/health/HabitTracker').then(m => ({ default: m.HabitTracker })));
const DataSync = lazy(() => import('./features/health/DataSync').then(m => ({ default: m.DataSync })));

// Family
const FamilyHealth = lazy(() => import('./features/family/FamilyHealth').then(m => ({ default: m.FamilyHealth })));
const FamilyMembers = lazy(() => import('./features/family/FamilyMembers').then(m => ({ default: m.FamilyMembers })));
const FamilyPermissions = lazy(() => import('./features/family/FamilyPermissions').then(m => ({ default: m.FamilyPermissions })));
const FamilyPermissionDetail = lazy(() => import('./features/family/FamilyPermissionDetail').then(m => ({ default: m.FamilyPermissionDetail })));
const FamilyHealthSummary = lazy(() => import('./features/family/FamilyHealthSummary').then(m => ({ default: m.FamilyHealthSummary })));
const FamilyWellnessChallenge = lazy(() => import('./features/family/FamilyWellnessChallenge').then(m => ({ default: m.FamilyWellnessChallenge })));
const FamilyRewards = lazy(() => import('./features/family/FamilyRewards').then(m => ({ default: m.FamilyRewards })));
const MilestoneAchieved = lazy(() => import('./features/family/MilestoneAchieved').then(m => ({ default: m.MilestoneAchieved })));
const RewardRedeemed = lazy(() => import('./features/family/RewardRedeemed').then(m => ({ default: m.RewardRedeemed })));

// Medications
const Medications = lazy(() => import('./features/medications/Medications').then(m => ({ default: m.Medications })));
const MedicationDetail = lazy(() => import('./features/medications/MedicationDetail').then(m => ({ default: m.MedicationDetail })));

// Communication
const Chat = lazy(() => import('./features/communication/Chat').then(m => ({ default: m.Chat })));
const Consultation = lazy(() => import('./features/communication/Consultation').then(m => ({ default: m.Consultation })));
const Support = lazy(() => import('./features/communication/Support').then(m => ({ default: m.Support })));
const Documents = lazy(() => import('./features/communication/Documents').then(m => ({ default: m.Documents })));
const Reports = lazy(() => import('./features/communication/Reports').then(m => ({ default: m.Reports })));

// Profile
const Profile = lazy(() => import('./features/profile/Profile').then(m => ({ default: m.Profile })));

// Notifications
const Notifications = lazy(() => import('./features/notifications/Notifications').then(m => ({ default: m.Notifications })));

// Enterprise
const EnterpriseLayout = lazy(() => import('./components/EnterpriseLayout').then(m => ({ default: m.EnterpriseLayout })));
const EnterpriseOverview = lazy(() => import('./features/enterprise/EnterpriseOverview').then(m => ({ default: m.EnterpriseOverview })));

// Misc
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-on-surface-variant font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-method" element={<VerifyMethod />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/verify-success" element={<VerifySuccess />} />

          {/* App (with layout) */}
          <Route path="/" element={<Layout />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Health */}
            <Route path="symptoms" element={<Symptoms />} />
            <Route path="sleep" element={<SleepData />} />
            <Route path="activity" element={<ActivityTracking />} />
            <Route path="vitals" element={<VitalsTracking />} />
            <Route path="goals" element={<GoalManagement />} />
            <Route path="schedule" element={<DailySchedule />} />
            <Route path="health-plan" element={<HealthPlan />} />
            <Route path="habits" element={<HabitTracker />} />

            {/* Medications */}
            <Route path="medications" element={<Medications />} />
            <Route path="medications/detail" element={<MedicationDetail />} />

            {/* Billing */}
            <Route path="billing" element={<Billing />} />
            <Route path="billing/detail" element={<BillingDetail />} />
            <Route path="billing/history" element={<PaymentHistory />} />
            <Route path="billing/methods" element={<PaymentMethods />} />
            <Route path="billing/methods/add-card" element={<AddPaymentMethod />} />
            <Route path="billing/methods/add-bank" element={<AddBankAccount />} />
            <Route path="billing/methods/verify-ach" element={<ACHVerification />} />
            <Route path="billing/methods/bank-success" element={<BankLinkedSuccess />} />
            <Route path="billing/methods/success" element={<PaymentMethodSuccess />} />
            <Route path="billing/bulk-pay/review" element={<BulkPaymentReview />} />
            <Route path="billing/bulk-pay/method" element={<BulkPaymentMethod />} />
            <Route path="billing/bulk-pay/schedule" element={<InstallmentSchedule />} />
            <Route path="billing/payment-confirmed" element={<PaymentPlanConfirmed />} />
            <Route path="billing/payment-failed" element={<PaymentFailed />} />
            <Route path="subscription" element={<Subscription />} />

            {/* Family */}
            <Route path="family" element={<FamilyHealth />} />
            <Route path="family/members" element={<FamilyMembers />} />
            <Route path="family/permissions" element={<FamilyPermissions />} />
            <Route path="family/permissions/:memberId" element={<FamilyPermissionDetail />} />
            <Route path="family/health-summary/:memberId" element={<FamilyHealthSummary />} />
            <Route path="family/challenges" element={<FamilyWellnessChallenge />} />
            <Route path="family/rewards" element={<FamilyRewards />} />
            <Route path="family/milestone" element={<MilestoneAchieved />} />
            <Route path="family/reward-redeemed" element={<RewardRedeemed />} />

            {/* Communication */}
            <Route path="consultation" element={<Consultation />} />
            <Route path="support" element={<Support />} />
            <Route path="documents" element={<Documents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chat" element={<Chat />} />

            {/* Profile */}
            <Route path="profile" element={<Profile />} />

            {/* Misc */}
            <Route path="appointments" element={<PlaceholderPage title="Appointments" />} />
            <Route path="sync" element={<DataSync />} />
            <Route path="upgrade" element={<PlaceholderPage title="Upgrade Plan" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Enterprise dashboards */}
          <Route path="/enterprise" element={<EnterpriseLayout />}>
            <Route index element={<EnterpriseOverview />} />
            <Route path="users" element={<PlaceholderPage title="User Management" />} />
            <Route path="records" element={<PlaceholderPage title="Health Records" />} />
            <Route path="tickets" element={<PlaceholderPage title="Support Tickets" />} />
            <Route path="security" element={<PlaceholderPage title="Security Logs" />} />
            <Route path="finance" element={<PlaceholderPage title="Financial Trends" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
