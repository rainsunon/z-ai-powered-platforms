import React from 'react';
import { type Plan } from '@/store/useSubscriptionStore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanCardProps {
  plan: Plan;
  isCurrent: boolean;
  isFeatured: boolean;
  onSelect: () => void;
}

function FeatureList({ features, iconClass }: { features: string[]; iconClass: string }) {
  return (
    <ul className="space-y-4 flex-grow">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm">
          <span
            className={`material-symbols-outlined scale-75 mt-0.5 ${iconClass}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function PlanCard({ plan, isCurrent, isFeatured, onSelect }: PlanCardProps) {
  if (isFeatured) {
    return (
      <Card className="relative flex flex-col h-full bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl shadow-primary/20 md:scale-105 z-20 rounded-[2rem] border-none">
        <Badge className="absolute -top-4 right-8 bg-on-primary text-primary text-[10px] font-black uppercase tracking-tighter shadow-lg rounded-full">
          Most Popular
        </Badge>
        <CardContent className="p-8 pb-0 flex-grow flex flex-col">
          <div className="mb-6">
            <h3 className="font-headline font-bold text-lg mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-4xl font-extrabold font-headline">${plan.price}</span>
              <span className="text-sm opacity-80">{plan.period}</span>
            </div>
          </div>
          <FeatureList features={plan.features} iconClass="text-white" />
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-6">
          <Button
            onClick={onSelect}
            className="w-full py-4 rounded-full bg-white text-primary font-bold hover:shadow-lg active:scale-95 h-auto"
          >
            {isCurrent ? 'Current Plan' : 'Select Plan'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-container-lowest/70 backdrop-blur-xl flex flex-col h-full border-white/40 shadow-xl shadow-primary/5 rounded-[2rem]">
      <CardContent className="p-8 pb-0 flex-grow flex flex-col">
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
        <FeatureList features={plan.features} iconClass="text-primary" />
      </CardContent>
      <CardFooter className="px-8 pb-8 pt-6">
        <Button
          onClick={onSelect}
          variant="secondary"
          className={`w-full py-4 rounded-full font-bold active:scale-95 h-auto ${
            isCurrent
              ? 'bg-primary-container text-on-primary-container'
              : plan.id === 'yearly'
                ? 'bg-primary-container text-on-primary-container hover:brightness-110'
                : 'bg-surface-container-highest text-primary hover:bg-primary-container hover:text-on-primary-container'
          }`}
        >
          {isCurrent ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
