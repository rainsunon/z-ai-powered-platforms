// src/features/activity/pages/ActivityPage.tsx
import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { ActivityType } from '../types';
import { ACTIVITIES } from '../data/activities';
import { ActivityHeader } from '../components/ActivityHeader';
import { ActivityFilters } from '../components/ActivityFilters';
import { ActivityList } from '../components/ActivityList';
import { ActivityFooter } from '../components/ActivityFooter';

interface ActivityPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ theme, toggleTheme }) => {
    const [filter, setFilter] = useState<ActivityType>('all');
    const [search, setSearch] = useState('');

    const filteredActivities = ACTIVITIES.filter(item => {
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="p-8 max-w-6xl mx-auto space-y-10">
                <ActivityHeader search={search} setSearch={setSearch} />
                <ActivityFilters filter={filter} setFilter={setFilter} />
                <ActivityList
                    activities={filteredActivities}
                    onClearFilters={() => { setFilter('all'); setSearch(''); }}
                />
                <ActivityFooter />
            </div>
        </Layout>
    );
};

export default ActivityPage;
