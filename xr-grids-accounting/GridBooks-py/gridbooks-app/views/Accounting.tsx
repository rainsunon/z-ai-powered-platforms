import React, { useState } from 'react';
import { Card, Button, Badge, Input, Label, Select } from '../components/ui';
import { 
  Landmark, 
  FileText, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Layout, 
  Scale, 
  Percent, 
  Banknote, 
  ClipboardList, 
  ArrowRight,
  FlaskConical,
  X,
  ChevronDown,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  Building,
  CheckCircle,
  AlertTriangle,
  Mail,
  Send
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountType: string;
  lastFour: string;
  balance: number;
  lastReconciled?: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  transactionsToReconcile: number;
}

interface AccountingProps {
    onNavigate?: (view: string) => void;
    onOpenReport?: (id: string) => void;
}

export default function Accounting({ onNavigate, onOpenReport }: AccountingProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountName: 'Business Checking',
      accountType: 'Checking',
      lastFour: '8842',
      balance: 14250.50,
      lastReconciled: 'Oct 31, 2023',
      status: 'Connected',
      transactionsToReconcile: 24
    }
  ]);
  
  const [newAccount, setNewAccount] = useState({
      bankName: '',
      accountName: '',
      accountType: 'Checking',
      balance: ''
  });

  const handleAddAccount = () => {
      if (!newAccount.bankName || !newAccount.accountName) return;

      const account: BankAccount = {
          id: Math.random().toString(36).substr(2, 9),
          bankName: newAccount.bankName,
          accountName: newAccount.accountName,
          accountType: newAccount.accountType,
          lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
          balance: parseFloat(newAccount.balance) || 0,
          status: 'Connected',
          transactionsToReconcile: 5 // Mock transactions
      };

      setBankAccounts([...bankAccounts, account]);
      setShowAddBankModal(false);
      setNewAccount({ bankName: '', accountName: '', accountType: 'Checking', balance: '' });
  };

  const handleDeleteAccount = (id: string) => {
      // Small timeout to allow UI update if clicked rapidly
      setTimeout(() => {
        if(window.confirm('Are you sure you want to remove this bank account? This action cannot be undone.')) {
            setBankAccounts(prev => prev.filter(a => a.id !== id));
        }
      }, 50);
  };

  const openReconcileModal = (id: string) => {
      setActiveAccountId(id);
      setShowReconcileModal(true);
  }

  const handleOpenInvite = (role: string) => {
      setInviteRole(role);
      setShowInviteModal(true);
      setShowInviteMenu(false);
  };

  const handleSendInvite = () => {
      if (!inviteEmail) return;
      // Simulate API call
      setTimeout(() => {
          alert(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteName('');
      }, 500);
  };

  const handleReportClick = (id: string) => {
      if (onOpenReport) {
          onOpenReport(id);
      } else if (onNavigate) {
          onNavigate('reports');
      }
  };

  const reports = [
    { id: 'pl', title: 'Profit and Loss', desc: 'A summary of your total income, expenses, and net profit. Updated with new style and functionality.', icon: TrendingUp, updated: true },
    { id: 'gl', title: 'General Ledger', desc: 'A complete record of transactions and balances for all your accounts. Updated with new style and functionality.', icon: BookOpen, updated: true },
    { id: 'bal-sheet', title: 'Balance Sheet', desc: 'A snapshot of your assets, liabilities, and equity at any given point in time.', icon: Layout, updated: true },
    { id: 'rev-client', title: 'Revenue by Client', desc: 'A breakdown of your revenue by client to help you understand your business better.', icon: FileText, updated: true },
    { id: 'trial-bal', title: 'Trial Balance', desc: 'A quick gut check to make sure your books are balanced', icon: Scale },
    { id: 'bank-rec', title: 'Bank Reconciliation Summary', desc: 'Shows unreconciled bank transactions and GridBooks entries', icon: Landmark },
    { id: 'sales-tax', title: 'Sales Tax Summary', desc: 'Helps determine how much you owe the government in Sales Taxes', icon: Percent },
    { id: 'cash-flow', title: 'Cash Flow', desc: 'Overview of Cash coming in and going out of your business', icon: Banknote },
    { id: 'journal', title: 'Journal Entry', desc: 'Helps you see all the Manual Journal Entries and Adjustments made to your books', icon: ClipboardList },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#f6f8f8]">
      <div className="max-w-[1280px] mx-auto w-full px-6 py-8 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Accounting</h1>
           <div className="relative">
             <div className="flex shadow-sm">
                <button
                    onClick={() => setShowInviteMenu(!showInviteMenu)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-l-lg transition-colors flex items-center gap-2"
                >
                   Invite
                </button>
                <button
                    onClick={() => setShowInviteMenu(!showInviteMenu)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-2 rounded-r-lg border-l border-blue-600 transition-colors"
                >
                     <ChevronDown size={16} className={`transition-transform duration-200 ${showInviteMenu ? 'rotate-180' : ''}`} />
                </button>
             </div>

             {showInviteMenu && (
                 <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowInviteMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden">
                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                           <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Collaborators</p>
                        </div>
                        <div className="py-1">
                            <button 
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-600 hover:text-[#13b6ec] transition-colors flex items-center gap-2"
                                onClick={() => handleOpenInvite('Accountant')}
                            >
                               <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                   <Calculator size={14} /> 
                               </div>
                               Invite Accountant
                            </button>
                            <button 
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-600 hover:text-[#13b6ec] transition-colors flex items-center gap-2"
                                onClick={() => handleOpenInvite('Bookkeeper')}
                            >
                               <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                   <BookOpen size={14} /> 
                               </div>
                               Invite Bookkeeper
                            </button>
                             <button 
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-600 hover:text-[#13b6ec] transition-colors flex items-center gap-2"
                                onClick={() => handleOpenInvite('Tax Professional')}
                            >
                               <div className="size-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                   <FileText size={14} /> 
                               </div>
                               Invite Tax Professional
                            </button>
                        </div>
                    </div>
                 </>
             )}
           </div>
        </div>

        {/* Getting Started Banner */}
        {showBanner && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 relative shadow-sm">
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-[#13b6ec] mb-2">Here's how to get started with accounting</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               {/* Connecting Lines (Desktop only) */}
               <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-slate-100 -z-10"></div>

               <div className="flex flex-col items-center text-center gap-3">
                  <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mb-1 border-4 border-white shadow-sm z-10">
                     <FileText size={28} className="text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Get ready for bookkeeping</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                    Connect your bank or upload a CSV file to create related accounts in your books. <a href="#" className="text-[#13b6ec] hover:underline">Learn More</a>
                  </p>
               </div>

               <div className="flex flex-col items-center text-center gap-3">
                  <div className="size-16 rounded-full bg-blue-50 flex items-center justify-center mb-1 border-4 border-white shadow-sm z-10">
                     <FlaskConical size={28} className="text-[#13b6ec]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Journal Entries and Chart of Accounts</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                    Create Journal Entries and edit accounts in the Chart of Accounts with <a href="#" className="text-[#13b6ec] hover:underline">Advanced Accounting</a>
                  </p>
               </div>

               <div className="flex flex-col items-center text-center gap-3">
                  <div className="size-16 rounded-full bg-indigo-50 flex items-center justify-center mb-1 border-4 border-white shadow-sm z-10">
                     <Landmark size={28} className="text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Reconcile your accounts</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                    Match transactions to keep your books organized and accurate. <a href="#" className="text-[#13b6ec] hover:underline">Learn about Bank Reconciliation</a>
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Bank Reconciliation Section */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Bank Reconciliation</h2>
              <div className="flex shadow-sm">
                <button 
                    onClick={() => setShowAddBankModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-l-lg transition-colors flex items-center gap-2"
                >
                   Add Bank Account
                </button>
                <button 
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-2 rounded-r-lg border-l border-emerald-600 transition-colors"
                    onClick={() => setShowAddBankModal(true)}
                >
                   <ChevronDown size={16} />
                </button>
              </div>
           </div>

           {bankAccounts.length > 0 ? (
               <div className="flex flex-col gap-4">
                   {bankAccounts.map(account => (
                       <Card key={account.id} className="p-6 flex flex-col md:flex-row items-center gap-6 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                           <div className="size-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                               <Building size={24} />
                           </div>
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                               <div>
                                   <div className="flex items-center gap-2 mb-1">
                                       <h3 className="font-bold text-slate-900 text-lg">{account.accountName}</h3>
                                       {account.status === 'Connected' && (
                                           <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                               <RefreshCw size={10} className="animate-spin-slow" /> Live Feed
                                           </div>
                                       )}
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium">{account.bankName} •••• {account.lastFour}</p>
                                   <p className="text-xs text-slate-400 mt-1">{account.accountType}</p>
                               </div>
                               <div className="md:border-l md:border-slate-100 md:pl-6">
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bank Balance</p>
                                   <p className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                   <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                       <Check size={12} className="text-emerald-500" />
                                       Last reconciled: {account.lastReconciled || 'Never'}
                                   </p>
                               </div>
                               <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                    {account.transactionsToReconcile > 0 ? (
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-orange-600">{account.transactionsToReconcile} Transactions</p>
                                            <p className="text-xs text-slate-500">to reconcile</p>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1"><Check size={14} /> All caught up</p>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={() => openReconcileModal(account.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-emerald-600/20 shadow-lg"
                                        >
                                            Reconcile
                                        </Button>
                                        <button 
                                            onClick={() => handleDeleteAccount(account.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                               </div>
                           </div>
                       </Card>
                   ))}
               </div>
           ) : (
               <Card className="flex flex-col md:flex-row overflow-hidden border-slate-200">
                  <div className="w-full md:w-1/3 bg-slate-50 p-8 flex items-center justify-center border-r border-slate-200 relative overflow-hidden">
                     {/* Visual decoration representing the dashboard image in screenshot */}
                     <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-[240px] border border-slate-200 transform -rotate-2 relative z-10">
                        <div className="h-2 w-1/3 bg-slate-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-100 pb-1">
                                <span>Bank</span>
                                <span>Balance</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>MyBank</span>
                                <span className="text-[#13b6ec]">$0.00</span>
                            </div>
                        </div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl"></div>
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-center gap-3">
                     <h3 className="text-xl font-bold text-[#13b6ec]">A little bookkeeping goes a long way</h3>
                     <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
                        Don't wait until crunch time to get your books organized. Use Bank Reconciliation on a regular basis to keep your books organized throughout the year. <a href="#" className="text-[#13b6ec] hover:underline font-medium">Learn More</a>
                     </p>
                     <p className="text-slate-900 text-sm font-medium mt-2">
                        Select <span className="font-bold">Add Bank Account</span> to get started.
                     </p>
                  </div>
               </Card>
           )}
        </div>

        {/* Accounting Reports Section */}
        <div className="flex flex-col gap-4 relative">
           <div className="flex items-center gap-2 relative">
              <h2 className="font-bold text-slate-900">Accounting Reports</h2>
              
              {/* Handwritten Note Annotation */}
              <div className="absolute left-[160px] -top-3 hidden lg:flex items-center text-[#13b6ec]">
                 <svg width="40" height="20" viewBox="0 0 60 30" fill="none" className="transform translate-y-2">
                    <path d="M5 25 C 20 25, 30 15, 50 5" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                        </marker>
                    </defs>
                 </svg>
                 <span className="font-handwriting text-sm font-medium ml-2 -rotate-2 transform">Get a snapshot of your financial position</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => handleReportClick(report.id)}
                    className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4 text-left hover:border-[#13b6ec] hover:shadow-md transition-all group"
                 >
                    <div className="size-10 rounded bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-[#13b6ec] transition-colors">
                       <report.icon size={20} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-700 text-sm group-hover:text-[#13b6ec]">{report.title}</h3>
                          {report.updated && (
                             <span className="text-[10px] font-bold border border-slate-300 text-slate-500 px-1 rounded uppercase tracking-wide">Updated</span>
                          )}
                       </div>
                       <p className="text-xs text-slate-500 leading-relaxed">{report.desc}</p>
                    </div>
                 </button>
              ))}
           </div>
        </div>

        {/* Update Your Books Section */}
        <div className="flex flex-col gap-4 pb-12">
           <h2 className="font-bold text-slate-900">Update Your Books</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleReportClick('journal')}
                className="bg-white border border-slate-200 rounded-lg p-6 flex items-start gap-4 text-left hover:border-[#13b6ec] hover:shadow-md transition-all group"
              >
                 <div className="size-12 rounded bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-[#13b6ec] transition-colors">
                    <BookOpen size={24} />
                 </div>
                 <div className="flex-1 flex flex-col h-full">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-[#13b6ec]">Journal Entries</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                       Journal Entries allow you to create transactions and assign them to specific accounts. Use these and work with your accountant to keep your books balanced. <a href="#" className="text-[#13b6ec] hover:underline">Learn More</a>
                    </p>
                    <div className="mt-auto pt-2 text-right">
                       <span className="text-sm font-bold text-slate-600 group-hover:text-[#13b6ec]">View Your Journal Entries</span>
                    </div>
                 </div>
              </button>

              <button 
                onClick={() => handleReportClick('coa')}
                className="bg-white border border-slate-200 rounded-lg p-6 flex items-start gap-4 text-left hover:border-[#13b6ec] hover:shadow-md transition-all group"
              >
                 <div className="size-12 rounded bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-[#13b6ec] transition-colors">
                    <ClipboardList size={24} />
                 </div>
                 <div className="flex-1 flex flex-col h-full">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-[#13b6ec]">Chart of Accounts</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                       See a list of accounts your business has across Assets, Liabilities, Equity, Revenue and Expenses. Collaborate with your accountant to customize the accounts for your business. <a href="#" className="text-[#13b6ec] hover:underline">Learn More</a>
                    </p>
                    <div className="mt-auto pt-2 text-right">
                       <span className="text-sm font-bold text-slate-600 group-hover:text-[#13b6ec]">View Your Accounts</span>
                    </div>
                 </div>
              </button>
           </div>
        </div>

      </div>

      {/* Invite Modal */}
      {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Mail size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">Invite {inviteRole}</h3>
                            <p className="text-xs text-slate-500">Grant access to your books</p>
                          </div>
                      </div>
                      <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                      <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex items-start gap-2">
                          <Building size={16} className="shrink-0 mt-0.5" />
                          <p>You are inviting a <strong>{inviteRole}</strong> to collaborate on your <strong>GridBooks Demo</strong> account. They will receive an email instructions to join.</p>
                      </div>
                      <div className="space-y-1">
                          <Label>First Name (Optional)</Label>
                          <Input 
                              placeholder="e.g. John" 
                              value={inviteName} 
                              onChange={(e) => setInviteName(e.target.value)}
                          />
                      </div>
                      <div className="space-y-1">
                          <Label>Email Address</Label>
                          <Input 
                              type="email"
                              placeholder="name@firm.com" 
                              value={inviteEmail} 
                              onChange={(e) => setInviteEmail(e.target.value)}
                              autoFocus
                          />
                      </div>
                      <div className="space-y-1">
                          <Label>Personal Message</Label>
                          <textarea 
                              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[80px]"
                              placeholder="Hi, I'd like to invite you to access my books..."
                          ></textarea>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                      <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendInvite} disabled={!inviteEmail}>
                          <Send size={16} className="mr-2" /> Send Invitation
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Add Bank Modal */}
      {showAddBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddBankModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-900">Add Bank Account</h3>
                      <button onClick={() => setShowAddBankModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                      <div className="space-y-1">
                          <Label>Bank Name</Label>
                          <Input 
                              placeholder="e.g. Chase, Wells Fargo" 
                              value={newAccount.bankName} 
                              onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                              autoFocus
                          />
                      </div>
                      <div className="space-y-1">
                          <Label>Account Name</Label>
                          <Input 
                              placeholder="e.g. Business Checking" 
                              value={newAccount.accountName} 
                              onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <Label>Account Type</Label>
                              <Select 
                                  value={newAccount.accountType}
                                  onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
                              >
                                  <option value="Checking">Checking</option>
                                  <option value="Savings">Savings</option>
                                  <option value="Credit Card">Credit Card</option>
                              </Select>
                          </div>
                          <div className="space-y-1">
                              <Label>Current Balance</Label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                                  <Input 
                                      className="pl-7"
                                      type="number"
                                      placeholder="0.00" 
                                      value={newAccount.balance} 
                                      onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg flex items-start gap-2">
                          <Landmark size={16} className="shrink-0 mt-0.5" />
                          <p>We'll simulate a connection to this bank. In a real app, you would use Plaid or Yodlee.</p>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                      <Button variant="secondary" onClick={() => setShowAddBankModal(false)}>Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddAccount} disabled={!newAccount.bankName || !newAccount.accountName}>
                          Connect Account
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Reconcile Modal */}
      {showReconcileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowReconcileModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Scale size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Bank Reconciliation</h3>
                            <p className="text-xs text-slate-500">Match your bank transactions with your books</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">Chase Bank ...8842</Badge>
                        <button onClick={() => setShowReconcileModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                      </div>
                  </div>
                  
                  <div className="flex-1 flex overflow-hidden">
                      {/* Bank Side */}
                      <div className="flex-1 flex flex-col border-r border-slate-200">
                          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                              <span>Bank Transactions</span>
                              <span>Amount</span>
                          </div>
                          <div className="flex-1 overflow-y-auto p-2 space-y-2">
                              {[
                                  { date: 'Oct 24', desc: 'Office Depot', amt: -124.50 },
                                  { date: 'Oct 24', desc: 'Starbucks', amt: -14.25 },
                                  { date: 'Oct 23', desc: 'Client Payment - Acme', amt: 4500.00 },
                                  { date: 'Oct 22', desc: 'Transfer to Savings', amt: -1000.00 }
                              ].map((t, i) => (
                                  <div key={i} className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer hover:bg-blue-50 transition-colors group flex justify-between items-center bg-white">
                                      <div>
                                          <p className="font-bold text-sm text-slate-900">{t.desc}</p>
                                          <p className="text-xs text-slate-500">{t.date}</p>
                                      </div>
                                      <span className={`font-mono font-medium ${t.amt < 0 ? 'text-slate-900' : 'text-emerald-600'}`}>{t.amt.toFixed(2)}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Matching Center */}
                      <div className="w-12 bg-slate-100 border-r border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-300">
                          <ArrowRight size={20} />
                      </div>

                      {/* Books Side */}
                      <div className="flex-1 flex flex-col">
                          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                              <span>GridBooks Records</span>
                              <span>Amount</span>
                          </div>
                          <div className="flex-1 overflow-y-auto p-2 space-y-2">
                               {[
                                  { date: 'Oct 24', desc: 'Expense #102 - Supplies', amt: -124.50, match: true },
                                  { date: 'Oct 24', desc: 'Expense #103 - Meals', amt: -14.25, match: true },
                                  { date: 'Oct 23', desc: 'Payment for INV-2024-001', amt: 4500.00, match: true },
                              ].map((t, i) => (
                                  <div key={i} className={`p-3 rounded-lg border flex justify-between items-center transition-colors bg-white ${t.match ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
                                      <div>
                                          <p className="font-bold text-sm text-slate-900">{t.desc}</p>
                                          <p className="text-xs text-slate-500">{t.date}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`font-mono font-medium ${t.amt < 0 ? 'text-slate-900' : 'text-emerald-600'}`}>{t.amt.toFixed(2)}</span>
                                          {t.match && (
                                              <Button size="sm" className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700">Match</Button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                              <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-sm">
                                  No more records found. <a href="#" className="text-[#13b6ec]">Create Transaction</a>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="text-xs text-slate-500">
                          <span className="font-bold text-slate-900">3</span> matches found
                      </div>
                      <Button onClick={() => setShowReconcileModal(false)}>Finish Later</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}