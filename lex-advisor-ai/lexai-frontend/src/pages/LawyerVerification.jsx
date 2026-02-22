import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone } from 'lucide-react';

const LawyerVerification = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-10 text-center border border-slate-100"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Welcome to LexAI Pro. To activate your account and get your <span className="font-bold text-slate-900">Verified Badge</span>, we need to verify your Lawyer ID manually.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2">Next Step:</h3>
          <p className="text-sm text-slate-500 mb-4">
            Please send a photo of your **Bar Association ID** to our WhatsApp support team.
          </p>
          
          <a 
            href="https://wa.me/94771234567?text=Hi%20LexAI,%20I%20just%20paid%20for%20Pro.%20Here%20is%20my%20ID%20for%20verification." 
            target="_blank" 
            rel="noreferrer"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Phone size={18} /> Chat on WhatsApp
          </a>
        </div>

        <button 
            onClick={() => window.location.href = '/lawyer-dashboard'}
            className="text-slate-400 hover:text-slate-600 font-medium text-sm"
        >
            Skip to Dashboard (Unverified Mode)
        </button>
      </motion.div>
    </div>
  );
};

export default LawyerVerification;