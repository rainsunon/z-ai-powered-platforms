import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 text-center">
        
        {/* ANIMATED ICON */}
        <div className="bg-red-50 p-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white p-4 rounded-full shadow-sm">
              <ShieldAlert size={64} className="text-red-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-100 p-2 rounded-full border border-white">
               <AlertTriangle size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-500 mb-6">
            You do not have the required permissions (Admin) to view this page. This attempt has been logged.
          </p>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <ArrowLeft size={20} /> Return Home
          </button>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs text-gray-400">
          Error Code: 403_FORBIDDEN
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;