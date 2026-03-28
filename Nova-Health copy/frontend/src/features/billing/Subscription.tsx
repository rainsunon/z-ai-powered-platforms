import React from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useProfileStore } from '@/store/useProfileStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

export function Subscription() {
  const { profile } = useProfileStore();
  const { plans, currentPlanId, billingCycle, setBillingCycle, selectPlan } = useSubscriptionStore();
  usePageTitle('Account & Billing');

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold font-headline text-on-surface tracking-tight">Account &amp; Billing</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">Manage your personal sanctuary settings, security preferences, and premium vitality plans.</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile & Security Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Personal Details Card */}
          <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-bold text-xl">Personal Details</h2>
              <button className="text-primary font-semibold text-sm hover:underline">Edit</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Full Name</p>
                  <p className="font-semibold">{profile.fullName}</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Email Address</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Timezone</p>
                  <p className="font-medium">{profile.timezone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Card */}
          <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-sm">
            <h2 className="font-headline font-bold text-xl mb-6">Security</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-bright transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                  <span className="font-medium">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-bright transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">shield</span>
                  <span className="font-medium">Two-Factor Auth</span>
                </div>
                <span className="text-xs font-bold text-primary bg-secondary-container px-2 py-1 rounded-full">Active</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-bright transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">devices</span>
                  <span className="font-medium">Active Sessions</span>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </button>
            </div>
          </section>
        </div>

        {/* Premium Subscription Column */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container rounded-[3rem] p-6 sm:p-10 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="inline-block py-1 px-3 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Luminous Premium
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight mb-2">Elevate Your Vitality</h2>
                  <p className="text-on-surface-variant max-w-md">Choose the rhythm that suits your lifestyle. Unlock advanced medical AI and personalized guidance.</p>
                </div>
                <div className="flex bg-surface-container-high p-1.5 rounded-2xl shadow-inner">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-surface-container-lowest shadow-sm'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-surface-container-lowest shadow-sm'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {/* Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isCurrent = plan.id === currentPlanId;
                  const isFeatured = plan.id === 'monthly';

                  if (isFeatured) {
                    return (
                      <div
                        key={plan.id}
                        className="relative p-8 rounded-[2rem] flex flex-col h-full bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl shadow-primary/20 md:scale-105 z-20"
                      >
                        <div className="absolute -top-4 right-8 bg-on-primary text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                          Most Popular
                        </div>
                        <div className="mb-6">
                          <h3 className="font-headline font-bold text-lg mb-1">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 text-white">
                            <span className="text-4xl font-extrabold font-headline">${plan.price}</span>
                            <span className="text-sm opacity-80">{plan.period}</span>
                          </div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm">
                              <span className="material-symbols-outlined text-white scale-75 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => selectPlan(plan.id)}
                          className="w-full py-4 rounded-full bg-white text-primary font-bold transition-all hover:shadow-lg active:scale-95"
                        >
                          {isCurrent ? 'Current Plan' : 'Select Plan'}
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={plan.id}
                      className="bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col h-full border border-white/40 shadow-xl shadow-primary/5"
                    >
                      <div className="mb-6">
                        <h3 className="font-headline font-bold text-lg mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold font-headline">${plan.price}</span>
                          <span className="text-sm opacity-60">{plan.period}</span>
                        </div>
                        {plan.savingsNote && (
                          <p className="text-[10px] font-bold text-primary mt-1">{plan.savingsNote}</p>
                        )}
                      </div>
                      <ul className="space-y-4 mb-10 flex-grow">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
                            <span className="material-symbols-outlined text-primary scale-75 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => selectPlan(plan.id)}
                        className={`w-full py-4 rounded-full font-bold transition-all active:scale-95 ${
                          isCurrent
                            ? 'bg-primary-container text-on-primary-container'
                            : plan.id === 'yearly'
                              ? 'bg-primary-container text-on-primary-container hover:brightness-110'
                              : 'bg-surface-container-highest text-primary hover:bg-primary-container hover:text-on-primary-container'
                        }`}
                      >
                        {isCurrent ? 'Current Plan' : 'Select Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Perks Highlight */}
              <div className="mt-12 pt-10 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">AI Health Coach</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">24/7 analysis of your metabolic and recovery data.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Unlimited Family</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Share the Sanctuary with everyone in your household.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">star_rate</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Priority Support</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Direct line to our concierge health team.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-error-container/10 border-2 border-dashed border-error/20 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-headline font-bold text-lg text-error">Danger Zone</h2>
              <p className="text-sm opacity-70">Deactivate your account and delete all health records permanently.</p>
            </div>
            <button className="px-6 py-3 bg-error text-on-error font-bold rounded-2xl hover:brightness-110 transition-all whitespace-nowrap">
              Deactivate
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
