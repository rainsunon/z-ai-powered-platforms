import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SymptomCard } from './components/SymptomCard';
import { CategoryCard } from './components/CategoryCard';
import { ResourceItem } from './components/ResourceItem';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MOODS = [
  { emoji: '😄', label: 'Great', value: 5, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-teal-100 text-teal-700 border-teal-300' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { emoji: '😔', label: 'Low', value: 2, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { emoji: '😞', label: 'Bad', value: 1, color: 'bg-red-100 text-red-700 border-red-300' },
] as const;

interface MoodEntry {
  id: number;
  mood: number;
  note: string;
  date: string;
  time: string;
}

const categories = [
  { icon: 'psychology', title: 'Neurological', description: 'Headaches, dizziness, memory clarity, and focus concerns.' },
  { icon: 'respiratory_rate', title: 'Respiratory', description: 'Shortness of breath, persistent cough, and lung vitality.' },
  { icon: 'body_system', title: 'Digestive', description: 'Metabolic balance, bloating, and nutritional absorption.' },
  { icon: 'ecg_heart', title: 'Cardiovascular', description: 'Heart rate, circulation, and blood pressure monitoring.' },
];

const resources = [
  {
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGOiXe81ha3bQPA-yCvXO7toEusFEaCgLJPVasrRzaxwoRN1Y9R_sr1YfHKL9YQTBjxLNjsT5D2zhgjyw_24aaI-RfqE6_pzGRacvuWJBt3CVAi41cyp6Nye-Bevv04U3IKYRxi8o9-1AdItsHFL-ItamuOVBLbku6zpOBVTPMltr8TRQllGNTnNXtTvOrvnCxb_hW8c9nmjPXfWuQ9t6xVXX2vUfctk-bdUX5vs6lEZQVHAC9fUT4lhJZ5Qk4njMJYGlD2cIzZQ',
    category: 'Wellness', readTime: '5 min read',
    title: 'Morning Vitality: Breathwork for Longevity',
    description: 'Discover how simple breathing exercises can reset your nervous system...',
  },
  {
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAriLMuuPOUBMJLTS_QgUzBUvgku4DuUnr1mFMuCq7XqqCoCQOQAeH8zkFtzLZ2kL1SaLqSTLiXfBhs8AoQJU4ycVsCZWkLCsmWBP2v7p6M6nTf0dHsPmw9onU-tDdBAMKYPQlAmDbPibxr-dVIqkEHPgJBOaYo5GoYuUitu3vLBgNOLwkCjaXYdxz45aiBePEw2NQIt25-KbRj9dy4BaH0rcg6Cbh3DOKvtDG3KIypA_kOsHkbmwrOHby2EQ6cuB2zzR5h7C4vaoE',
    category: 'Nutrition', readTime: '8 min read',
    title: 'Anti-Inflammatory Superfoods',
    description: 'The science behind chronic inflammation and the foods that fight it...',
  },
  {
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUc_TgpRv8GuplwZi3qn3GS_ZMzmTeb85QatAcL4xWZHH7ek6-U-1yUgVw61APyZMUa49uh9EaAUXXyQMgOlWRXaiDdsANzjmGf0VpET8-vCE2CRZxidAvcfDUmvIBJqG7S0IBFXpGjersf-fJ1Q1_IORmxEkJslDmnQu9sNy2LfVXCBD0o3B7URr0CbvXKcWgnNsnG-WNXmMyzTZw-E3XCB3EvCrn17yy9StDKPk9k_NB0Jszv2fsA1leAyYo3zAulAUQillc6gA',
    category: 'Medical Tech', readTime: '12 min read',
    title: 'The Future of AI in Personal Diagnosis',
    description: 'How NovaHealth is pioneering predictive analysis for patient care...',
  },
];

export function Symptoms() {
  const [loggedSymptoms, setLoggedSymptoms] = useState([
    { id: 1, name: 'Morning Headache', date: 'Oct 24, 2024', severity: 'Mild', resolved: false },
    { id: 2, name: 'Lower Back Pain', date: 'Oct 22, 2024', severity: 'Moderate', resolved: true },
    { id: 3, name: 'Fatigue', date: 'Oct 20, 2024', severity: 'Severe', resolved: false },
  ]);

  const toggleSymptomResolved = (id: number) => {
    setLoggedSymptoms(prev => prev.map(s => s.id === id ? { ...s, resolved: !s.resolved } : s));
  };

  // Mood tracking state
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: 1, mood: 4, note: 'Feeling rested after good sleep.', date: 'Oct 24, 2024', time: '8:15 AM' },
    { id: 2, mood: 3, note: 'Mild headache midday.', date: 'Oct 23, 2024', time: '1:30 PM' },
    { id: 3, mood: 5, note: 'Great workout, good energy all day.', date: 'Oct 22, 2024', time: '7:00 PM' },
    { id: 4, mood: 2, note: 'Stress from work deadlines.', date: 'Oct 21, 2024', time: '9:45 PM' },
  ]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');

  const logMood = () => {
    if (selectedMood === null) return;
    const now = new Date();
    setMoodEntries(prev => [{
      id: Date.now(),
      mood: selectedMood,
      note: moodNote,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }, ...prev]);
    setSelectedMood(null);
    setMoodNote('');
    toast.success('Mood logged');
  };

  const getMoodInfo = (value: number) => MOODS.find(m => m.value === value) || MOODS[2];

  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, e) => sum + e.mood, 0) / moodEntries.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-12">
      {/* Hero Title */}
      <div className="mb-12">
        <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 block">Knowledge Base</span>
        <h2 className="text-5xl font-extrabold font-headline text-on-surface tracking-tight mb-4">Symptoms & <span className="text-primary">Vitality Resources</span></h2>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Explore our curated database of symptoms and evidence-based health resources. 
          Your luminous journey to recovery starts with clarity and understanding.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Symptom Checker CTA (Large Glass Card) */}
        <div className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] relative overflow-hidden group shadow-sm border border-white/40">
          <div className="relative z-10 flex flex-col h-full">
            <div className="bg-primary-container/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
            </div>
            <h3 className="text-3xl font-bold font-headline mb-4">Interactive Symptom Analyzer</h3>
            <p className="text-on-surface-variant mb-8 max-w-md">Our AI-powered engine helps cross-reference your current feelings with clinical data to suggest potential next steps.</p>
            <div className="mt-auto">
              <button className="px-8 py-4 bg-on-surface text-surface rounded-full font-headline font-bold text-sm hover:bg-primary transition-colors flex items-center gap-3 w-fit">
                Start Diagnostic Scan
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-colors duration-700"></div>
        </div>

        {/* Emergency Contact (Square Card) */}
        <div className="col-span-12 lg:col-span-4 bg-error-container/30 p-8 rounded-[2.5rem] border border-error/5 flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-error mb-4">emergency</span>
            <h4 className="text-xl font-bold font-headline text-on-error-container">Critical Support</h4>
            <p className="text-sm text-on-error-container/70 mt-2">If you are experiencing chest pain or difficulty breathing, call emergency services immediately.</p>
          </div>
          <a className="w-full py-4 bg-error text-white text-center rounded-2xl font-bold text-lg mt-6 shadow-lg shadow-error/20 block" href="tel:911">
            Call 911
          </a>
        </div>

        {/* My Logged Symptoms with Tabs */}
        <div className="col-span-12 py-4">
          <Tabs defaultValue="All">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold font-headline">My Logged Symptoms</h4>
              <TabsList className="bg-surface-container rounded-full p-1 h-auto">
                <TabsTrigger value="All" className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-primary data-active:text-white data-active:shadow-md text-on-surface-variant">All</TabsTrigger>
                <TabsTrigger value="Active" className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-primary data-active:text-white data-active:shadow-md text-on-surface-variant">Active (Unresolved)</TabsTrigger>
                <TabsTrigger value="Resolved" className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-primary data-active:text-white data-active:shadow-md text-on-surface-variant">Resolved</TabsTrigger>
              </TabsList>
            </div>

            {(['All', 'Active', 'Resolved'] as const).map((filterValue) => (
              <TabsContent key={filterValue} value={filterValue}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {loggedSymptoms
                    .filter(s => filterValue === 'All' ? true : filterValue === 'Active' ? !s.resolved : s.resolved)
                    .length === 0 ? (
                    <div className="col-span-full py-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-[2rem] border border-dashed border-outline-variant/50">
                      <p>No symptoms found for this filter.</p>
                    </div>
                  ) : (
                    loggedSymptoms
                      .filter(s => filterValue === 'All' ? true : filterValue === 'Active' ? !s.resolved : s.resolved)
                      .map(symptom => (
                        <SymptomCard key={symptom.id} symptom={symptom} onToggleResolved={toggleSymptomResolved} />
                      ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Featured Symptom Categories */}
        <div className="col-span-12 py-4">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-bold font-headline">Mood & Wellbeing Tracker</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Log Mood Card */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-surface-variant/30 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">mood</span>
                </div>
                <div>
                  <h5 className="font-headline font-bold text-lg text-on-surface">How are you feeling?</h5>
                  <p className="text-xs text-on-surface-variant">Log your mood to track patterns over time.</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all hover:scale-105',
                      selectedMood === m.value ? `${m.color} border-current shadow-md scale-105` : 'border-transparent bg-surface-container hover:bg-surface-container-high',
                    )}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                  </button>
                ))}
              </div>

              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Add a note about how you're feeling..."
                rows={2}
                className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 px-4 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />

              <button
                onClick={logMood}
                disabled={selectedMood === null}
                className="w-full py-3 rounded-xl primary-gradient text-on-primary font-bold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
              >
                Log Mood
              </button>
            </div>

            {/* Mood Summary + History */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest rounded-2xl p-4 text-center border border-surface-variant/30">
                  <p className="text-2xl font-bold font-headline text-primary">{avgMood}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Avg Mood</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-4 text-center border border-surface-variant/30">
                  <p className="text-2xl font-bold font-headline text-on-surface">{moodEntries.length}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Entries</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-4 text-center border border-surface-variant/30">
                  <p className="text-2xl">{moodEntries.length > 0 ? getMoodInfo(moodEntries[0].mood).emoji : '—'}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Latest</p>
                </div>
              </div>

              {/* Recent Entries */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-surface-variant/30">
                <h5 className="font-headline font-bold text-sm text-on-surface mb-4">Recent Entries</h5>
                <div className="space-y-3 max-h-[240px] overflow-y-auto">
                  {moodEntries.slice(0, 7).map((entry) => {
                    const info = getMoodInfo(entry.mood);
                    return (
                      <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container/50 transition-colors">
                        <span className="text-xl shrink-0">{info.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', info.color)}>{info.label}</span>
                            <span className="text-[10px] text-outline shrink-0">{entry.date} · {entry.time}</span>
                          </div>
                          {entry.note && <p className="text-xs text-on-surface-variant mt-1 truncate">{entry.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Symptom Categories */}
        <div className="col-span-12 py-4">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-bold font-headline">Symptom Categories</h4>
            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
              View All Categories <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </div>
        </div>

        {/* Recent Health Articles */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h4 className="text-2xl font-bold font-headline mb-8">Latest Health Resources</h4>
          <div className="flex flex-col gap-4">
            {resources.map((res) => (
              <ResourceItem key={res.title} {...res} />
            ))}
          </div>
        </div>

        {/* Sidebar Content (Health Stats/Tips) */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-surface-container-high p-8 rounded-[2.5rem]">
            <h4 className="text-xl font-bold font-headline mb-6">Today's Health Tip</h4>
            <div className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-primary">
              <p className="text-on-surface italic leading-relaxed">
                "Adequate hydration isn't just about water; it's about the minerals that help your cells absorb it. Try adding a pinch of sea salt to your first glass of the day."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl" data-icon="local_drink">local_drink</span>
                </div>
                <div>
                  <p className="text-xs font-bold">Recommended Habit</p>
                  <p className="text-xs text-on-surface-variant">Hydro-Remineralization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
            <h4 className="text-xl font-bold font-headline mb-4">Consultation Availability</h4>
            <p className="text-sm text-on-surface-variant mb-6">Want to discuss your symptoms with a professional?</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" data-icon="video_call">video_call</span>
                  <span className="text-sm font-medium">Virtual Visit</span>
                </div>
                <span className="text-xs font-bold text-primary">Now Available</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant" data-icon="home_health">home_health</span>
                  <span className="text-sm font-medium">In-Clinic</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Next: 2:30 PM</span>
              </div>
            </div>
            <button className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-container transition-colors">
              Book an Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
