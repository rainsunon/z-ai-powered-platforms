import { Plan } from '../types';

export const PLANS: Plan[] = [
    {
        id: 'basic',
        name: 'Basic',
        monthlyPrice: 89,
        yearlyPrice: 71,
        desc: 'For solo practitioners starting with AI.',
        features: ['AI Legal Research (Canada)', '50 Case Analysis/mo', 'Standard Drafting'],
        current: true
    },
    {
        id: 'professional',
        name: 'Professional',
        monthlyPrice: 199,
        yearlyPrice: 159,
        desc: 'Complete cross-border legal automation.',
        features: ['USA & Canada Full Access', 'Unlimited Analysis', 'Advanced AI Briefing', 'Priority Support', 'Up to 3 Team Members'],
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        desc: 'Bespoke solutions for large firms.',
        features: ['Custom API Integrations', 'Single Sign-On (SSO)', 'On-premise Deployment', 'Dedicated Compliance Officer']
    }
];
