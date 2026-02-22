// src/features/analysis/components/DocumentIntake.tsx
import React, { useRef } from 'react';
import { UploadedFile } from '../types';
import { cn } from '@/lib/utils';

interface DocumentIntakeProps {
    files: UploadedFile[];
    isExtracting: boolean;
    onFileUpload: (files: FileList | null) => void;
    onRemoveFile: (index: number) => void;
    onRunExtraction: () => void;
}

export const DocumentIntake: React.FC<DocumentIntakeProps> = ({
    files,
    isExtracting,
    onFileUpload,
    onRemoveFile,
    onRunExtraction,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onFileUpload(e.dataTransfer.files);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary dark:text-primary-400 mb-6 flex items-center gap-2">
                <span className="material-icons text-lg">cloud_upload</span> Document Intake
            </h3>

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => onFileUpload(e.target.files)}
            />

            <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/20 dark:border-primary/40 rounded-2xl p-10 text-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-700 transition-all cursor-pointer group"
            >
                <span className="material-icons text-primary/40 dark:text-primary-500/40 text-5xl mb-4 group-hover:scale-110 transition-transform">post_add</span>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Drop PDF/DOCX</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold italic tracking-widest uppercase">Click to browse or drag & drop</p>
            </div>

            <div className="mt-8 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {files.map((file, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4 group transition-all animate-in fade-in slide-in-from-left-2">
                        <span className="material-icons text-red-500 text-2xl">description</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black truncate text-slate-900 dark:text-white uppercase tracking-tighter">{file.name}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">{file.size} • Uploaded {file.time}</p>
                        </div>
                        <button
                            onClick={() => onRemoveFile(idx)}
                            className="material-icons text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors text-lg"
                        >
                            close
                        </button>
                    </div>
                ))}
                {files.length === 0 && (
                    <p className="text-center text-[10px] text-slate-400 py-4 uppercase font-black tracking-widest">No documents loaded</p>
                )}
            </div>

            <button
                disabled={isExtracting || files.length === 0}
                onClick={onRunExtraction}
                className={cn(
                    "w-full mt-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3",
                    isExtracting || files.length === 0
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-primary text-white shadow-primary/20 hover:brightness-110"
                )}
            >
                {isExtracting ? (
                    <span className="material-icons text-lg animate-spin">sync</span>
                ) : (
                    <span className="material-icons text-lg">psychology</span>
                )}
                {isExtracting ? 'Extracting...' : 'Run Deep Extraction'}
            </button>
        </div>
    );
};
