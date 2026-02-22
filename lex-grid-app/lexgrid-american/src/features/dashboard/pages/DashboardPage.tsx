// src/features/dashboard/pages/DashboardPage.tsx
import React from 'react';
import Layout from '../../../components/layout/Layout';
import { WelcomeHeader } from '../components/WelcomeHeader';
import { ActionGrid } from '../components/ActionGrid';
import { StatsOverview } from '../components/StatsOverview';
import { RecentAlerts } from '../components/RecentAlerts';

interface DashboardPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ theme, toggleTheme }) => {
    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="p-8 space-y-10 max-w-7xl mx-auto">
                <WelcomeHeader />
                <ActionGrid />

                {/* Stats and Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <StatsOverview />
                    <RecentAlerts />
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
