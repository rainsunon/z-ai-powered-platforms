import React from 'react';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PlanCard } from './PlanCard';

const perks = [
  { icon: 'psychology', title: 'AI Health Coach', desc: '24/7 analysis of your metabolic and recovery data.' },
  { icon: 'groups', title: 'Unlimited Family', desc: 'Share the Sanctuary with everyone in your household.' },
  { icon: 'star_rate', title: 'Priority Support', desc: 'Direct line to our concierge health team.' },
];

export function PremiumPlansSection() {
  const { plans, currentPlanId, billingCycle, setBillingCycle, selectPlan } =
    useSubscriptionStore();

  return (
    <Card className="rounded-[3rem] bg-surface-container border-none relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <CardContent className="p-6 sm:p-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge className="bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Luminous Premium
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight mb-2">
              Elevate Your Vitality
            </h2>
            <p className="text-on-surface-variant max-w-md">
              Choose the rhythm that suits your lifestyle. Unlock advanced medical AI and personalized guidance.
            </p>
          </div>
          <Tabs
            value={billingCycle}
            onValueChange={(v) => setBillingCycle(v as 'monthly' | 'yearly')}
          >
            <TabsList className="bg-surface-container-high p-1.5 rounded-2xl shadow-inner h-auto gap-0">
              <TabsTrigger
                value="monthly"
                className="px-6 py-2 rounded-xl text-sm font-bold data-active:bg-surface-container-lowest data-active:shadow-sm"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="px-6 py-2 rounded-xl text-sm font-bold data-active:bg-surface-container-lowest data-active:shadow-sm"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
              isFeatured={plan.id === 'monthly'}
              onSelect={() => selectPlan(plan.id)}
            />
          ))}
        </div>

        {/* Perks Highlight */}
        <Separator className="mt-12 bg-outline-variant/20" />
        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 shrink-0 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
