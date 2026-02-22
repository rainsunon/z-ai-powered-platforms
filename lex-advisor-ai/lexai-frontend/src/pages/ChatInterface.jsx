import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Plus, User, Scale, Send, Trash2, Edit2, Pin, Check, X, MapPin } from 'lucide-react'; // Added MapPin
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useUser, UserButton } from "@clerk/clerk-react"; 
import { motion } from 'framer-motion'; // Ensure you have framer-motion installed

const ChatInterface = () => {
  const { user, isLoaded } = useUser(); 
  
  // --- STATE ---
  const [historyList, setHistoryList] = useState([]); 
  const [editingId, setEditingId] = useState(null); 
  const [editTitle, setEditTitle] = useState("");   

  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queriesLeft, setQueriesLeft] = useState(20); 

  // --- SMART INIT ---
  const [messages, setMessages] = useState(() => {
      const welcomeMsg = {
          id: 'welcome', 
          sender: 'ai', 
          text: `Hello! I am LexAI. How can I help with Canadan Law?`, 
          time: 'Now' 
      };
      const pending = localStorage.getItem("pendingMessage");
      if (pending) {
          return [welcomeMsg, { id: 'user-pending', sender: 'user', text: pending, time: 'Now' }];
      }
      return [welcomeMsg];
  });

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(scrollToBottom, [messages, isTyping]);

  // --- 1. FETCH & SORT HISTORY ---
  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/history/${user.id}`);
      
      const sorted = res.data.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.timestamp) - new Date(a.timestamp); 
        }
        return a.isPinned ? -1 : 1; 
      });

      setHistoryList(sorted); 
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  // --- 2. HISTORY ACTIONS ---
  const togglePin = async (e, chat) => {
    e.stopPropagation();
    try {
        await axios.put(`http://localhost:5000/api/chat/history/${chat._id}`, {
            isPinned: !chat.isPinned
        });
        fetchHistory();
    } catch (err) { console.error("Pin error", err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(!window.confirm("Are you sure you want to delete this chat?")) return;
    
    try {
        await axios.delete(`http://localhost:5000/api/chat/history/${id}`);
        fetchHistory();
        setMessages([{ id: 'welcome', sender: 'ai', text: "Chat deleted. Start a new one!", time: 'Now' }]);
    } catch (err) { console.error("Delete error", err); }
  };

  const startEditing = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title || chat.question);
  };

  const saveTitle = async (e) => {
      e.stopPropagation();
      try {
        await axios.put(`http://localhost:5000/api/chat/history/${editingId}`, {
            title: editTitle
        });
        setEditingId(null);
        fetchHistory();
      } catch (err) { console.error("Rename error", err); }
  };

  // --- 3. SEND MESSAGES ---
  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || queriesLeft <= 0) return;
    
    if (!textOverride) setInput('');

    // Add User Message
    if (!textOverride) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: 'user', 
          text: textToSend, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    }

    setIsTyping(true);
    setQueriesLeft(prev => prev - 1);

    try {
      const response = await axios.post('http://localhost:5000/api/chat/ask', {
        question: textToSend,
        userId: user ? user.id : "guest_user" 
      });

      // ✅ ADD AI RESPONSE + LAWYER CARD (If exists)
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: response.data.answer || response.data.reply, // Support both formats
        recommendedLawyer: response.data.recommendedLawyer, // <--- Capture Lawyer Data
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      
      if (user) fetchHistory(); 

    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "⚠️ Connection Error.", time: 'Now' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- 4. AUTO-SEND ---
  const hasAutoSent = useRef(false); 
  useEffect(() => {
      const pending = localStorage.getItem("pendingMessage");
      if (pending && !hasAutoSent.current) {
          hasAutoSent.current = true; 
          localStorage.removeItem("pendingMessage"); 
          handleSend(pending);
      }
      if (user && isLoaded) fetchHistory();
  }, [isLoaded, user]);


  const handleNewChat = () => {
    setMessages([{ id: 'new', sender: 'ai', text: "Starting a new conversation. What's on your mind?", time: 'Now' }]);
    setQueriesLeft(20);
    setInput('');
  };

  const loadChat = (chatItem) => {
    setMessages([
        { id: 1, sender: 'user', text: chatItem.question, time: 'History' },
        { id: 2, sender: 'ai', text: chatItem.answer, time: 'History' }
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      
      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100">
        <div className="p-6">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold shadow-blue-200 shadow-lg transition-all">
             <Plus size={20} /> New Chat
          </button>
        </div>
        
        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">Recent Activity</h3>
          <div className="space-y-2">
            {historyList.map((chat) => (
                <div 
                    key={chat._id} 
                    onClick={() => loadChat(chat)} 
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all border border-transparent 
                    ${chat.isPinned ? "bg-blue-50 border-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"}`}
                >
                    {chat.isPinned ? <Pin size={16} className="text-blue-500 flex-shrink-0 fill-current" /> : <MessageSquare size={18} className="text-gray-400 flex-shrink-0" />}
                    
                    <div className="flex-1 overflow-hidden">
                        {editingId === chat._id ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <input 
                                    className="w-full bg-white border border-blue-300 rounded px-1 text-xs py-1 outline-none"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={saveTitle} className="text-green-600 hover:bg-green-100 p-1 rounded"><Check size={14}/></button>
                                <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-red-500 hover:bg-red-100 p-1 rounded"><X size={14}/></button>
                            </div>
                        ) : (
                            <span className="truncate block">{chat.title || chat.question}</span>
                        )}
                    </div>

                    {editingId !== chat._id && (
                        <div className="hidden group-hover:flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm absolute right-2 top-1/2 -translate-y-1/2">
                            <button onClick={(e) => togglePin(e, chat)} className="p-1 hover:text-blue-600 text-gray-400" title={chat.isPinned ? "Unpin" : "Pin"}>
                                <Pin size={14} className={chat.isPinned ? "fill-current" : ""} />
                            </button>
                            <button onClick={(e) => startEditing(e, chat)} className="p-1 hover:text-orange-600 text-gray-400" title="Rename">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={(e) => handleDelete(e, chat._id)} className="p-1 hover:text-red-600 text-gray-400" title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
            {isLoaded && user ? (
                <div className="flex items-center gap-3 px-2">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">{user.fullName}</span>
                        <span className="text-xs text-gray-400">{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-400 text-center">Loading User...</div>
            )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-6">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.sender === 'user' ? "flex justify-end" : "flex justify-start"}>
              <div className={"flex max-w-[80%] md:max-w-[70%] gap-4 " + (msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                
                {/* Avatar */}
                <div className={"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm " + (msg.sender === 'user' ? "bg-blue-600" : "bg-slate-900")}>
                  {msg.sender === 'user' ? <User size={18} className="text-white" /> : <Scale size={18} className="text-white" />}
                </div>

                {/* Message Bubble + Lawyer Card Container */}
                <div className="flex flex-col gap-2">
                    <div className={"p-5 rounded-2xl shadow-sm text-sm leading-relaxed " + (msg.sender === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none")}>
                        <ReactMarkdown components={{ strong: ({node, ...props}) => <span className="font-bold" {...props} /> }}>
                            {msg.text}
                        </ReactMarkdown>
                    </div>

                    {/* 👇 LAWYER RECOMMENDATION CARD 👇 */}
                    {msg.recommendedLawyer && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-white p-4 rounded-xl border border-blue-100 shadow-md max-w-sm"
                        >
                            <div className="flex items-start gap-4">
                                <img 
                                    src={msg.recommendedLawyer.profileImage || "https://via.placeholder.com/150"} 
                                    alt="Lawyer" 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                                />
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{msg.recommendedLawyer.name}</h3>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {msg.recommendedLawyer.specialization}
                                    </span>
                                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                                        <MapPin size={12} /> {msg.recommendedLawyer.location}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <a 
                                    href={`https://wa.me/${msg.recommendedLawyer.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>

              </div>
            </div>
          ))}
          {isTyping && <div className="p-6 text-gray-400 text-sm animate-pulse">LexAI is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-100">
           <div className="max-w-4xl mx-auto relative flex items-center gap-3">
             <input 
               type="text" 
               className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" 
               placeholder="Ask a legal question..." 
               value={input} 
               onChange={(e) => setInput(e.target.value)} 
               onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
             />
             <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
               <Send size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;