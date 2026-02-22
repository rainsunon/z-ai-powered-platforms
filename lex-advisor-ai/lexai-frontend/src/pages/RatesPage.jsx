import React from 'react';
import { CheckCircle } from 'lucide-react';

const RatesPage = ({ navigate }) => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900">Our Rates</h2>
          <p className="mt-4 text-xl text-gray-500">Flexible pricing for every need. 1 Month Free Trial on all paid plans.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all bg-gray-50">
            <h3 className="text-xl font-bold text-gray-500 mb-4">Basic</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">Free</div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 20 Messages / Day</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Basic Law Access</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Community Support</li>
            </ul>
            <button onClick={() => navigate('register')} className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-100">Sign Up Free</button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-blue-500 bg-white rounded-2xl p-8 flex flex-col hover:shadow-xl transition-all relative transform scale-105 shadow-lg">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">1 MONTH FREE TRIAL</div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">Professional</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">LKR 2,500<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Unlimited Queries</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Full Document Access</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Document Drafting</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Priority Support</li>
            </ul>
            <button onClick={() => navigate('register')} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md">Start Free Trial</button>
          </div>

          {/* Corporate Tier */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-lg transition-all bg-gray-50">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Corporate</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-500" /> Multi-User Access</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-500" /> API Integration</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-500" /> Dedicated Account Manager</li>
            </ul>
            <button onClick={() => navigate('contact')} className="w-full py-3 rounded-xl border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-50">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatesPage;