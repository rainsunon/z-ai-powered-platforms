import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Code, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Ensure these images exist in your assets folder
import member1Img from '../assets/team/member1.png'; 
import member2Img from '../assets/team/member2.png';
import member3Img from '../assets/team/member3.png';
import member4Img from '../assets/team/member4.png';

const TEAM_MEMBERS = [
  { id: 1, name: "Nageime", role: "Fullstack Dev", img: member1Img, style: "top-0 left-10 z-20 -rotate-3" },
  { id: 2, name: "Chamathka", role: "AI Engineer", img: member2Img, style: "top-12 right-12 z-10 rotate-6" },
  { id: 3, name: "Basura", role: "Frontend", img: member3Img, style: "bottom-12 left-20 z-30 rotate-3" },
  { id: 4, name: "Matheesha", role: "Backend", img: member4Img, style: "bottom-0 right-20 z-20 -rotate-6" },
];

const ContactPage = () => {
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Call your new Backend API
      await axios.post('http://localhost:5000/api/contact', formData);
      
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' }); // Clear form
      setTimeout(() => setStatus('idle'), 5000); // Reset status after 5s

    } catch (error) {
      console.error("Sending failed", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER SECTION */}
      <div className="relative bg-slate-50 pt-32 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="text-left">
              <div className="inline-flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-sm mb-4">
                <Code size={16} className="text-blue-600" /> Technical Team
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                Meet the <br/>
                <span className="relative inline-block px-4 py-1 mt-2 transform -rotate-1">
                    <span className="absolute inset-0 bg-yellow-400 rounded-lg transform -skew-x-6"></span>
                    <span className="relative text-slate-900">Developers</span>
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed mb-8">
                Built by students, powered by AI. We are the engineering team behind LexAI.
              </p>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 Active Contribution
              </div>
            </motion.div>

            {/* TEAM CLOUD */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2, duration: 0.8 }}
               className="relative h-[500px] hidden lg:block"
            >
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className={`absolute w-44 h-44 rounded-full border-4 border-white shadow-xl cursor-pointer group transition-all duration-300 hover:z-50 hover:scale-110 ${member.style}`}>
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg text-sm border-2 border-white flex items-center gap-2">
                       <span>{member.name}</span>
                       <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FLOATING FORM SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[600px] border border-slate-100">
            
          {/* LEFT: Contact Info */}
          <div className="bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-8">
              <div>
                 <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                 <p className="text-slate-400 text-sm">Fill up the form and our team will get back to you within 24 hours.</p>
              </div>
              <div className="flex items-start gap-4"><Phone className="text-blue-500" /><p className="font-bold text-lg">+94 77 123 4567</p></div>
              <div className="flex items-start gap-4"><Mail className="text-blue-500" /><p className="font-bold text-lg">lexai9514@gmail.com</p></div>
              <div className="flex items-start gap-4"><MapPin className="text-blue-500" /><p className="text-slate-400 text-sm">No. 320, R. A. De Mel Mawatha,<br/>Colombo 03, Canada.</p></div>
            </div>
          </div>

          {/* RIGHT: The Form */}
          <div className="col-span-1 lg:col-span-2 p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none bg-white">
                  <option>General Inquiry</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Connect with Developers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none resize-none"></textarea>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                    ${status === 'loading' ? 'bg-slate-400 cursor-not-allowed' : 
                      status === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                      status === 'error' ? 'bg-red-600 hover:bg-red-700' : 
                      'bg-slate-900 hover:bg-blue-700'}`}
                >
                  {status === 'loading' && <Loader2 className="animate-spin" />}
                  {status === 'success' && <><CheckCircle /> Sent Successfully!</>}
                  {status === 'error' && "Failed. Try Again."}
                  {status === 'idle' && <>Send Message <Send size={20} /></>}
                </button>
              </div>
            </form>
          </div>

        </motion.div>
      </div>

      {/* MAP SECTION */}
      <div className="w-full h-[500px] bg-slate-200">
        <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.8039215096!2d79.82118600741255!3d6.921838637737385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1706037000000!5m2!1sen!2slk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
      </div>
    </div>
  );
};

export default ContactPage;