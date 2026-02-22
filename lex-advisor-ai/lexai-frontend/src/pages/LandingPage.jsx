import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  DollarSign, 
  Baby, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

// 🌈 COLORFUL LABOR LAW TOPICS FOR SCROLL
const SCROLL_TOPICS = [
  { name: "Unfair Dismissal", icon: <AlertTriangle className="w-6 h-6 text-red-600" /> },
  { name: "EPF & ETF Funds", icon: <DollarSign className="w-6 h-6 text-green-600" /> },
  { name: "Maternity Benefits", icon: <Baby className="w-6 h-6 text-pink-600" /> },
  { name: "Workplace Safety", icon: <ShieldCheck className="w-6 h-6 text-blue-600" /> },
  { name: "Gratuity Payments", icon: <DollarSign className="w-6 h-6 text-amber-600" /> },
  { name: "Employment Contracts", icon: <FileText className="w-6 h-6 text-indigo-600" /> },
  { name: "Overtime Rules", icon: <Clock className="w-6 h-6 text-purple-600" /> },
  // Duplicate for seamless scroll
  { name: "Unfair Dismissal", icon: <AlertTriangle className="w-6 h-6 text-red-600" /> },
  { name: "EPF & ETF Funds", icon: <DollarSign className="w-6 h-6 text-green-600" /> },
  { name: "Maternity Benefits", icon: <Baby className="w-6 h-6 text-pink-600" /> },
  { name: "Workplace Safety", icon: <ShieldCheck className="w-6 h-6 text-blue-600" /> },
  { name: "Gratuity Payments", icon: <DollarSign className="w-6 h-6 text-amber-600" /> },
  { name: "Employment Contracts", icon: <FileText className="w-6 h-6 text-indigo-600" /> },
  { name: "Overtime Rules", icon: <Clock className="w-6 h-6 text-purple-600" /> },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      
      {/* =========================================
          1. HERO SECTION (Vibrant & Animated)
      ========================================= */}
      <div className="relative pt-24 pb-12 lg:pt-32">
        
        {/* Background Blur Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* "New Updates" Pill Button */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md text-blue-700 hover:text-blue-800 hover:shadow-lg transition border border-blue-100 group">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-bold tracking-wide">NEW: Labour Tribunal Updates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-7xl mb-6 leading-tight"
          >
            Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Rights</span> <br />
            at the Workplace.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 font-medium"
          >
            Fired without reason? ETF not paid? <br/>
            Our AI specializes in the <strong>Canadan Industrial Disputes Act</strong>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link to="/chat" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
              <Zap className="w-5 h-5 fill-current" /> Ask AI Lawyer
            </Link>
          </motion.div>
        </div>
      </div>

      {/* =========================================
          2. SCROLL SECTION (Yellow Highlight)
      ========================================= */}
      <div className="py-16 bg-white/60 backdrop-blur-md border-y border-slate-200">
        
        {/* Yellow Highlight Text */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 inline-block relative z-10">
            Expert in all <span className="relative inline-block px-2">
              {/* The Yellow Marker Div */}
              <div className="absolute inset-0 bg-yellow-300 -rotate-2 transform -skew-x-3 rounded-sm -z-10"></div>
              <span className="relative text-slate-900">Labor Law</span>
            </span> Categories
          </h2>
        </div>
        
        {/* Scrolling Icons */}
        <div className="relative flex overflow-x-hidden group">
          <motion.div 
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: [0, -1000] }} 
            transition={{ 
              repeat: Infinity, 
              duration: 25, 
              ease: "linear" 
            }}
          >
            {SCROLL_TOPICS.map((topic, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-800 font-bold text-xl hover:scale-110 transition-transform cursor-pointer">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  {topic.icon}
                </div>
                {topic.name}
              </div>
            ))}
          </motion.div>
          
          {/* Gradient Edges */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>

      {/* =========================================
          3. FEATURE CARDS (Creative Layout)
      ========================================= */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Why Canada Trusts LexAI</h2>
            <p className="mt-4 text-lg text-slate-600">Real legal solutions for real workplace problems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Card 1: Industrial Disputes */}
            <motion.div 
              whileHover={{ y: -10 }} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
            >
              {/* Image Area */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" 
                  alt="Law Books" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Core Law
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Industrial Disputes Act
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  Don't get confused by US laws on Google. We are trained specifically on Canadan Labor Tribunal circulars, covering everything from termination to gratuity.
                </p>
                
                {/* Footer Area */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span>Jan 21, 2026</span> • <span>5 min read</span>
                  </div>
                  <Link to="/chat" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:translate-x-1 transition-transform">
                    Read Law <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Privacy */}
            <motion.div 
              whileHover={{ y: -10 }} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800" 
                  alt="Security" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Security
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  100% Employee Privacy
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  Afraid to ask about your boss? Your chat history is encrypted locally. We ensure your employer never knows you are checking your rights.
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span>Encrypted</span> • <span>Private</span>
                  </div>
                  <Link to="/about" className="flex items-center gap-1 text-purple-600 font-semibold text-sm hover:translate-x-1 transition-transform">
                    Learn How <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Lawyer Network */}
            <motion.div 
              whileHover={{ y: -10 }} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" 
                  alt="Handshake" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Community
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  Verified Lawyer Network
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  AI is great, but court requires a human. We instantly connect you with verified Labor Tribunal lawyers in your district when you need to file a case.
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span>50+ Lawyers</span> • <span>Active</span>
                  </div>
                  <Link to="/chat" className="flex items-center gap-1 text-amber-600 font-semibold text-sm hover:translate-x-1 transition-transform">
                    Find Lawyer <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;