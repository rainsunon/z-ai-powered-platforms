import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DocumentRow } from './components/DocumentRow';

const documents = [
  {
    title: 'Full Blood Count Analysis', source: 'St. Jude Medical Center', date: 'Oct 24, 2024',
    icon: 'biotech', iconBgClass: 'bg-emerald-100', iconColorClass: 'text-emerald-700',
    typeLabel: 'Labs', typeBadgeClass: 'bg-blue-100 text-blue-700',
    statusLabel: 'Reviewed', statusDot: 'primary', metaLabel: 'Status',
  },
  {
    title: 'Cardiology Prescription - Lisinopril', source: 'Dr. Sarah Thompson', date: 'Oct 18, 2024',
    icon: 'prescriptions', iconBgClass: 'bg-purple-100', iconColorClass: 'text-purple-700',
    typeLabel: 'RX', typeBadgeClass: 'bg-purple-100 text-purple-700',
    metaLabel: 'Expiration', metaValue: 'Apr 18, 2025',
  },
  {
    title: 'Chest X-Ray Post-Viral Recovery', source: 'City Imaging Center', date: 'Sep 30, 2024',
    icon: 'radiology', iconBgClass: 'bg-orange-100', iconColorClass: 'text-orange-700',
    typeLabel: 'Imaging', typeBadgeClass: 'bg-orange-100 text-orange-700',
    metaLabel: 'Size', metaValue: '14.2 MB (DICOM)',
  },
  {
    title: 'Annual Wellness Visit Report', source: 'St. Jude Medical Center', date: 'Sep 12, 2024',
    icon: 'monitoring', iconBgClass: 'bg-emerald-100', iconColorClass: 'text-emerald-700',
    typeLabel: 'Reports', typeBadgeClass: 'bg-emerald-100 text-emerald-700',
    statusLabel: 'Archived', statusDot: 'muted', metaLabel: 'Status',
  },
];

export function Documents() {
  return (
    <div className="space-y-12">
      {/* Hero Section / Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            Medical <span className="text-primary italic font-medium">Records</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-lg">Your health journey, organized and secure in one sanctuary.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-surface-container-high text-primary px-7 py-3.5 rounded-xl font-headline font-extrabold text-sm hover:bg-surface-container-highest hover:shadow-md transition-all flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl">download</span>
            Export All
          </button>
          <button className="primary-gradient text-white px-7 py-3.5 rounded-xl font-headline font-extrabold text-sm shadow-[0_10px_20px_-5px_rgba(29,204,13,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(29,204,13,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2.5">
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Upload New Document
          </button>
        </div>
      </section>

      {/* Bento-ish Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation Folders */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
          <div className="bg-surface-container-low rounded-[2rem] p-6 space-y-6">
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-on-surface-variant/60">Library</h3>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white shadow-sm text-primary font-bold transition-all">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                <span className="text-sm">All Documents</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-white/50 transition-all group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">history</span>
                <span className="text-sm">Recent</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-white/50 transition-all group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">star</span>
                <span className="text-sm">Favorites</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-white/50 transition-all group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">groups</span>
                <span className="text-sm">Shared with Doctors</span>
              </button>
            </nav>

            <hr className="border-outline-variant/20 mx-4" />

            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-on-surface-variant/60">Categories</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary transition-all text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Lab Results</span>
                </div>
                <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full">12</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary transition-all text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Prescriptions</span>
                </div>
                <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full">8</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary transition-all text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Imaging (X-Ray/MRI)</span>
                </div>
                <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full">4</span>
              </button>
            </div>
          </div>

          {/* Mini Dropzone */}
          <div className="relative overflow-hidden group rounded-[2.5rem] p-10 border-2 border-dashed border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/[0.08] transition-all cursor-pointer flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-extrabold text-on-surface font-headline">Quick Upload</p>
              <p className="text-sm text-on-surface-variant">Drag and drop medical files here or click to browse</p>
            </div>
          </div>
        </div>

        {/* Main Record List */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {/* Filters and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant/70 mr-2 uppercase tracking-wider">Filter by:</span>
              <Tabs defaultValue="all">
                <TabsList className="bg-transparent h-auto gap-2 p-0">
                  <TabsTrigger value="all" className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant">All Types</TabsTrigger>
                  <TabsTrigger value="labs" className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant">Labs</TabsTrigger>
                  <TabsTrigger value="prescriptions" className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant">Prescriptions</TabsTrigger>
                  <TabsTrigger value="imaging" className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant">Imaging</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
              <span>Sorted by: <span className="text-on-surface font-bold">Newest First</span></span>
              <span className="material-symbols-outlined text-lg cursor-pointer">filter_list</span>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentRow key={doc.title} {...doc} />
            ))}
          </div>

          {/* Pagination-like Footer */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant text-xs font-medium transition-all">2</button>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant text-xs font-medium transition-all">3</button>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section: Insights */}
      <section className="primary-gradient rounded-[3rem] p-10 md:p-14 relative overflow-hidden text-white shadow-2xl shadow-primary/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl space-y-6">
            <h3 className="text-3xl md:text-4xl font-extrabold font-headline leading-tight italic">Secure Sharing Made Simple</h3>
            <p className="text-emerald-50 text-lg">Need to share your records with a specialist? Generate a one-time secure link or add your doctor directly to your circle.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-primary rounded-2xl font-bold font-headline shadow-xl shadow-black/10 hover:scale-105 transition-transform">Invite Doctor</button>
              <button className="px-8 py-4 bg-emerald-800/20 text-white border border-emerald-400/30 backdrop-blur-md rounded-2xl font-bold font-headline hover:bg-emerald-800/40 transition-all">Learn About Security</button>
            </div>
          </div>
          <div className="hidden lg:block relative shrink-0">
            <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[8rem] text-emerald-200/40">lock_person</span>
            </div>
            <div className="absolute -top-4 -right-4 bg-secondary-fixed text-on-secondary-fixed p-4 rounded-3xl shadow-xl">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 right-1/4 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
      </section>
    </div>
  );
}
