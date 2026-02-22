// src/features/analysis/components/ActionBar.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ActionBarProps {
    onShare: () => void;
    onGeneratePDF: () => void;
    isDownloadingPDF: boolean;
    onExecutePlan: () => void;
    isExecuting: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    onShare,
    onGeneratePDF,
    isDownloadingPDF,
    onExecutePlan,
    isExecuting
}) => {
    const [showCaseDetails, setShowCaseDetails] = useState(false);

    return (
        <div className="fixed bottom-10 left-[calc(256px+40px)] right-10 z-50">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-full py-4 px-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-black/50 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-8 border-r border-slate-100 dark:border-slate-800 pr-10 mr-10">
                    <button
                        onClick={onShare}
                        className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400 transition-all group"
                    >
                        <span className="material-icons text-xl group-hover:scale-110">share</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Share Analysis</span>
                    </button>
                    <button
                        onClick={onGeneratePDF}
                        disabled={isDownloadingPDF}
                        className={cn(
                            "flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400 transition-all group",
                            isDownloadingPDF && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span className={cn("material-icons text-xl group-hover:scale-110", isDownloadingPDF && "animate-bounce")}>
                            {isDownloadingPDF ? 'sync' : 'file_download'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {isDownloadingPDF ? 'Generating...' : 'PDF Report'}
                        </span>
                    </button>
                </div>
                <div className="flex-1 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">
                    Last updated by LexGrid AI: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EST
                </div>
                <div className="flex items-center gap-4 relative">
                    {/* Document/Detail Icon Button */}
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowCaseDetails(true)}
                            onMouseLeave={() => setShowCaseDetails(false)}
                            onClick={() => setShowCaseDetails(!showCaseDetails)}
                            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-primary group"
                        >
                            <span className="material-icons">description</span>
                        </button>

                        {/* Popover Detail */}
                        {showCaseDetails && (
                            <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-3xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 z-[60]">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Case Metadata</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">LX-2024-8821</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Counsel</span>
                                        <span className="text-xs font-black text-slate-900 dark:text-white">Marcus Sterling</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase tracking-widest">Active Discovery</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">
                                            This case is currently utilizing LexGrid's Delaware Precision Model v4.2.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={isExecuting}
                        onClick={onExecutePlan}
                        className={cn(
                            "text-[10px] font-black uppercase tracking-widest py-3 px-10 rounded-full transition-all shadow-xl flex items-center gap-2",
                            isExecuting
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-primary text-white hover:scale-105 shadow-primary/20"
                        )}
                    >
                        {isExecuting && <span className="material-icons text-sm animate-spin">sync</span>}
                        {isExecuting ? 'Executing...' : 'Execute Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};
