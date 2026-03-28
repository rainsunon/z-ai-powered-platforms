import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MONTHS, groupByDate } from './components/calendar-utils';
import { MonthGrid } from './components/MonthGrid';
import { WeekGrid } from './components/WeekGrid';
import { DaySidebar } from './components/DaySidebar';

export function CalendarView() {
  usePageTitle('Calendar');
  const navigate = useNavigate();
  const { appointments } = useAppointmentStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const appointmentsByDate = useMemo(() => groupByDate(appointments), [appointments]);
  const selectedAppointments = selectedDate ? (appointmentsByDate[selectedDate] || []) : [];

  const navigateMonth = (delta: number) => setCurrentDate(new Date(year, month + delta, 1));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">Calendar</h1>
          <p className="font-body text-outline mt-1">View your appointments and health events at a glance.</p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/appointments')}
          className="rounded-2xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">list</span>
          List View
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="rounded-xl">
            <span className="material-symbols-outlined">chevron_left</span>
          </Button>
          <h2 className="font-headline font-bold text-2xl text-on-surface min-w-[200px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="rounded-xl">
            <span className="material-symbols-outlined">chevron_right</span>
          </Button>
        </div>
        <Button variant="outline" size="default" onClick={() => setCurrentDate(new Date())} className="rounded-xl font-bold">
          Today
        </Button>
      </div>

      {/* Tabs: Month / Week + Grid + Sidebar */}
      <Tabs defaultValue="month">
        <TabsList className="bg-surface-container rounded-full p-1 h-auto gap-0.5 mb-6">
          <TabsTrigger value="month" className="px-5 py-2 rounded-full text-sm font-bold data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">Month</TabsTrigger>
          <TabsTrigger value="week" className="px-5 py-2 rounded-full text-sm font-bold data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">Week</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TabsContent value="month">
              <MonthGrid
                year={year}
                month={month}
                selectedDate={selectedDate}
                appointmentsByDate={appointmentsByDate}
                onSelectDate={setSelectedDate}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeekGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                appointmentsByDate={appointmentsByDate}
                onSelectDate={setSelectedDate}
              />
            </TabsContent>
          </div>

          <DaySidebar
            selectedDate={selectedDate}
            selectedAppointments={selectedAppointments}
            allAppointments={appointments}
            year={year}
            month={month}
          />
        </div>
      </Tabs>
    </div>
  );
}
