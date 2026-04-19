import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DocumentSidebar } from './components/DocumentSidebar';
import { DocumentListPanel } from './components/DocumentListPanel';
import { SecureSharingBanner } from './components/SecureSharingBanner';
import { toast } from 'sonner';

interface DocRecord {
  title: string; source: string; date: string;
  icon: string; iconBgClass: string; iconColorClass: string;
  typeLabel: string; typeBadgeClass: string;
  statusLabel?: string; statusDot?: string;
  metaLabel?: string; metaValue?: string;
}

const ACCEPTED_TYPES = [
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/dicom', 'text/csv', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

function detectCategory(file: File): Pick<DocRecord, 'icon' | 'iconBgClass' | 'iconColorClass' | 'typeLabel' | 'typeBadgeClass'> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (['dcm', 'dicom'].includes(ext) || file.type === 'application/dicom')
    return { icon: 'radiology', iconBgClass: 'bg-orange-100', iconColorClass: 'text-orange-700', typeLabel: 'Imaging', typeBadgeClass: 'bg-orange-100 text-orange-700' };
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext))
    return { icon: 'image', iconBgClass: 'bg-indigo-100', iconColorClass: 'text-indigo-700', typeLabel: 'Image', typeBadgeClass: 'bg-indigo-100 text-indigo-700' };
  if (ext === 'csv')
    return { icon: 'biotech', iconBgClass: 'bg-emerald-100', iconColorClass: 'text-emerald-700', typeLabel: 'Labs', typeBadgeClass: 'bg-blue-100 text-blue-700' };
  return { icon: 'description', iconBgClass: 'bg-blue-100', iconColorClass: 'text-blue-700', typeLabel: 'Document', typeBadgeClass: 'bg-blue-100 text-blue-700' };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DEFAULT_DOCUMENTS: DocRecord[] = [
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocRecord[]>(DEFAULT_DOCUMENTS);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newDocs: DocRecord[] = [];
    let rejected = 0;

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        rejected++;
        continue;
      }
      const cat = detectCategory(file);
      const now = new Date();
      newDocs.push({
        ...cat,
        title: file.name.replace(/\.[^/.]+$/, ''),
        source: 'Uploaded by You',
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        metaLabel: 'Size',
        metaValue: formatFileSize(file.size),
      });
    }

    if (newDocs.length > 0) {
      setDocuments((prev) => [...newDocs, ...prev]);
      toast.success(`${newDocs.length} document${newDocs.length > 1 ? 's' : ''} uploaded`);
    }
    if (rejected > 0) {
      toast.error(`${rejected} file${rejected > 1 ? 's' : ''} rejected (max ${MAX_FILE_SIZE / 1024 / 1024} MB)`);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

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
          <Button
            variant="secondary"
            className="bg-surface-container-high text-primary px-7 py-3.5 rounded-xl font-headline font-extrabold text-sm hover:bg-surface-container-highest hover:shadow-md gap-2.5"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Export All
          </Button>
          <Button
            className="primary-gradient text-white px-7 py-3.5 rounded-xl font-headline font-extrabold text-sm shadow-[0_10px_20px_-5px_rgba(29,204,13,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(29,204,13,0.4)] hover:-translate-y-0.5 active:translate-y-0 gap-2.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Upload New Document
          </Button>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.dcm,.csv,.doc,.docx" className="hidden" onChange={handleFileInputChange} />
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        <DocumentSidebar
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDropzoneClick={() => dropzoneInputRef.current?.click()}
          dropzoneInputRef={dropzoneInputRef}
          onFileChange={handleFileInputChange}
        />
        <DocumentListPanel documents={documents} />
      </div>

      <SecureSharingBanner />
    </div>
  );
}
