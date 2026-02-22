import React from 'react';

interface ReaderFooterProps {
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

export const ReaderFooter: React.FC<ReaderFooterProps> = ({
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}) => {
    return (
        <div className="h-16 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors disabled:opacity-20"
            >
                <span className="material-icons text-sm">arrow_back</span> Previous Page
            </button>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors disabled:opacity-20"
            >
                Next Page <span className="material-icons text-sm">arrow_forward</span>
            </button>
        </div>
    );
};
