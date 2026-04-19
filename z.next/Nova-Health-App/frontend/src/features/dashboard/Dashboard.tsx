import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogSymptomsModal } from '@/components/LogSymptomsModal';
import { AlertBanner } from '@/components/AlertBanner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { DashboardHero } from './components/DashboardHero';
import { VitalsGrid } from './components/VitalsGrid';
import { SymptomOverview } from './components/SymptomOverview';
import { AppointmentCard } from './components/AppointmentCard';
import { ResourceList } from './components/ResourceList';
import { FamilyHealthCard } from './components/FamilyHealthCard';
import { VitalRecoveryChart } from './components/VitalRecoveryChart';
import { PrescriptionsCard } from './components/PrescriptionsCard';
import { SanctuaryWisdomCard } from './components/SanctuaryWisdomCard';
import { QuickConnectCard } from './components/QuickConnectCard';

export function Dashboard() {
  const navigate = useNavigate();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  usePageTitle('Dashboard');

  return (
    <div className="space-y-8 pb-12">
      <LogSymptomsModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} />

      {/* Alert Section */}
      <AlertBanner
        variant="error"
        icon="emergency"
        title="Insurance Verification Required"
        description="Your current policy documentation expires in 48 hours. Please upload your latest certificate to maintain coverage."
        actionLabel="Resolve Now"
        onAction={() => navigate('/documents')}
      />

      <AlertBanner
        variant="info"
        icon="schedule"
        title="Upcoming Appointment"
        description={<>Cardiology Review with <span className="font-bold">Dr. Aris</span> in 2 hours (14:30 PM)</>}
        actionLabel="View Prep Notes"
        onAction={() => navigate('/appointments')}
      />

      <DashboardHero onLogSymptoms={() => setIsLogModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          <VitalsGrid />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FamilyHealthCard />
            <VitalRecoveryChart />
          </div>

          <SymptomOverview />
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          <PrescriptionsCard />
          <SanctuaryWisdomCard />
          <QuickConnectCard />
          <AppointmentCard />
          <ResourceList />
        </div>
      </div>
    </div>
  );
}
