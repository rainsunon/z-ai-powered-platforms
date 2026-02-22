import React, { useState } from "react";
import { Scale, Menu, X, ShieldCheck, Briefcase, Search, Brain } from "lucide-react";
import { Link } from "react-router-dom";

// 👇 Import logo
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* 👇 FIXED: Uses your logo.png file path */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LexAI Logo" className="h-10 w-auto" />
            <span className="font-bold text-2xl text-blue-600 tracking-tight">
              LexAI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
            
            <Link to="/find-lawyer" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
               Find Lawyers
            </Link>

            <Link to="/services" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/news" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">Blogs</Link>
            <Link to="/contact" className="px-4 py-2 font-bold text-gray-600 hover:text-blue-600 transition-colors">Contact Us</Link>

            <Link to="/documents" className="px-4 py-2 font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1">
                  <Brain size={18} /> Document AI
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-full text-sm shadow-md transition-all hover:scale-105">
              Join Us
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-600 hover:text-blue-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-2 border-t shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 font-bold hover:text-blue-600">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 font-bold hover:text-blue-600">About Us</Link>
          <Link to="/find-lawyer" onClick={() => setIsOpen(false)} className="block py-2 text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2"><Search size={18} /> Find Lawyers</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 font-bold hover:text-blue-600">Services</Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 font-bold hover:text-blue-600">News</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 font-bold hover:text-blue-600">Contact Us</Link>
          <Link to="/documents" onClick={() => setIsOpen(false)} className="block py-2 text-purple-600 font-bold hover:text-purple-800 flex items-center gap-2"><Brain size={18} /> Document AI</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
