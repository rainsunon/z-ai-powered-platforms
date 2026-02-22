// src/features/landing/components/CapabilityCards.tsx
import React from 'react';

export const CapabilityCards: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Our Core Capabilities</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">A suite of high-performance tools designed to streamline every aspect of your legal workflow.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'AI Legal Chat', icon: 'chat_bubble', desc: 'Get instant answers to complex jurisdictional legal queries with citations from verified North American statutes and case law.' },
                        { title: 'Case Analysis', icon: 'analytics', desc: 'Upload documents for automated risk assessment, timeline extraction, and precedent mapping across CA/USA databases.' },
                        { title: 'Expert Consult', icon: 'person_search', desc: 'Seamlessly transition from AI insights to human expertise with our vetted network of board-certified attorneys.' }
                    ].map((card, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/40 transition-all hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-icons text-3xl">{card.icon}</span>
                            </div>
                            <h3 className="text-xl font-black mb-4 text-slate-900 uppercase tracking-tighter">{card.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">{card.desc}</p>
                            <div className="space-y-3 mb-10">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><span className="material-icons text-primary text-sm">check_circle</span> Verified Precedents</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><span className="material-icons text-primary text-sm">check_circle</span> Multi-Jurisdiction Support</div>
                            </div>
                            <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                Explore Feature <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
