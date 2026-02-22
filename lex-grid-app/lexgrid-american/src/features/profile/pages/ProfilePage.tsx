// src/features/profile/pages/ProfilePage.tsx
import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileTabs } from '../components/ProfileTabs';
import { PersonalInfo } from '../components/PersonalInfo';
import { PaymentMethods } from '../components/PaymentMethods';
import { SecuritySettings } from '../components/SecuritySettings';
import { UsageStats } from '../components/UsageStats';

interface ProfilePageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'payment' | 'security'>('info');

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="p-8 max-w-5xl mx-auto space-y-10">
                <ProfileHeader />
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-8">
                        {activeTab === 'info' && <PersonalInfo />}
                        {activeTab === 'payment' && <PaymentMethods />}
                        {activeTab === 'security' && <SecuritySettings />}
                    </div>
                    <UsageStats />
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
