import React from 'react';
import { cn } from '../../../../lib/utils';

interface PaymentMethodProps {
    paymentMethodUpdated: boolean;
    isUpdatingPayment: boolean;
    onUpdatePayment: () => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
    paymentMethodUpdated,
    isUpdatingPayment,
    onUpdatePayment,
}) => {
    if (!paymentMethodUpdated) {
        return (
            <div className="mt-10 p-6 bg-white/10 dark:bg-slate-900 border border-white/20 dark:border-slate-800 rounded-3xl flex items-center gap-6 backdrop-blur-xl group transition-all animate-in fade-in slide-in-from-top-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 dark:bg-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <span className={cn("material-icons text-white text-2xl", isUpdatingPayment && "animate-spin")}>
                        {isUpdatingPayment ? 'sync' : 'warning'}
                    </span>
                </div>
                <div className="flex-grow">
                    <h4 className="text-white font-black text-sm uppercase tracking-tighter">Payment Method Expiring</h4>
                    <p className="text-white/60 dark:text-slate-500 text-xs mt-1 font-bold tracking-widest uppercase">Your Visa ending in 4242 expires next month. Update it to avoid service interruption.</p>
                </div>
                <button
                    disabled={isUpdatingPayment}
                    onClick={onUpdatePayment}
                    className={cn(
                        "px-8 py-3 bg-white text-brand dark:text-slate-900 text-xs font-black rounded-xl hover:bg-slate-100 active:scale-95 transition-all uppercase tracking-widest shadow-2xl flex items-center gap-2",
                        isUpdatingPayment && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUpdatingPayment ? 'Securing...' : 'Update Now'}
                </button>
            </div>
        );
    }

    return (
        <div className="mt-10 p-6 bg-emerald-500/20 dark:bg-emerald-900/40 border border-emerald-500/30 rounded-3xl flex items-center gap-6 backdrop-blur-xl animate-in fade-in zoom-in-95">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <span className="material-icons text-white text-2xl">check_circle</span>
            </div>
            <div className="flex-grow">
                <h4 className="text-white font-black text-sm uppercase tracking-tighter">Account in Good Standing</h4>
                <p className="text-white/70 text-xs mt-1 font-bold tracking-widest uppercase">Your payment information is up to date. Next billing date: Nov 01, 2024.</p>
            </div>
        </div>
    );
};
