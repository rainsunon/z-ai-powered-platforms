import React, { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AddEmergencyContactModal } from '@/components/AddEmergencyContactModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useProfileActions } from '@/store/useProfileStore';
import { ProfileHero } from './components/ProfileHero';
import { PersonalInfoCard } from './components/PersonalInfoCard';
import { EmergencyContactsCard } from './components/EmergencyContactsCard';
import { ContactDetailsCard } from './components/ContactDetailsCard';
import { HealthScoreCard } from './components/HealthScoreCard';
import { SecurityStatusWidget } from './components/SecurityStatusWidget';
import { SecurityTab } from './components/SecurityTab';
import { PreferencesTab } from './components/PreferencesTab';
import { DataPrivacySection } from './components/DataPrivacySection';

export function Profile() {
  const navigate = useNavigate();
  const { addEmergencyContact } = useProfileActions();
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  usePageTitle('User Profile');

  const tabs = React.useMemo(() => [
    { key: 'personal', label: 'Personal', icon: 'person' },
    { key: 'security', label: 'Security', icon: 'shield' },
    { key: 'preferences', label: 'Preferences', icon: 'tune' },
  ], []);

  const handleAddContact = React.useCallback((data: any) => {
    startTransition(() => {
      addEmergencyContact({ ...data, isPrimary: false });
      setAddContactOpen(false);
    });
  }, [addEmergencyContact]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'User Profile' }]} />

      <ProfileHero />

      <Tabs defaultValue="personal">
        <TabsList className="flex w-full gap-2 bg-surface-container-low rounded-2xl p-1.5 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-headline font-bold text-sm transition-all text-on-surface-variant hover:text-on-surface data-active:bg-surface-container-lowest data-active:text-primary data-active:shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PersonalInfoCard />
              <EmergencyContactsCard onAddContact={() => setAddContactOpen(true)} />
              <ContactDetailsCard />
            </div>
            <div className="space-y-8">
              <HealthScoreCard />
              <SecurityStatusWidget />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>

      <DataPrivacySection />

      <AddEmergencyContactModal
        open={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onSubmit={handleAddContact}
      />
    </div>
  );
}
