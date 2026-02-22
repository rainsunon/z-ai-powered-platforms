// src/features/landing/pages/LandingPage.tsx
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CapabilityCards } from '../components/CapabilityCards';
import { Footer } from '../components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-brand min-h-screen font-sans text-slate-900 overflow-x-hidden">
            <Navbar />
            <Hero />
            <CapabilityCards />
            <Footer />
        </div>
    );
};

export default LandingPage;
