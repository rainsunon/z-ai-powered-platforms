import React from 'react';
import { Plan, BillingCycle } from '../types';
import { cn } from '../../../../lib/utils';
// Note: I am not using shadcn button yet to keep it simple with existing styles, 
// but organizing into components.

interface PlanCardProps {
    plan: Plan;
    billingCycle: BillingCycle;
    isSubscribing: string | null;
    onSubscribe: (planId: string) => void;
    onContactSales: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    billingCycle,
    isSubscribing,
    onSubscribe,
    onContactSales,
}) => {
    const isEnterprise = plan.price === 'Custom';
    const displayPrice = isEnterprise
        ? 'Custom'
        : billingCycle === 'monthly' ? `$${plan.monthlyPrice}` : `$${plan.yearlyPrice}`;

    return (
        <div className={cn(
            "rounded-3xl p-10 flex flex-col transition-all relative group shadow-3xl",
            plan.popular
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white scale-105 z-10 border-4 border-primary dark:border-primary-500"
                : "bg-primary dark:bg-slate-900 text-white border border-white/10 dark:border-slate-800"
        )}>
            {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary dark:bg-primary-500 text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl">
                    Most Popular
                </div>
            )}
            <div className="mb-10">
                <h3 className={cn("text-2xl font-black mb-3 uppercase tracking-tighter", plan.popular && "text-primary dark:text-primary-400")}>{plan.name}</h3>
                <p className="text-sm font-bold uppercase tracking-tighter opacity-70">{plan.desc}</p>
            </div>
            <div className="mb-10 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{displayPrice}</span>
                {!isEnterprise && <span className="opacity-60 text-sm font-bold">/mo</span>}
            </div>
            <ul className="space-y-5 mb-12 flex-grow">
                {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-[11px] font-bold uppercase tracking-widest opacity-90">
                        <span className={cn("material-icons text-sm mt-0.5", plan.popular ? "text-primary dark:text-primary-400" : "text-white/60 dark:text-slate-500")}>check_circle</span>
                        {f}
                    </li>
                ))}
            </ul>
            <button
                disabled={plan.current || isSubscribing !== null}
                onClick={() => {
                    if (isEnterprise) {
                        onContactSales();
                    } else {
                        onSubscribe(plan.id);
                    }
                }}
                className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-2",
                    plan.current
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-default"
                        : plan.popular
                            ? "bg-primary dark:bg-primary-600 text-white hover:brightness-110 transform hover:-translate-y-1"
                            : "border border-white/30 dark:border-slate-700 text-white hover:bg-white/10 dark:hover:bg-slate-800"
                )}
            >
                {isSubscribing === plan.id && <span className="material-icons text-sm animate-spin">sync</span>}
                {plan.current ? 'Current Plan' : isEnterprise ? 'Contact Sales' : (isSubscribing === plan.id ? 'Processing...' : 'Subscribe')}
            </button>
        </div>
    );
};
