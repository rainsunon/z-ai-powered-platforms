
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages
const Landing = lazy(() => import('./src/features/landing/pages/LandingPage'));
const Login = lazy(() => import('./src/features/auth/pages/LoginPage'));
const Dashboard = lazy(() => import('./src/features/dashboard/pages/DashboardPage'));
const AIChat = lazy(() => import('./src/features/ai-chat/pages/AIChatPage'));
const Directory = lazy(() => import('./src/features/directory/pages/DirectoryPage'));
const Scheduling = lazy(() => import('./src/features/scheduling/pages/SchedulingPage'));
const Billing = lazy(() => import('./src/features/billing/pages/BillingPage'));
const Analysis = lazy(() => import('./src/features/analysis/pages/AnalysisPage'));
const Profile = lazy(() => import('./src/features/profile/pages/ProfilePage'));
const Activity = lazy(() => import('./src/features/activity/pages/ActivityPage'));
const LawSearch = lazy(() => import('./src/features/law-search/pages/LawSearchPage'));
const DivorceLaw = lazy(() => import('./src/features/divorce-law/pages/DivorceLawPage'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-brand">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white font-bold tracking-widest uppercase text-xs">LexGrid Intelligence Initializing...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/chat" element={<AIChat theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/directory" element={<Directory theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/scheduling" element={<Scheduling theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/billing" element={<Billing theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/analysis" element={<Analysis theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/profile" element={<Profile theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/activity" element={<Activity theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/search-law" element={<LawSearch theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/divorce-law" element={<DivorceLaw theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
