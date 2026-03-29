import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  filled?: boolean;
}

interface CategoryItem {
  label: string;
  count: number;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'folder', label: 'All Documents', active: true, filled: true },
  { icon: 'history', label: 'Recent' },
  { icon: 'star', label: 'Favorites' },
  { icon: 'groups', label: 'Shared with Doctors' },
];

const CATEGORIES: CategoryItem[] = [
  { label: 'Lab Results', count: 12, color: 'bg-blue-500' },
  { label: 'Prescriptions', count: 8, color: 'bg-purple-500' },
  { label: 'Imaging (X-Ray/MRI)', count: 4, color: 'bg-orange-500' },
];

interface DocumentSidebarProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDropzoneClick: () => void;
  dropzoneInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentSidebar({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onDropzoneClick,
  dropzoneInputRef,
  onFileChange,
}: DocumentSidebarProps) {
  return (
    <div className="col-span-12 lg:col-span-3 space-y-8">
      <Card className="rounded-[2rem] border-0 bg-surface-container-low">
        <CardContent className="p-6 space-y-6">
          <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-on-surface-variant/60">
            Library
          </h3>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start gap-4 px-4 py-3 rounded-2xl text-sm ${
                  item.active
                    ? 'bg-white shadow-sm text-primary font-bold hover:bg-white'
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </Button>
            ))}
          </nav>

          <Separator className="mx-4 bg-outline-variant/20" />

          <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-on-surface-variant/60">
            Categories
          </h3>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.label}
                variant="ghost"
                className="w-full justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span>{cat.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full">
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Upload Dropzone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onDropzoneClick}
        className={`relative overflow-hidden group rounded-[2.5rem] p-10 border-2 border-dashed ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/[0.08]'
        } transition-all cursor-pointer flex flex-col items-center text-center space-y-5`}
      >
        <input
          ref={dropzoneInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.dcm,.csv,.doc,.docx"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cloud_upload
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-base font-extrabold text-on-surface font-headline">Quick Upload</p>
          <p className="text-sm text-on-surface-variant">
            Drag and drop medical files here or click to browse
          </p>
        </div>
      </div>
    </div>
  );
}
