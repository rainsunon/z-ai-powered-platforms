import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { 
  Users, Search, Plus, Filter, MoreHorizontal, X, 
  Settings, Globe, Paperclip, Bell, Clock, ChevronRight,
  UserPlus, Mail, Phone, MapPin, ArrowUpRight, User, 
  CreditCard, FileText, ChevronDown, Check, Info, Trash2,
  CircleDollarSign, ChevronUp
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  contact: string;
  initials: string;
  color: string;
  totalOutstanding: number;
  credit: number;
  note: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'ZX zx',
    contact: 'zx zx',
    initials: 'ZZ',
    color: 'bg-white border-t-4 border-t-pink-300',
    totalOutstanding: 0,
    credit: 0,
    note: ''
  }
];

export default function Clients() {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(mockClients);

  // Visibility toggles for optional fields
  const [showBusinessPhone, setShowBusinessPhone] = useState(false);
  const [showMobilePhone, setShowMobilePhone] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  // Settings Expansion State
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);

  // Temp States for Settings
  const [tempRemindersState, setTempRemindersState] = useState(false);
  const [tempLateFeesState, setTempLateFeesState] = useState(false);
  const [tempLanguage, setTempLanguage] = useState('English (Canada)');
  const [tempCurrency, setTempCurrency] = useState('CAD — Canadian dollar');
  const [tempAttachmentsState, setTempAttachmentsState] = useState(false);

  // New Client Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      businessPhone: '',
      mobilePhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      currency: 'CAD, English (Canada)',
      sendReminders: false,
      lateFees: false,
      attachments: false
  });

  const handleSaveClient = () => {
      // Basic validation matching text in screenshot
      if ((!formData.firstName && !formData.lastName) && !formData.companyName) {
          alert("Either First and Last Name or Company Name is required.");
          return;
      }

      const newClient: Client = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.companyName || `${formData.firstName} ${formData.lastName}`,
          contact: formData.firstName ? `${formData.firstName} ${formData.lastName}` : 'Primary Contact',
          initials: (formData.companyName ? formData.companyName.substring(0,2) : (formData.firstName[0] || '') + (formData.lastName[0] || '')).toUpperCase() || '??',
          color: 'bg-white border-t-4 border-t-blue-400',
          totalOutstanding: 0,
          credit: 0,
          note: ''
      };

      setClients([...clients, newClient]);
      setView('list');
      setFormData({
        firstName: '', lastName: '', companyName: '', email: '', phone: '',
        businessPhone: '', mobilePhone: '', streetAddress: '', city: '', state: '', zip: '', country: '',
        currency: 'CAD, English (Canada)', sendReminders: false, lateFees: false, attachments: false
      });
      setShowBusinessPhone(false);
      setShowMobilePhone(false);
      setShowAddress(false);
      setExpandedSetting(null);
  };

  const toggleSetting = (setting: string) => {
    if (expandedSetting === setting) {
      setExpandedSetting(null);
    } else {
      // Initialize temp states from current form data
      if (setting === 'reminders') setTempRemindersState(formData.sendReminders);
      if (setting === 'lateFees') setTempLateFeesState(formData.lateFees);
      if (setting === 'attachments') setTempAttachmentsState(formData.attachments);
      setExpandedSetting(setting);
    }
  };

  if (view === 'new') {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-4 duration-300 relative">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
             <h1 className="text-3xl font-bold text-slate-900">New Client</h1>
             <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setView('list')}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                 >
                     Cancel
                 </button>
                 <button 
                    onClick={handleSaveClient}
                    className="px-6 py-2 bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold rounded-lg transition-colors shadow-sm"
                 >
                     Save
                 </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
             <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
                 
                 {/* Left Column: Form */}
                 <div className="flex-1 max-w-3xl flex flex-col gap-6">
                    <div className="flex items-start gap-2 text-slate-500 text-sm mb-2">
                        <Info size={16} className="mt-0.5 shrink-0" />
                        <p>Either First and Last Name or Company Name is required to save this Client.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">First Name</label>
                            <Input 
                                className="h-11"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Last Name</label>
                            <Input 
                                className="h-11"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Company Name</label>
                        <Input 
                            className="h-11"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>

                    <div className="h-px bg-slate-200 w-full my-2"></div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <Input 
                            className="h-11"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <Input 
                            className="h-11"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    {/* Additional Phones */}
                    <div className="flex flex-col gap-4 mt-2">
                        {!showBusinessPhone && (
                            <button 
                                onClick={() => setShowBusinessPhone(true)}
                                className="flex items-center gap-2 text-[#13b6ec] font-medium hover:underline text-sm w-fit"
                            >
                                <Plus size={16} /> Add Business Phone
                            </button>
                        )}
                        {showBusinessPhone && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
                                <label className="text-sm font-medium text-slate-700">Business Phone</label>
                                <div className="flex gap-2">
                                    <Input 
                                        className="h-11"
                                        value={formData.businessPhone}
                                        onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                                    />
                                    <button onClick={() => setShowBusinessPhone(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        )}

                        {!showMobilePhone && (
                            <button 
                                onClick={() => setShowMobilePhone(true)}
                                className="flex items-center gap-2 text-[#13b6ec] font-medium hover:underline text-sm w-fit"
                            >
                                <Plus size={16} /> Add Mobile Phone
                            </button>
                        )}
                        {showMobilePhone && (
                             <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
                                <label className="text-sm font-medium text-slate-700">Mobile Phone</label>
                                <div className="flex gap-2">
                                    <Input 
                                        className="h-11"
                                        value={formData.mobilePhone}
                                        onChange={(e) => setFormData({...formData, mobilePhone: e.target.value})}
                                    />
                                    <button onClick={() => setShowMobilePhone(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-200 w-full my-2"></div>

                    {!showAddress && (
                        <button 
                            onClick={() => setShowAddress(true)}
                            className="flex items-center gap-2 text-[#13b6ec] font-medium hover:underline text-sm w-fit"
                        >
                            <Plus size={16} /> Add Address
                        </button>
                    )}
                    {showAddress && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 bg-slate-50 p-6 rounded-xl border border-slate-100 relative">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><MapPin size={16} /> Billing Address</h4>
                                <button onClick={() => setShowAddress(false)} className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Street Address</label>
                                <Input 
                                    className="h-11"
                                    value={formData.streetAddress}
                                    onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                                    placeholder="e.g. 123 Main St"
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">City</label>
                                    <Input 
                                        className="h-11"
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">State / Province</label>
                                    <Input 
                                        className="h-11"
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                    />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">Zip / Postal Code</label>
                                    <Input 
                                        className="h-11"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">Country</label>
                                    <Input 
                                        className="h-11"
                                        value={formData.country}
                                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    />
                                </div>
                             </div>
                        </div>
                    )}
                 </div>

                 {/* Right Column: Settings */}
                 <div className="w-full lg:w-80 flex flex-col">
                     <h3 className="text-lg font-bold text-slate-900 mb-2">Client Settings</h3>
                     
                     <div className="border-t border-b border-slate-100">
                         {/* Send Reminders */}
                         <div className="border-b border-slate-100 last:border-0">
                             <button 
                                className={`w-full py-4 flex items-center justify-between group transition-colors -mx-4 px-4 ${expandedSetting === 'reminders' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                onClick={() => toggleSetting('reminders')}
                             >
                                 <div className="text-left">
                                     <div className="flex items-center gap-3 mb-1">
                                         <Clock size={20} className="text-slate-400" />
                                         <span className="text-slate-700 font-medium text-sm">Send Reminders</span>
                                     </div>
                                     <p className="text-xs text-slate-500 pl-8">At Customizable Intervals</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`font-bold text-xs ${formData.sendReminders ? 'text-green-600' : 'text-slate-900'}`}>
                                        {formData.sendReminders ? 'YES' : 'NO'}
                                     </span>
                                     {expandedSetting === 'reminders' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                 </div>
                             </button>
                             {expandedSetting === 'reminders' && (
                                 <div className="bg-slate-50 -mx-4 px-8 pb-6 animate-in slide-in-from-top-2 border-t border-slate-100 shadow-inner">
                                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Send Payment Reminders</h4>
                                    <div className="flex items-start gap-3 mb-6">
                                        <input 
                                            type="checkbox" 
                                            id="reminder-check"
                                            className="mt-1 size-5 rounded border-slate-300 text-[#4cae4c] focus:ring-[#4cae4c] cursor-pointer"
                                            checked={tempRemindersState}
                                            onChange={(e) => setTempRemindersState(e.target.checked)}
                                        />
                                        <label htmlFor="reminder-check" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                            Automatically send payment reminders for this client's invoices.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-2 text-slate-500 mb-6 bg-white p-3 rounded border border-slate-200">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        <p className="text-xs">Changes will also apply to any new invoices</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setExpandedSetting(null)}>Cancel</Button>
                                        <button 
                                            onClick={() => {
                                                setFormData({...formData, sendReminders: tempRemindersState});
                                                setExpandedSetting(null);
                                            }}
                                            className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold text-xs px-4 py-2 rounded transition-colors shadow-sm"
                                        >
                                            Done
                                        </button>
                                    </div>
                                 </div>
                             )}
                         </div>

                         {/* Charge Late Fees */}
                         <div className="border-b border-slate-100 last:border-0">
                             <button 
                                className={`w-full py-4 flex items-center justify-between group transition-colors -mx-4 px-4 ${expandedSetting === 'lateFees' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                onClick={() => toggleSetting('lateFees')}
                             >
                                 <div className="text-left">
                                     <div className="flex items-center gap-3 mb-1">
                                         <CircleDollarSign size={20} className="text-slate-400" />
                                         <span className="text-slate-700 font-medium text-sm">Charge Late Fees</span>
                                     </div>
                                     <p className="text-xs text-slate-500 pl-8">Percentage or Flat-Rate Fees</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`font-bold text-xs ${formData.lateFees ? 'text-green-600' : 'text-slate-900'}`}>
                                        {formData.lateFees ? 'YES' : 'NO'}
                                     </span>
                                     {expandedSetting === 'lateFees' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                 </div>
                             </button>
                             {expandedSetting === 'lateFees' && (
                                 <div className="bg-slate-50 -mx-4 px-8 pb-6 animate-in slide-in-from-top-2 border-t border-slate-100 shadow-inner">
                                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Charge Late Fees</h4>
                                    <div className="flex items-start gap-3 mb-6">
                                        <input 
                                            type="checkbox" 
                                            id="late-fee-check"
                                            className="mt-1 size-5 rounded border-slate-300 text-[#4cae4c] focus:ring-[#4cae4c] cursor-pointer"
                                            checked={tempLateFeesState}
                                            onChange={(e) => setTempLateFeesState(e.target.checked)}
                                        />
                                        <label htmlFor="late-fee-check" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                            Automatically add late fees to this client's overdue invoices.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-2 text-slate-500 mb-6 bg-white p-3 rounded border border-slate-200">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        <p className="text-xs">Changes will also apply to any new invoices</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setExpandedSetting(null)}>Cancel</Button>
                                        <button 
                                            onClick={() => {
                                                setFormData({...formData, lateFees: tempLateFeesState});
                                                setExpandedSetting(null);
                                            }}
                                            className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold text-xs px-4 py-2 rounded transition-colors shadow-sm"
                                        >
                                            Done
                                        </button>
                                    </div>
                                 </div>
                             )}
                         </div>

                         {/* Currency & Language */}
                         <div className="border-b border-slate-100 last:border-0">
                             <button 
                                className={`w-full py-4 flex items-center justify-between group transition-colors -mx-4 px-4 ${expandedSetting === 'currency' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                onClick={() => toggleSetting('currency')}
                             >
                                 <div className="text-left">
                                     <div className="flex items-center gap-3 mb-1">
                                         <Globe size={20} className="text-slate-400" />
                                         <span className="text-slate-700 font-medium text-sm">Currency & Language</span>
                                     </div>
                                     <p className="text-xs text-slate-500 pl-8">{formData.currency}</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     {expandedSetting === 'currency' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                 </div>
                             </button>
                             {expandedSetting === 'currency' && (
                                 <div className="bg-slate-50 -mx-4 px-8 pb-6 animate-in slide-in-from-top-2 border-t border-slate-100 shadow-inner">
                                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Currency & Language</h4>
                                    <div className="flex flex-col gap-4 mb-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-medium text-slate-500">Choose a Language</label>
                                            <Select 
                                                className="h-10 bg-white"
                                                value={tempLanguage}
                                                onChange={(e) => setTempLanguage(e.target.value)}
                                            >
                                                <option>English (Canada)</option>
                                                <option>English (United States)</option>
                                                <option>French (Canada)</option>
                                                <option>French (France)</option>
                                                <option>Spanish</option>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-medium text-slate-500">Choose a Currency</label>
                                            <Select 
                                                className="h-10 bg-white"
                                                value={tempCurrency}
                                                onChange={(e) => setTempCurrency(e.target.value)}
                                            >
                                                <option>CAD — Canadian dollar</option>
                                                <option>USD — US Dollar</option>
                                                <option>EUR — Euro</option>
                                                <option>GBP — British Pound</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setExpandedSetting(null)}>Cancel</Button>
                                        <button 
                                            onClick={() => {
                                                const code = tempCurrency.split(' — ')[0];
                                                setFormData({...formData, currency: `${code}, ${tempLanguage}`});
                                                setExpandedSetting(null);
                                            }}
                                            className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold text-xs px-4 py-2 rounded transition-colors shadow-sm"
                                        >
                                            Done
                                        </button>
                                    </div>
                                 </div>
                             )}
                         </div>

                         {/* Invoice Attachments */}
                         <div className="border-b border-slate-100 last:border-0">
                             <button 
                                className={`w-full py-4 flex items-center justify-between group transition-colors -mx-4 px-4 ${expandedSetting === 'attachments' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                onClick={() => toggleSetting('attachments')}
                             >
                                 <div className="text-left">
                                     <div className="flex items-center gap-3 mb-1">
                                         <FileText size={20} className="text-slate-400" />
                                         <span className="text-slate-700 font-medium text-sm">Invoice Attachments</span>
                                     </div>
                                     <p className="text-xs text-slate-500 pl-8">Attach PDF copy to emails</p>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`font-bold text-xs ${formData.attachments ? 'text-green-600' : 'text-slate-900'}`}>
                                        {formData.attachments ? 'YES' : 'NO'}
                                     </span>
                                     {expandedSetting === 'attachments' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                 </div>
                             </button>
                             {expandedSetting === 'attachments' && (
                                 <div className="bg-slate-50 -mx-4 px-8 pb-6 animate-in slide-in-from-top-2 border-t border-slate-100 shadow-inner">
                                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Invoice Attachments</h4>
                                    <div className="flex items-start gap-3 mb-6">
                                        <input 
                                            type="checkbox" 
                                            id="attachments-check"
                                            className="mt-1 size-5 rounded border-slate-300 text-[#4cae4c] focus:ring-[#4cae4c] cursor-pointer"
                                            checked={tempAttachmentsState}
                                            onChange={(e) => setTempAttachmentsState(e.target.checked)}
                                        />
                                        <label htmlFor="attachments-check" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                                            Attach a PDF copy when sending invoices by email.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-2 text-slate-500 mb-6 bg-white p-3 rounded border border-slate-200">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        <p className="text-xs">Changes will apply to new invoices</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setExpandedSetting(null)}>Cancel</Button>
                                        <button 
                                            onClick={() => {
                                                setFormData({...formData, attachments: tempAttachmentsState});
                                                setExpandedSetting(null);
                                            }}
                                            className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold text-xs px-4 py-2 rounded transition-colors shadow-sm"
                                        >
                                            Done
                                        </button>
                                    </div>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </div>
    );
  }

  // List View
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium text-sm px-3 py-2">
                More Actions <ChevronDown size={14} />
            </button>
            <button 
                onClick={() => setView('new')}
                className="bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-sm text-sm"
            >
                New Client
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f6f8f8]">
        {/* Banner */}
        {showBanner && (
          <div className="m-8 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-8 animate-in fade-in slide-in-from-top-4 duration-500">
             <button 
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
             >
                 <X size={20} />
             </button>
             
             <div className="text-center mb-10">
                 <h2 className="text-2xl font-bold text-[#13b6ec] mb-2">Make Billing a Breeze with Client Info at Your Fingertips</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
                 {/* Connecting lines */}
                 <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-slate-100 -z-10"></div>

                 <div className="flex flex-col items-center text-center gap-4">
                     <div className="size-16 rounded-full bg-[#4cae4c] text-white flex items-center justify-center border-4 border-white shadow-sm z-10">
                         <User size={28} />
                     </div>
                     <h3 className="font-bold text-slate-900 text-sm">It All Starts with Clients</h3>
                     <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                         Get yourself up and running with organized clients. <a href="#" className="text-[#13b6ec] underline">Learn more</a>
                     </p>
                 </div>

                 <div className="flex flex-col items-center text-center gap-4">
                     <div className="size-16 rounded-full bg-pink-400 text-white flex items-center justify-center border-4 border-white shadow-sm z-10">
                         <CreditCard size={28} />
                     </div>
                     <h3 className="font-bold text-slate-900 text-sm">Outstanding Client Revenue</h3>
                     <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                         Know exactly where your client stands with any outstanding invoices. <a href="#" className="text-[#13b6ec] underline">See how</a>
                     </p>
                 </div>

                 <div className="flex flex-col items-center text-center gap-4">
                     <div className="size-16 rounded-full bg-[#13b6ec] text-white flex items-center justify-center border-4 border-white shadow-sm z-10">
                         <Users size={28} />
                     </div>
                     <h3 className="font-bold text-slate-900 text-sm">Have Lots of Clients?</h3>
                     <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                         Automatically import your clients from a .csv file. <a href="#" className="text-[#13b6ec] underline">Import now</a>
                     </p>
                 </div>
             </div>
          </div>
        )}

        <div className="px-8 pb-8 flex flex-col gap-8">
            {/* Stats Row */}
            <div className="flex justify-center items-center gap-16 py-4 relative">
                 <div className="text-center">
                     <p className="text-3xl font-bold text-[#13b6ec]">$0</p>
                     <p className="text-slate-500 text-sm">overdue</p>
                 </div>
                 <div className="text-center relative">
                     <p className="text-3xl font-bold text-[#13b6ec]">$0</p>
                     <p className="text-slate-500 text-sm">total outstanding</p>
                     
                     {/* Handwritten Arrow Annotation */}
                     <div className="absolute left-[100%] top-1/2 ml-4 -mt-8 hidden lg:block w-48">
                        <svg viewBox="0 0 100 50" className="w-full text-[#13b6ec] opacity-80 overflow-visible">
                            <path d="M0,40 C 20,40, 30,20, 10,0" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
                             <defs>
                                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                                <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
                                </marker>
                            </defs>
                        </svg>
                        <p className="font-handwriting text-[#13b6ec] text-sm -mt-2 ml-4">See who owes you the most at a glance</p>
                     </div>
                 </div>
                 <div className="text-center">
                     <p className="text-3xl font-bold text-[#13b6ec]">$0</p>
                     <p className="text-slate-500 text-sm">in draft</p>
                 </div>
            </div>

            {/* Recently Active */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Recently Active</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setView('new')}
                        className="w-48 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-[#4cae4c] hover:text-[#4cae4c] transition-all group"
                    >
                        <div className="size-8 rounded-full bg-transparent group-hover:bg-[#4cae4c] border-2 border-slate-300 group-hover:border-[#4cae4c] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                            <Plus size={16} strokeWidth={3} />
                        </div>
                        <span className="font-bold text-slate-500 group-hover:text-[#4cae4c]">New Client</span>
                    </button>
                    
                    {clients.map(client => (
                        <Card key={client.id} className={`w-48 h-32 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden ${client.color}`}>
                            <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 bg-white mb-2">
                                {client.initials}
                            </div>
                            <span className="font-bold text-slate-900">{client.name}</span>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    <button className="px-6 py-3 text-sm font-medium border-b-2 border-slate-900 text-slate-900">Clients</button>
                    <button className="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700">Sent Emails</button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-4 bg-white p-2 rounded-lg border border-slate-200">
                         <div className="flex items-center gap-2 px-2">
                             <span className="font-bold text-slate-900 text-lg pl-2">All Clients</span>
                         </div>
                         <div className="flex-1 max-w-lg relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                                className="w-full pl-10 pr-32 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#13b6ec]"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                             />
                             <div className="absolute right-0 top-0 bottom-0 border-l border-slate-200 flex items-center px-3 bg-slate-50 rounded-r text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100">
                                 <Filter size={14} className="mr-1" /> Advanced Search <ChevronDown size={12} className="ml-1" />
                             </div>
                         </div>
                    </div>

                    <Card className="overflow-hidden border-t-0 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-200">
                                    <th className="px-4 py-3 w-10">
                                        <input type="checkbox" className="rounded border-slate-300" />
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase cursor-pointer hover:bg-slate-50">
                                        Client Name <span className="inline-block ml-1">▲</span> <span className="text-slate-400 font-normal normal-case">/ Primary Contact</span>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase">Internal Note</th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase text-right">Credit</th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase text-right">Total Outstanding</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50 group">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded border-slate-300" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-[#13b6ec] text-sm hover:underline cursor-pointer">{client.name}</p>
                                            <p className="text-xs text-slate-500">{client.contact}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500 italic">{client.note}</td>
                                        <td className="px-4 py-3 text-right text-sm text-slate-500">
                                            {client.credit > 0 ? `$${client.credit.toFixed(2)}` : ''}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-slate-500">
                                            {client.totalOutstanding > 0 ? `$${client.totalOutstanding.toFixed(2)}` : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-right text-sm font-bold text-slate-700">
                                        Total Outstanding: <span className="ml-2">$0.00 CAD</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
                            <div className="text-sm font-bold text-slate-700">
                                1-1 <span className="font-normal text-slate-500">of</span> {clients.length}
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50">View Archived Clients</button>
                                <span className="text-xs text-slate-400">or</span>
                                <a href="#" className="text-xs text-slate-500 underline hover:text-slate-700">deleted</a>
                                
                                <div className="flex items-center gap-2 ml-4">
                                    <span className="text-xs text-slate-500">Items per page:</span>
                                    <select className="text-xs border border-slate-300 rounded p-1">
                                        <option>30</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    );
}