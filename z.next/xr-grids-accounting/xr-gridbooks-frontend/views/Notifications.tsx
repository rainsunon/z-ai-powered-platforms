import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Search, Filter, RefreshCcw, MoreVertical, AlertCircle, CheckCircle, FileText, RefreshCw, Paperclip, Bold, Smile, Send, Check, Trash2, BellOff, User, X, Mail, Phone, MapPin } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'system' | 'success' | 'message';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority?: 'critical';
  sender?: {
    name: string;
    role: string;
    initials?: string;
    color?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  contextLabel?: string;
  messages?: Message[];
}

interface Message {
  id: string;
  text: string;
  time: string;
  isSender: boolean;
  attachment?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'Bank Feed Disconnected',
    description: 'The connection to Chase Bank has been lost. Please re-authenticate to continue syncing transactions.',
    time: '10 mins ago',
    read: false,
    priority: 'critical',
    messages: [
       { id: 'm1', text: 'System Alert: Connection lost at 10:30 AM.', time: '10:30 AM', isSender: false },
       { id: 'm2', text: 'Please re-authenticate via the Banking tab.', time: '10:30 AM', isSender: false }
    ]
  },
  {
    id: '2',
    type: 'success',
    title: 'Invoice #4402 Paid',
    description: 'Payment of $1,200.00 received from Acme Corp via Stripe.',
    time: '2 hours ago',
    read: true,
    messages: [
       { id: 'm1', text: 'Payment received for Invoice #4402.', time: '09:15 AM', isSender: false },
       { id: 'm2', text: 'Automated receipt sent to client.', time: '09:15 AM', isSender: false }
    ]
  },
  {
    id: '3',
    type: 'message',
    title: 'Sarah Jenkins',
    description: 'Re: Invoice #4402 - Hi, I just processed the payment for this invoice. Please let me know if...',
    time: '4h ago',
    read: true,
    sender: {
       name: 'Sarah Jenkins',
       role: 'Acme Corp • Billing Contact',
       initials: 'SJ',
       color: 'bg-purple-100 text-purple-600',
       email: 'sarah.j@acmecorp.com',
       phone: '(555) 123-4567',
       location: 'New York, NY'
    },
    contextLabel: 'Acme Corp',
    messages: [
       { id: 'm1', text: 'Hi Alex,', time: '10:42 AM', isSender: false },
       { id: 'm2', text: 'I just processed the payment for Invoice #4402. It should hit your account by tomorrow morning.', time: '10:42 AM', isSender: false },
       { id: 'm3', text: "Thanks Sarah! That's great news. No need for the PDF, the bank feed usually matches it automatically.", time: '10:55 AM', isSender: true }
    ]
  }
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Critical' | 'Mentions'>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [selectedId, setSelectedId] = useState<string>('3');
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedNotification = notifications.find(n => n.id === selectedId) || (notifications.length > 0 ? notifications[0] : undefined);

  // If the selected ID doesn't exist anymore (e.g. archived), select the first available
  useEffect(() => {
    if (!selectedNotification && notifications.length > 0) {
        setSelectedId(notifications[0].id);
    }
  }, [notifications, selectedNotification]);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    if (activeTab === 'Critical') return n.priority === 'critical';
    if (activeTab === 'Mentions') return n.type === 'message';
    return true;
  });

  const handleSendMessage = () => {
    if ((!inputText.trim() && !attachedFile) || !selectedId) return;
    
    const text = attachedFile ? `[Attached: ${attachedFile}] ${inputText}` : inputText;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true,
      attachment: attachedFile || undefined
    };

    setNotifications(prev => prev.map(n => {
      if (n.id === selectedId) {
        return {
          ...n,
          messages: [...(n.messages || []), newMessage]
        };
      }
      return n;
    }));

    setInputText('');
    setAttachedFile(null);
    // Simulate scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleAction = (action: string) => {
      setShowMenu(false); // Close menu
      
      if (!selectedNotification) return;

      switch(action) {
          case 'Archive':
              // Remove notification
              const newNotifs = notifications.filter(n => n.id !== selectedNotification.id);
              setNotifications(newNotifs);
              // Selection update handled by useEffect
              break;
          case 'Mark as Unread':
              setNotifications(prev => prev.map(n => 
                  n.id === selectedNotification.id ? { ...n, read: !n.read } : n
              ));
              break;
          case 'View Profile':
              if (selectedNotification.sender) {
                  setShowProfileModal(true);
              } else {
                  alert("This is a system notification, no profile available.");
              }
              break;
          default:
              console.log('Unknown action', action);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setAttachedFile(e.target.files[0].name);
      }
  };

  const insertText = (text: string) => {
      setInputText(prev => prev + text);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#f6f8f8]" onClick={() => setShowMenu(false)}>
      <div className="px-6 py-5 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Notifications & Messages</h1>
        <p className="text-slate-500 text-sm mt-1">Manage system alerts and client communications from your command center.</p>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row px-6 pb-6 gap-6 min-h-0 overflow-hidden">
        {/* List View */}
        <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 px-2 shrink-0">
            {['All', 'Unread', 'Critical', 'Mentions'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 pb-3 pt-4 text-sm font-semibold border-b-[3px] text-center transition-colors ${
                        activeTab === tab 
                        ? 'text-[#13b6ec] border-[#13b6ec]' 
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                >
                    {tab}
                </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-200">
               {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
                   <div 
                        key={notif.id}
                        onClick={() => setSelectedId(notif.id)}
                        className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors relative ${
                            selectedId === notif.id 
                            ? 'bg-[#13b6ec]/5 border-l-4 border-[#13b6ec]' 
                            : notif.type === 'system' && notif.priority === 'critical' ? 'bg-red-50/50' : ''
                        }`}
                   >
                      {!notif.read && <div className="absolute top-4 right-4 size-2 rounded-full bg-[#13b6ec] shadow-sm ring-1 ring-white"></div>}
                      
                      <div className="flex gap-3">
                         {notif.type === 'system' && (
                             <div className="shrink-0 size-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <AlertCircle size={20} />
                             </div>
                         )}
                         {notif.type === 'success' && (
                             <div className="shrink-0 size-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <CheckCircle size={20} />
                             </div>
                         )}
                         {notif.type === 'message' && (
                             <div className={`shrink-0 size-10 rounded-full flex items-center justify-center font-bold text-sm ${notif.sender?.color || 'bg-slate-200'}`}>
                                {notif.sender?.initials || 'User'}
                             </div>
                         )}

                         <div className="flex-1 pr-4">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm text-slate-900 leading-tight ${!notif.read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</p>
                                <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                            </div>
                            <p className={`text-xs mt-1 line-clamp-2 ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>{notif.description}</p>
                            {notif.contextLabel && (
                                <div className="mt-2 flex items-center gap-1">
                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                        {notif.contextLabel}
                                    </span>
                                </div>
                            )}
                         </div>
                      </div>
                   </div>
               )) : (
                   <div className="p-8 text-center text-slate-500 text-sm">
                       No notifications found.
                   </div>
               )}
            </div>
          </div>
        </div>

        {/* Chat View */}
        <div className="hidden lg:flex flex-1 flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          {selectedNotification ? (
             <>
                {/* Chat Header */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        {selectedNotification.type === 'message' && selectedNotification.sender ? (
                            <>
                                <div className="size-10 rounded-full bg-slate-200 relative overflow-hidden flex items-center justify-center font-bold text-sm text-slate-600">
                                    {selectedNotification.sender.initials}
                                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white"></span>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-sm font-bold text-slate-900">{selectedNotification.sender.name}</h2>
                                    <p className="text-xs text-slate-500">{selectedNotification.sender.role}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`size-10 rounded-full flex items-center justify-center ${selectedNotification.type === 'system' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {selectedNotification.type === 'system' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-sm font-bold text-slate-900">{selectedNotification.title}</h2>
                                    <p className="text-xs text-slate-500">System Notification</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedNotification.title.includes('Invoice') && (
                            <button 
                                onClick={() => alert('Opening Invoice Preview...')}
                                className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-inset ring-slate-500/10 gap-1.5 hover:bg-slate-200 transition-colors"
                            >
                                <FileText size={14} className="text-[#13b6ec]" /> View Invoice
                            </button>
                        )}
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className={`size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors ${showMenu ? 'bg-slate-100 text-slate-900' : ''}`}
                            >
                                <MoreVertical size={20} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <button onClick={() => handleAction('Mark as Unread')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                                        <BellOff size={16} /> {selectedNotification.read ? 'Mark as Unread' : 'Mark as Read'}
                                    </button>
                                    <button onClick={() => handleAction('View Profile')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2" disabled={!selectedNotification.sender}>
                                        <User size={16} /> View Profile
                                    </button>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button onClick={() => handleAction('Archive')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                                        <Trash2 size={16} /> Archive Conversation
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
                    <div className="flex items-center justify-center py-2">
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
                    </div>
                    
                    {selectedNotification.messages?.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.isSender ? 'self-end flex-row-reverse' : ''}`}>
                            <div className={`size-8 rounded-full overflow-hidden shrink-0 self-end mb-1 ${msg.isSender ? 'bg-slate-300' : 'bg-slate-200'} flex items-center justify-center`}>
                                {msg.isSender ? <User size={16} className="text-slate-500"/> : (selectedNotification.sender ? selectedNotification.sender.initials : 'Sys')}
                            </div>
                            <div className={`flex flex-col gap-1 ${msg.isSender ? 'items-end' : ''}`}>
                                <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.isSender ? 'bg-[#13b6ec] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                </div>
                                <span className={`text-[10px] text-slate-400 ${msg.isSender ? 'mr-1' : 'ml-1'}`}>{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <div className="flex flex-col gap-3">
                        {attachedFile && (
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg self-start">
                                <Paperclip size={14} className="text-[#13b6ec]" />
                                <span className="text-xs font-medium text-slate-700 max-w-[200px] truncate">{attachedFile}</span>
                                <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-red-500 ml-1"><X size={14} /></button>
                            </div>
                        )}
                        <textarea 
                            className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#13b6ec] focus:ring-[#13b6ec] sm:text-sm resize-none py-3 px-4 focus:outline-none focus:ring-1" 
                            placeholder="Type your message here..." 
                            rows={3}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        ></textarea>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors" 
                                    title="Attach File"
                                >
                                    <Paperclip size={20} />
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                </button>
                                <button onClick={() => insertText('**')} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors" title="Bold"><Bold size={20} /></button>
                                <button onClick={() => insertText('😊')} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors" title="Insert Emoji"><Smile size={20} /></button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 hidden sm:inline">Press Enter to send</span>
                                <Button onClick={handleSendMessage} disabled={!inputText.trim() && !attachedFile}>
                                    Send <Send size={18} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
             </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <User size={32} className="text-slate-300" />
                </div>
                <p className="font-medium">No conversation selected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedNotification?.sender && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="bg-[#13b6ec]/10 p-6 flex flex-col items-center border-b border-slate-100">
                      <div className={`size-20 rounded-full ${selectedNotification.sender.color || 'bg-slate-200'} flex items-center justify-center text-xl font-bold mb-3 shadow-sm ring-4 ring-white`}>
                          {selectedNotification.sender.initials}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedNotification.sender.name}</h3>
                      <p className="text-sm text-slate-500">{selectedNotification.sender.role}</p>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Mail size={16} className="text-slate-400" />
                          <span>{selectedNotification.sender.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Phone size={16} className="text-slate-400" />
                          <span>{selectedNotification.sender.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                          <MapPin size={16} className="text-slate-400" />
                          <span>{selectedNotification.sender.location}</span>
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <Button onClick={() => setShowProfileModal(false)}>Close</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}