import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  // 👇 YOUR WHATSAPP CONFIGURATION
  const phoneNumber = "94724105054"; // Canada code (94) + Number (without 0)
  const message = encodeURIComponent("Hello LexAI Admin, I have just completed my payment for the Lawyer Subscription. Please activate my account.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  useEffect(() => {
    // Auto-open WhatsApp after 2.5 seconds
    const timer = setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        
        {/* Success Icon Animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-10 h-10 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Received!</h1>
        <p className="text-slate-500 mb-8">
          Thank you for subscribing. To complete your activation, verify your details with us on WhatsApp.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-200"
          >
            <MessageCircle size={24} /> Chat on WhatsApp
          </a>
          
          <p className="text-xs text-slate-400">
            WhatsApp will open automatically in a few seconds...
          </p>

          <Link 
            to="/" 
            className="block w-full text-slate-500 font-bold py-2 hover:text-slate-800 flex items-center justify-center gap-2 mt-4"
          >
            <ArrowLeft size={16} /> Return Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;