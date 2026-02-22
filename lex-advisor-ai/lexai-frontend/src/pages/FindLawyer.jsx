import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const FindLawyer = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [location, setLocation] = useState('All Locations');
  const [specialization, setSpecialization] = useState('All Specializations');

  // 1. Fetch Lawyers when filters change
  useEffect(() => {
    fetchLawyers();
  }, [location, specialization]);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      // Build URL params
      const params = new URLSearchParams();
      if (location !== 'All Locations') params.append('location', location);
      if (specialization !== 'All Specializations') params.append('specialization', specialization);

      const res = await fetch(`http://localhost:5000/api/lawyers?${params.toString()}`);
      const data = await res.json();
      setLawyers(data);
    } catch (err) {
      console.error("Error fetching lawyers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find the Best Legal Help</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse our verified network of top-tier lawyers in Canada.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            
            {/* Location Dropdown */}
            <div className="relative w-full md:w-1/3">
              <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option>All Locations</option>
                <option>Colombo</option>
                <option>Kandy</option>
                <option>Galle</option>
                <option>Gampaha</option>
                <option>Jaffna</option>
              </select>
            </div>

            {/* Specialization Dropdown */}
            <div className="relative w-full md:w-1/3">
              <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option>All Specializations</option>
                <option>Labor Law</option>
                <option>Criminal Law</option>
                <option>Family Law</option>
                <option>Property Law</option>
                <option>Corporate Law</option>
              </select>
            </div>

            {/* Search Button (Visual Only since useEffect handles it) */}
            <button className="w-full md:w-1/3 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Filter size={18} /> Filter Results
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading Lawyers...</div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Lawyers Found</h3>
            <p className="text-slate-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <motion.div 
                key={lawyer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 overflow-hidden group"
              >
                {/* Lawyer Card Header */}
                <div className="p-6 pb-0 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                     <img 
                       src={lawyer.profileImage || "https://via.placeholder.com/150"} 
                       alt={lawyer.name}
                       className="w-full h-full object-cover"
                     />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{lawyer.name}</h3>
                    <p className="text-blue-600 text-sm font-medium mt-1">{lawyer.specialization}</p>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <span className="text-slate-400 ml-1">({lawyer.experience} Years Exp)</span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                <div className="p-6 pt-4">
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {lawyer.bio || "No biography available."}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                    <MapPin size={14} /> {lawyer.location}
                    <span className="mx-1">•</span>
                    <span>Speaks: {lawyer.languages ? lawyer.languages.join(", ") : "English"}</span>
                  </div>

                  <a 
                    href={`https://wa.me/${lawyer.phone}`} 
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl font-bold hover:bg-blue-600 transition-colors"
                  >
                    Contact Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FindLawyer;