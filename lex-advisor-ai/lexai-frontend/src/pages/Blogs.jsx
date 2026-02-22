import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

// 📝 10 Simple Blog Posts with STABLE Images
const BLOG_POSTS = [
  {
    id: 1,
    title: "Can my boss fire me without a warning letter?",
    category: "Labor Law",
    date: "Jan 20, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    excerpt: "In Canada, a boss cannot just say 'You are fired.' They must follow a legal process. Learn about the 'Domestic Inquiry' rule.",
    featured: true
  },
  {
    id: 2,
    title: "EPF and ETF: What is the difference?",
    category: "Finance",
    date: "Jan 18, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    excerpt: "Every employee sees these on their payslip. EPF is for your retirement (8% + 12%), but ETF is a bonus paid only by the company (3%)."
  },
  {
    id: 3,
    title: "Maternity Leave Rights in 2026",
    category: "Women's Rights",
    date: "Jan 15, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
    excerpt: "Did you know you get 84 working days of leave? It doesn't matter if you are permanent or on probation. The law protects you."
  },
  {
    id: 4,
    title: "Overtime Calculation: Are you underpaid?",
    category: "Salary",
    date: "Jan 12, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    excerpt: "In Canada, 1 hour of OT should be paid as 1.5 hours of normal work. Many shops cheat this. Here is the formula."
  },
  {
    id: 5,
    title: "Probation Period: Myths vs. Facts",
    category: "Employment",
    date: "Jan 10, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
    excerpt: "Can they extend your probation forever? No. The maximum is usually 6-9 months. After that, you are automatically permanent."
  },
  {
    id: 6,
    title: "Resignation: How much notice do I give?",
    category: "Career",
    date: "Jan 08, 2026",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
    excerpt: "Check your appointment letter. Usually, it is 1 month. If you leave early, they might ask you to pay your salary back."
  },
  {
    id: 7,
    title: "Sexual Harassment at Work",
    category: "Safety",
    date: "Jan 05, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    excerpt: "This is a serious crime under the Penal Code. You can file a police complaint and a Labor Tribunal case at the same time."
  },
  {
    id: 8,
    title: "Constructive Termination: Forced to resign?",
    category: "Labor Law",
    date: "Jan 03, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1585842378054-ee0132f8133a?auto=format&fit=crop&q=80&w=800",
    excerpt: "If your boss treats you badly just to make you quit, that is illegal. You can claim compensation for 'Constructive Termination'."
  },
  {
    id: 9,
    title: "The Labor Tribunal Process Explained",
    category: "Court",
    date: "Jan 01, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    excerpt: "Don't be scared of the LT. It is not like a criminal court. It is a place for employees to get justice quickly and cheaply."
  },
  {
    id: 10,
    title: "Work from Home Laws in Canada",
    category: "New Trends",
    date: "Dec 28, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800",
    excerpt: "Currently, there is no specific WFH law. But your employer must still pay EPF/ETF even if you work from your bedroom."
  }
];

const Blogs = () => {
  // Fallback function for broken images
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"; // Safe fallback image
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* =========================================
          1. HEADER SECTION
      ========================================= */}
      <div className="pt-32 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Legal Insights <span className="text-blue-600">Blog</span>
          </motion.h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Simple explanations of complex Canadan laws. Know your rights in 5 minutes.
          </p>
        </div>
      </div>

      {/* =========================================
          2. FEATURED POST (Big Card)
      ========================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {BLOG_POSTS.filter(post => post.featured).map(post => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-90"></div>
            <img 
              src={post.image} 
              alt={post.title}
              onError={handleImageError} 
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full md:w-2/3">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider mb-4">
                Featured Article
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-200 text-lg mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {post.readTime}
                </div>
                <button className="flex items-center gap-2 text-white hover:underline ml-auto md:ml-0">
                  Read Full Story <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* =========================================
          3. BLOG GRID (Simple Cards)
      ========================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {BLOG_POSTS.filter(post => !post.featured).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="h-56 overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 z-10 flex items-center gap-1">
                  <Tag size={12} className="text-blue-600" /> {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <Link to="#" className="inline-flex items-center gap-1 text-blue-600 font-bold text-sm hover:gap-2 transition-all">
                  Read more <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Blogs;