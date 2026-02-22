// src/features/profile/components/PaymentMethods.tsx
import React from 'react';

export const PaymentMethods: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-50 dark:border-slate-800">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Saved Methods</h3>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Add New</button>
                </div>

                <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-primary flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <span className="material-icons text-blue-600">credit_card</span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter uppercase">Visa Ending in 4242</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 italic">Expires 09/26 • Default</p>
                            </div>
                        </div>
                        <span className="material-icons text-primary">check_circle</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <span className="material-icons text-orange-600">payment</span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter uppercase">Mastercard Ending in 8812</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 italic">Expires 12/24</p>
                            </div>
                        </div>
                        <button className="material-icons text-slate-300 hover:text-red-500 transition-colors">delete</button>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-brand/5 border-2 border-dashed border-brand/20 rounded-[32px] text-center">
                <p className="text-[10px] font-black text-brand uppercase tracking-widest">Your payment data is encrypted with bank-grade AES-256 security.</p>
            </div>
        </div>
    );
};
