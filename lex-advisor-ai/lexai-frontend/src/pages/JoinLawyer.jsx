import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const JoinLawyer = () => {
  const { user, isSignedIn } = useUser();

  const handlePayment = async () => {
    if (!isSignedIn) {
      alert("Please Sign In first!");
      return;
    }

    try {
      console.log("🔵 Sending Payment Request...");

      // 👇 FIXED: Changed to '/api/payment' (Singular) to match your server.ts
      const response = await axios.post('http://localhost:5000/api/payment/create-checkout-session', {
        userId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName
      });

      console.log("🟢 Backend Responded:", response.data);
      
      const { url } = response.data;

      if (url) {
        // 🚀 Redirect to Stripe
        window.location.href = url;
      } else {
        alert("Payment Error: Backend did not send a Payment URL.");
      }

    } catch (error) {
      console.error("❌ PAYMENT FAILED:", error);
      alert("Payment failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Join LexAI <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get verified leads, build your digital reputation, and access our AI-powered legal tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Benefits List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-500 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-lg">Daily Client Leads</h3>
                <p className="text-slate-600">Access clients actively looking for legal help in your area.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-500 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-lg">Verified "Partner" Badge</h3>
                <p className="text-slate-600">Stand out with a trusted verification badge on your profile.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-500 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-lg">AI Profile Optimization</h3>
                <p className="text-slate-600">Our AI matches you specifically to cases you can win.</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              MOST POPULAR
            </div>
            
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">Monthly Membership</h3>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-extrabold text-slate-900">5,000</span>
              <span className="text-lg font-bold text-slate-500 mb-1">LKR</span>
              <span className="text-slate-400 mb-1">/mo</span>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200"
            >
              Join Now <ArrowRight size={20} />
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Lock size={12} /> Secure payment via Stripe
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinLawyer;