import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { PLANS } from '../data/plans';
import { PaymentMethod } from '../components/PaymentMethod';
import { PlanCard } from '../components/PlanCard';
import { BillingCycle } from '../types';
import { cn } from '../../../lib/utils';

interface BillingPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const BillingPage: React.FC<BillingPageProps> = ({ theme, toggleTheme }) => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
    const [paymentMethodUpdated, setPaymentMethodUpdated] = useState(false);

    const handleUpdatePayment = () => {
        setIsUpdatingPayment(true);
        // Simulate a secure redirect and update process
        setTimeout(() => {
            setIsUpdatingPayment(false);
            setPaymentMethodUpdated(true);
            alert("Payment method successfully updated. Your account is now in good standing.");
        }, 2000);
    };

    const handleSubscribe = (planId: string) => {
        setIsSubscribing(planId);
        setTimeout(() => {
            setIsSubscribing(null);
            alert(`Success! You have successfully upgraded to the ${planId.toUpperCase()} plan. Your new billing cycle starts immediately.`);
        }, 1500);
    };

    const handleContactSales = () => {
        const subject = encodeURIComponent("Inquiry about LexGrid Enterprise Plan");
        const body = encodeURIComponent("Hello LexGrid Sales Team,\n\nI am interested in the Enterprise plan for my firm. Please provide more information about on-premise deployment and SSO integration.\n\nThank you.");
        window.location.href = `mailto:sales@lexgrid.ai?subject=${subject}&body=${body}`;
    };

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="bg-brand dark:bg-slate-950 min-h-screen p-10 font-sans transition-colors duration-300">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-white">
                        <h1 className="text-4xl font-extrabold mb-4 tracking-tighter uppercase">Subscription & Billing</h1>
                        <p className="text-white/70 dark:text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">Manage your legal AI toolkit, view upcoming invoices, and adjust your jurisdiction settings for Canada and USA operations.</p>

                        <PaymentMethod
                            paymentMethodUpdated={paymentMethodUpdated}
                            isUpdatingPayment={isUpdatingPayment}
                            onUpdatePayment={handleUpdatePayment}
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-white/10 dark:bg-slate-900 backdrop-blur-2xl border border-white/20 dark:border-slate-800 p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={cn(
                                    "px-8 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest",
                                    billingCycle === 'monthly' ? "bg-white dark:bg-slate-800 text-brand dark:text-primary-400 shadow-2xl" : "text-white/60 dark:text-slate-500 hover:text-white"
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={cn(
                                    "px-8 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest relative",
                                    billingCycle === 'yearly' ? "bg-white dark:bg-slate-800 text-brand dark:text-primary-400 shadow-2xl" : "text-white/60 dark:text-slate-500 hover:text-white"
                                )}
                            >
                                Yearly <span className="ml-2 text-[8px] bg-brand text-white dark:bg-primary-500 px-2 py-0.5 rounded-full border border-white/10">Save 20%</span>
                            </button>
                        </div>
                        <p className="mt-4 text-[9px] text-white/40 dark:text-slate-600 uppercase tracking-[0.4em] font-black">Prices in USD</p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {PLANS.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                billingCycle={billingCycle}
                                isSubscribing={isSubscribing}
                                onSubscribe={handleSubscribe}
                                onContactSales={handleContactSales}
                            />
                        ))}
                    </div>

                    {/* History Table - Inline for now as it's simple enough or extract if needed */}
                    <div className="bg-primary/90 dark:bg-slate-900 backdrop-blur-2xl border border-white/10 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xl">
                        <div className="p-8 border-b border-white/10 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black text-white uppercase tracking-widest text-sm">Billing History</h3>
                            <button className="text-[10px] text-white/50 flex items-center gap-2 hover:text-white transition-colors font-black uppercase tracking-widest">
                                <span className="material-icons text-sm">filter_list</span> Filter
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-white">
                                <thead>
                                    <tr className="bg-white/5 dark:bg-slate-800/50 text-white/40 dark:text-slate-600 text-[9px] uppercase tracking-[0.3em] font-black">
                                        <th className="px-8 py-5">Invoice ID</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 dark:divide-slate-800">
                                    {[4, 3, 2].map((num) => (
                                        <tr key={num} className="hover:bg-white/5 dark:hover:bg-slate-800 transition-colors group">
                                            <td className="px-8 py-6 font-black tracking-tighter opacity-90">INV-2024-00{num}</td>
                                            <td className="px-8 py-6 opacity-60 font-bold uppercase text-[11px]">Oct 01, 2023</td>
                                            <td className="px-8 py-6 font-black text-lg tracking-tighter">$89.00</td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/20 dark:bg-slate-800 text-white">Paid</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="w-10 h-10 rounded-full bg-white/10 dark:bg-slate-800 text-white hover:bg-primary dark:hover:bg-primary-600 transition-all flex items-center justify-center ml-auto">
                                                    <span className="material-icons text-lg">file_download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-white/5 dark:bg-slate-900/50 text-center border-t border-white/5 dark:border-slate-800">
                            <button className="text-[10px] text-white/40 hover:text-white dark:hover:text-slate-400 font-black uppercase tracking-[0.3em] transition-colors">Load More History</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BillingPage;
