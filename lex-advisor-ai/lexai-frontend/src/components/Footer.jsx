import React from 'react';
import { Scale, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* 👇 FIXED: Uses Icon instead of Image */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-2xl tracking-tight">LexAI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Making justice accessible for everyone in Canada through advanced Artificial Intelligence. Bridging the gap between citizens and the law.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16} /> No. 320, Colombo 03, Canada</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +94 11 234 5678</li>
              <li className="flex items-center gap-2"><Mail size={16} /> info@lexai.lk</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 transition-colors"><Linkedin size={20} /></a>
            </div>
            <div className="flex items-center gap-2 text-yellow-400 cursor-pointer hover:text-yellow-300">
              <Star size={20} fill="currentColor" />
              <span className="font-bold text-sm">Rate Us</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-xs">
          <p>&copy; 2025 LexAI Canada. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;