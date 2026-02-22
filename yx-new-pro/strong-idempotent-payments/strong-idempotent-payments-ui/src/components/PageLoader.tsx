/**
 * Full-page loading spinner used by React.lazy Suspense fallback.
 */
export function PageLoader() {
    return (
        <div className="flex items-center justify-center flex-1 min-h-[40vh]">
            <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                <div className="w-10 h-10 rounded-full border-3 border-border border-t-primary animate-spin" />
                <span className="text-sm text-text-muted tracking-wide">Loading…</span>
            </div>
        </div>
    );
}
