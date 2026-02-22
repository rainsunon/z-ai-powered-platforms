import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Scale, MessageSquare, Globe, FileText, ShieldAlert, BadgeCheck, Brain, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* =========================================
          AI-Driven Document Analysis & Advanced Search
          ========================================= */}
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">AI-Driven Document Analysis</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Advanced document analysis powered by Google Gemini AI models with comprehensive legal insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Feature 1: Document Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-12 h-12 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Document Analysis</h3>
              </div>
              <div>
                <p className="text-slate-600">Extract key legal information from PDF documents</p>
                <ul className="list-disc list-inside text-left space-y-2 text-sm text-slate-500">
                  <li>Document type classification</li>
                  <li>Legal entities extraction (dates, amounts, parties, locations)</li>
                  <li>Risk identification and recommendations</li>
                  <li>Confidence scoring</li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Advanced Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Advanced Search</h3>
              </div>
              <div>
                <p className="text-slate-600">Powerful search capabilities via ElasticSearch</p>
                <ul className="list-disc list-inside text-left space-y-2 text-sm text-slate-500">
                  <li>Text search with filters</li>
                  <li>Semantic search using vector embeddings</li>
                  <li>Hybrid search combining both</li>
                  <li>Faceted search by type, legal area, jurisdiction</li>
                  <li>Real-time aggregations</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Document Q&A */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Document Q&A</h3>
              </div>
              <div>
                <p className="text-slate-600">Ask natural language questions about your documents</p>
                <ul className="list-disc list-inside text-left space-y-2 text-sm text-slate-500">
                  <li>Context-aware answers</li>
                  <li>Confidence scoring</li>
                  <li>Source citations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* =========================================
          1. HERO SECTION (Fixed Text & Added Boxes)
      ========================================= */}
      <div className="relative pt-36 pb-20 lg:pt-52 lg:pb-40 overflow-visible">
        
        {/* Soft Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-50/50 to-white -z-20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-[600px] bg-purple-50/50 blur-3xl -z-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Main Headline - Fixed Z-Index so text sits ON TOP of yellow */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight drop-shadow-sm"
          >
            The Future is <br className="hidden md:block" />
            <span className="relative inline-block px-4 ml-2 mt-2">
              {/* Yellow Marker - Set to z-0 so it is BEHIND text */}
              <div className="absolute inset-0 bg-yellow-300 -rotate-2 transform skew-x-[-10deg] rounded-md -z-10 h-full w-full opacity-100 shadow-sm"></div>
              {/* Text - Set to relative z-10 so it is ON TOP */}
              <span className="relative z-10 text-slate-900">LexAI</span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto text-xl text-slate-600 font-medium"
          >
            Canada's First AI Lawyer. <br/>
            Trained on the <strong>Industrial Disputes Act</strong> & <strong>Penal Code</strong>.
          </motion.p>

          {/* === FLOATING UI BOXES (Added More & Fixed Text Colors) === */}

          {/* Box 1 (Top Left): User Query */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="hidden lg:block absolute top-10 left-10 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs transform -rotate-3 z-0"
          >
            <div className="flex items-center gap-3 mb-3 border-b border-slate-50 pb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><MessageSquare size={16} /></div>
              <p className="font-bold text-slate-900 text-sm">User Question</p>
            </div>
            <p className="text-xs text-slate-600 font-medium italic">"My boss fired me without a warning letter. Is this legal?"</p>
            <div className="mt-3 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
               <ShieldAlert size={14} className="text-red-600" />
               <p className="text-[10px] text-red-700 font-bold">Unfair Termination Detected</p>
            </div>
          </motion.div>

          {/* Box 2 (Top Right): Accuracy */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="hidden lg:block absolute top-20 right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] transform rotate-6 z-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><BadgeCheck size={20} /></div>
              <div>
                <p className="font-bold text-slate-900 text-lg">98.5%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Accuracy Score</p>
              </div>
            </div>
          </motion.div>

          {/* Box 3 (Bottom Left): Lawyer Connect */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="hidden lg:block absolute bottom-0 left-24 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 transform rotate-2"
          >
             <div className="flex -space-x-3">
                 <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Lawyer" className="w-10 h-10 rounded-full border-2 border-white" />
                 <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Lawyer" className="w-10 h-10 rounded-full border-2 border-white" />
                 <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Lawyer" className="w-10 h-10 rounded-full border-2 border-white" />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-900">Verified Lawyers</p>
               <p className="text-xs text-green-600 font-bold">● Available Now</p>
             </div>
          </motion.div>

          {/* Box 4 (Bottom Right): Document Scan */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:block absolute bottom-10 right-32 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 transform -rotate-1"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><FileText size={20} /></div>
            <div>
               <p className="text-sm font-bold text-slate-900">Document Scan</p>
               <p className="text-[10px] text-slate-500 font-bold">Analysing Contracts...</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* =========================================
          2. COMPARISON TABLE (Fixed Blue Box Issue)
      ========================================= */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Choose LexAI?</h2>
            <p className="text-slate-500 mt-2">See how we stack up against the competition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            
            {/* Column 1: Generic AI */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-start pt-12">
              <h3 className="text-lg font-bold text-slate-600 mb-6">Generic AI (ChatGPT)</h3>
              <ul className="space-y-6 w-full">
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Trained on US/UK Law (Confusing)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span>Invents fake cases (Hallucinations)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <Check className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Instant Answers</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span>No Lawyer Verification</span>
                </li>
              </ul>
            </div>

            {/* Column 2: LexAI (Highlighted Center) */}
            <div className="relative p-8 bg-blue-50/30 flex flex-col items-center border-b md:border-b-0 md:border-r border-blue-100 pt-12">
              
              {/* FIX: Badge is now INSIDE the flow, like a button. Not absolute -top-5 */}
              <div className="mb-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-200">
                Your AI Lawyer
              </div>

              <h3 className="text-2xl font-extrabold text-blue-700 mb-8">LexAI</h3>
              
              <ul className="space-y-6 w-full">
                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Trained ONLY on Canadan Acts</span>
                </li>
                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Zero Hallucinations (RAG Engine)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Instant Answers (Sinhala/English)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Direct Connect to Verified Lawyers</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Traditional Lawyer */}
            <div className="p-8 flex flex-col items-center justify-start pt-12">
              <h3 className="text-lg font-bold text-slate-600 mb-6">Human Lawyer</h3>
              <ul className="space-y-6 w-full">
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Expert Local Knowledge</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Can Represent in Court</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span>Slow (Appointments needed)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-500 text-sm">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span>Expensive Consultation Fees</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================
          3. NEWS & INSIGHTS (Netflix Style)
      ========================================= */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Legal Insights</h2>
              <p className="text-slate-500 mt-2">Stay updated with the latest in Canadan Law.</p>
            </div>
            <Link to="/news" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" 
                  alt="Workplace" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Labor Law</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                  Can you be fired without a warning letter in 2026?
                </h3>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  Understanding the new amendments to the Industrial Disputes Act regarding termination procedure.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>5 min read</span> • <span>Jan 12, 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" 
                  alt="Finance" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">EPF & ETF</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                  How to calculate your Gratuity correctly.
                </h3>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  Many employees lose money by miscalculating. Here is the formula used by the Labor Department.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>3 min read</span> • <span>Jan 10, 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=800" 
                  alt="Court" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Tech & Law</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                  AI Evidence: Is it admissible in Canadan Courts?
                </h3>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  A look at the Evidence (Special Provisions) Act and how it treats digital records.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>8 min read</span> • <span>Jan 05, 2026</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;