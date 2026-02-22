import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, FileText, Upload, Trash2, 
  Users, Activity, Wifi, ShieldCheck, DollarSign, Loader2, LogOut
} from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";

const AdminDashboard = () => {
  const { user } = useUser(); 
  const { signOut } = useClerk();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 👇 FIX: Use timestamp to bypass browser cache
      const t = Date.now();
      
      const [statsRes, logsRes] = await Promise.allSettled([
        axios.get(`http://localhost:5000/api/admin/stats?t=${t}`),
        axios.get(`http://localhost:5000/api/admin/logs?t=${t}`)
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
      
      if (logsRes.status === 'fulfilled') {
        // Ensure we always have an array to prevent .map crashes
        setLogs(Array.isArray(logsRes.value.data) ? logsRes.value.data : []);
      } else {
        setLogs([]);
      }
      
    } catch (err) { 
        console.error("Dashboard Load Error", err); 
        setLogs([]);
    } finally {
        setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      await axios.post('http://localhost:5000/api/admin/upload', formData);
      alert("Document processed successfully.");
      setFile(null);
      fetchData(); 
    } catch (err) { 
      alert("Upload Failed. Check console."); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleDelete = async (fileName) => {
    if(!window.confirm(`Delete ${fileName}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/document/${fileName}`);
      fetchData(); // Refresh list after delete
    } catch (err) { 
      alert("Delete Failed"); 
    }
  };

  const handleOpenClerk = () => window.open("https://dashboard.clerk.com", "_blank");

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-8 pb-4">
             <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
               <ShieldCheck className="text-blue-600" size={28} /> 
               LexAI Admin
             </h1>
          </div>
          
          <div className="mx-6 mb-8 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
             <img 
               src={user?.imageUrl} 
               alt="Profile" 
               className="w-10 h-10 rounded-full border border-slate-200"
             />
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-slate-900 truncate">
                 {user?.fullName || user?.firstName || "Admin User"}
               </p>
               <p className="text-xs text-slate-500">Administrator</p>
             </div>
          </div>

          <nav className="px-4 space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20}/>} 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <SidebarItem 
              icon={<FileText size={20}/>} 
              label="Document Management" 
              active={activeTab === 'documents'} 
              onClick={() => setActiveTab('documents')} 
            />
            <div className="pt-8 px-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">External Tools</p>
              <button 
                onClick={handleOpenClerk}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                <Users size={18} /> Lawyer House (Clerk)
              </button>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {loading && (
            <div className="flex h-full items-center justify-center flex-col gap-4 text-gray-400">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading Dashboard Analytics...</p>
            </div>
        )}

        {/* VIEW: OVERVIEW */}
        {!loading && activeTab === 'overview' && stats && (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium text-gray-500">System Status</p>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                      {stats.systemHealth} 
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </h2>
                 </div>
                 <div className="p-4 bg-green-50 text-green-600 rounded-full"><Wifi size={24} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium text-gray-500">Knowledge Base</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                      {stats.documentCount} <span className="text-lg text-gray-400 font-normal">files</span>
                    </h2>
                 </div>
                 <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Activity size={24} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                      {stats.totalUsers || 0} <span className="text-lg text-gray-400 font-normal">active</span>
                    </h2>
                 </div>
                 <div className="p-4 bg-orange-50 text-orange-600 rounded-full"><Users size={24} /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Total Revenue</h3>
                    <p className="text-sm text-gray-500">Live payments from Stripe</p>
                  </div>
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg"><DollarSign size={20} /></div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                        formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                  <p className="text-sm text-gray-500">New Signups (Standard vs Lawyers)</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Bar dataKey="standard" name="Standard Users" fill="#0F172A" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="lawyers" name="Lawyers" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DOCUMENTS */}
        {!loading && activeTab === 'documents' && (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
                  <p className="text-sm text-gray-500">Manage AI Training Documents</p>
                </div>
                <div className="flex gap-2">
                   <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all">
                      <Upload size={16} /> {uploading ? "Processing..." : "Upload PDF"}
                      <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                   </label>
                   {file && <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Confirm Upload</button>}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Size</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* 👇 Updated mapping logic with safety checks for NaN/Invalid Date */}
                    {logs && logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18}/></div>
                            {log.fileName || "Unnamed File"}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {log.fileSize ? `${(log.fileSize / 1024).toFixed(0)} KB` : "0 KB"}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(log.fileName)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                           <div className="flex flex-col items-center gap-2">
                             <FileText size={40} className="opacity-20" />
                             <p>Database is empty. No documents found.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

export default AdminDashboard;