import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Phone, Save, CheckCircle, Briefcase, Clock, 
  Globe, FileText, Loader, Lock, ShieldCheck, ChevronRight, AlertTriangle 
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const LawyerDashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "Labor Law",
    experience: 1,
    location: "Colombo",
    languages: "English, Sinhala",
    bio: "",
  });

  // 🔒 1. SECURITY CHECK & DATA FETCH
  useEffect(() => {
    if (isLoaded && user) {
      checkAccessAndFetch();
    }
  }, [isLoaded, user]);

  const checkAccessAndFetch = async () => {
    // Check Clerk Metadata
    const userRole = user.publicMetadata?.role;

    if (userRole !== 'lawyer') {
      setLoading(false);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      
      // Fetch existing data from MongoDB
      try {
        const response = await fetch(`http://localhost:5000/api/lawyers/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || user.fullName,
            phone: data.phone || "",
            specialization: data.specialization || "Labor Law",
            experience: data.experience || 1,
            location: data.location || "Colombo",
            languages: data.languages ? data.languages.join(", ") : "English, Sinhala",
            bio: data.bio || ""
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 💾 2. SAVE HANDLER
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaved(false);
    
    // Convert languages string to array
    const langArray = formData.languages.split(',').map(item => item.trim());

    try {
      const response = await fetch('http://localhost:5000/api/lawyers', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          profileImage: user.imageUrl, // Send Clerk Image
          ...formData,
          languages: langArray
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert("Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  // 🛑 ACCESS DENIED / VERIFICATION PENDING UI (BEAUTIFUL DESIGN)
  if (!loading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header Banner */}
          <div className="bg-amber-50 p-8 flex flex-col items-center justify-center border-b border-amber-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50 blur-2xl"></div>
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative z-10 bg-white p-4 rounded-full shadow-lg mb-4"
            >
              <Lock className="text-amber-500 w-10 h-10" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-slate-800 relative z-10">Verification Pending</h2>
            <p className="text-amber-700 font-medium text-sm mt-1 relative z-10">Access Restricted</p>
          </div>

          {/* Content Body */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                   <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Identity Verification</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    To maintain the integrity of LexAI, we manually verify all lawyer accounts before granting dashboard access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                   <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Estimated Time</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verification usually takes 1-2 business days. You will be notified via email once approved.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={() => navigate('/')} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-300"
              >
                Return to Home Page <ChevronRight size={16} />
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                Need urgent help? <a href="/contact" className="text-blue-500 hover:underline">Contact Support</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600"/></div>;

  // ✅ MAIN DASHBOARD UI (UNCHANGED)
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lawyer Profile Management</h1>
            <p className="text-slate-500 mt-1">This data will be used by our AI to recommend you to clients.</p>
          </div>
          {isSaved && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold flex items-center gap-2">
              <CheckCircle size={18} /> Profile Updated Successfully!
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Preview Card (What Users See) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-4">Live Preview</h3>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 h-24 relative">
                  <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                    <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <h3 className="text-xl font-bold text-slate-900">{formData.name}</h3>
                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mt-1">
                    <Briefcase size={14} /> {formData.specialization}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                    <MapPin size={12} /> {formData.location} • {formData.experience} Years Exp.
                  </div>
                  <p className="text-sm text-slate-600 mt-4 line-clamp-4 italic border-l-2 border-slate-200 pl-3">
                    "{formData.bio || 'Your biography will appear here...'}"
                  </p>
                  <button className="w-full mt-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Contact Lawyer</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Specialization</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                      <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white">
                        <option>Labor Law</option>
                        <option>Criminal Law</option>
                        <option>Family Law</option>
                        <option>Corporate Law</option>
                        <option>Property Law</option>
                        <option>Intellectual Property</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Experience (Years)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Location & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Base Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                      <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white">
                        <option>Colombo</option>
                        <option>Gampaha</option>
                        <option>Kandy</option>
                        <option>Galle</option>
                        <option>Matara</option>
                        <option>Jaffna</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Languages (Comma separated)</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input type="text" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" placeholder="English, Sinhala, Tamil" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Bio (CRITICAL FOR AI) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Biography / Expertise</span>
                    <span className="text-blue-500 text-xs font-normal">AI scans this to find you</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                    <textarea 
                      rows="6" 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})} 
                      className="w-full pl-10 p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 leading-relaxed" 
                      placeholder="I have 10 years of experience handling unfair dismissal cases in Colombo. I specialize in helping employees who were fired without notice..."
                    ></textarea>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">The more detailed, the better the AI match.</p>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2">
                    <Save size={20} /> Save Profile & Sync with AI
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;