// src/features/landing/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-brand/90 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-icons">gavel</span>
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-white">LexGrid</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-white/90">
                    <a className="hover:text-primary transition-colors" href="#">Features</a>
                    <a className="hover:text-primary transition-colors" href="#">Jurisdictions</a>
                    <a className="hover:text-primary transition-colors" href="#">Pricing</a>
                    <a className="hover:text-primary transition-colors" href="#">About</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-5 py-2 text-sm font-bold text-white hover:text-primary transition-colors">Login</Link>
                    <Link to="/login" className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded font-bold text-sm transition-all shadow-xl shadow-primary/20">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};
