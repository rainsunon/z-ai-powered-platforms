import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SymptomCard } from './components/SymptomCard';
import { CategoryCard } from './components/CategoryCard';
import { ResourceItem } from './components/ResourceItem';

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
