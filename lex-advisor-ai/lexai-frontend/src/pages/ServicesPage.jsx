import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, MessageSquare, Shield, Users, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // 👈 Import Link

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState('citizens');
  const [showLawyerPrompt, setShowLawyerPrompt] = useState(true); // Control floating prompt

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          Legal Solutions for <span className="text-blue-500">Everyone.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Whether you need instant answers or professional representation, LexAI bridges the gap between you and the law.
        </p>

        {/* TOGGLE SWITCH */}
        <div className="inline-flex bg-slate-800 p-1 rounded-full relative z-10">
          <button 
            onClick={() => setActiveTab('citizens')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'citizens' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            For Citizens
          </button>
          <button 
            onClick={() => setActiveTab('lawyers')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'lawyers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            For Lawyers
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* CITIZEN VIEW */}
        {activeTab === 'citizens' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Free Plan */}
            <div className="border border-slate-200 rounded-3xl p-10 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Basic Access</h3>
              <p className="text-slate-500 mb-8">For simple legal questions.</p>
              <h4 className="text-5xl font-extrabold mb-8">Free</h4>
              
              <Link to="/chat">
                <button className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-colors mb-8">
                  Start Chatting
                </button>
              </Link>
              
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-center gap-3"><span className="text-green-500">✔</span> 5 AI Queries per day</li>
                <li className="flex items-center gap-3"><span className="text-green-500">✔</span> Basic Law Summaries</li>
                <li className="flex items-center gap-3 text-slate-400"><span className="text-slate-300">✖</span> No Document Review</li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-blue-600 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Premium 👑</h3>
              <p className="text-slate-500 mb-8">Full legal protection.</p>
              <div className="flex items-end gap-1 mb-8">
                 <h4 className="text-5xl font-extrabold">LKR 1,500</h4>
                 <span className="text-slate-500 mb-1">/month</span>
              </div>

              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors mb-8 shadow-lg shadow-blue-200">
                Get Premium Access
              </button>
              
              <ul className="space-y-4 text-slate-700 font-medium">
                <li className="flex items-center gap-3"><span className="text-blue-600">✔</span> Unlimited AI Queries</li>
                <li className="flex items-center gap-3"><span className="text-blue-600">✔</span> Upload & Review Documents</li>
                <li className="flex items-center gap-3"><span className="text-blue-600">✔</span> Generate Warning Letters</li>
                <li className="flex items-center gap-3"><span className="text-blue-600">✔</span> Priority Lawyer Matching</li>
              </ul>
            </div>
          </motion.div>
        ) : (
          /* LAWYER VIEW */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-blue-600" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">Grow Your Practice</h3>
              <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
                Join LexAI as a verified partner. We send you high-quality leads that match your specialization.
              </p>

              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="text-left">
                  <div className="text-3xl font-bold text-slate-900">Verified Partner</div>
                  <div className="text-slate-500">Get high-quality client leads daily.</div>
                </div>
                <div className="h-12 w-px bg-slate-300 mx-4"></div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-slate-900">LKR 5,000</div>
                  <div className="text-slate-500">/month</div>
                </div>
              </div>

              {/* ✅ FIXED: Button now goes to /join-lawyer */}
              <Link to="/join-lawyer">
                <button className="px-10 py-4 bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200 hover:-translate-y-1">
                  Register Now
                </button>
              </Link>

            </div>
          </motion.div>
        )}
      </div>

      {/* ✅ FLOATING PROMPT (Bottom Left) */}
      {showLawyerPrompt && (
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 relative">
            <button 
              onClick={() => setShowLawyerPrompt(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="bg-slate-900 p-3 rounded-xl text-white">
                <Scale size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Are you a Lawyer?</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  Join LexAI Pro to get verified leads and manage your clients.
                </p>
                <Link to="/join-lawyer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Register Here <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default ServicesPage;