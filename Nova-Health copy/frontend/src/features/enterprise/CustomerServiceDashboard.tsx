import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const tickets = [
  { id: '#NH-9021', user: 'James Dalton', initials: 'JD', initialsColor: 'bg-secondary-fixed text-on-secondary-fixed', subject: 'Prescription refill issue', priority: 'High', priorityColor: 'bg-error-container text-on-error-container', status: 'Open', statusColor: 'text-primary font-bold' },
  { id: '#NH-8944', user: 'Maria Rivera', initials: 'MR', initialsColor: 'bg-tertiary-fixed text-on-tertiary-fixed', subject: 'Portal login error', priority: 'Med', priorityColor: 'bg-surface-container-high text-on-surface-variant', status: 'In Progress', statusColor: 'text-on-surface-variant/40 font-bold' },
  { id: '#NH-8922', user: 'Sam Chen', initials: 'SC', initialsColor: 'bg-primary-fixed text-on-primary-fixed', subject: 'Insurance coverage query', priority: 'Low', priorityColor: 'bg-surface-container-high text-on-surface-variant', status: 'Open', statusColor: 'text-primary font-bold' },
];

const chats = [
  { name: 'Liam Foster', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDObq0ZRrxbmVaU4QDgS5y56js_SMNhz4Nb3eQgjT-mbapKPoo8eoUcdsHyfSScd-J3q06xkYpQGcAkZjAC5M46puVv0p3UVXlzHptJvv0ct8uM_8cAEiCX4cCkXo3_N0h4Lfjn0zQdMbdbDJTjGg1ZVsig2ofmhHSsimmM32HnwXHLY-HNp7476rwRBZ1Es2tjGsLleqqpm109OIb_NB6d7lWVHUakAZrlj0Unt9kWqqi58qAAFdatBc7ykHE7UjikwLnZ0W6DfY', message: '"When will my labs be available?"', time: '2m ago', online: true },
  { name: 'Elena Vance', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD17raGj0puvdU1l7020oqt5vb89YBz4jW1bIKLU7DQDgRiXF1tCh-aU3pv9ouLfojhxEKhqEFnofoQXuwrNYDA4qjSQvr7TKP85ovf1X1JjAdlFAVdEhfUbdJKB1NgDkNX9adZlGTfEt8Js7G-SJMl_OmSe9oFIQwXy2ND5ooojXtUxTlUA_hZakfvGxEDrllUioOCjpVnDscXEm_eqlSJX7m0C2nd8aQYoTsPbdlG4S41ssTCUGNwsCfwRS5VwRIhpuvNBDcOgdk', message: '"The document upload is failing..."', time: '14m ago', online: true },
  { name: 'Kevin Tran', initials: 'KT', message: '"Thank you for the help!"', time: '1h ago', online: false },
];

export function CustomerServiceDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="p-12 space-y-12 max-w-[1600px]">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tight text-primary">Service Dashboard</h2>
          <p className="text-on-surface-variant mt-2 text-lg">Welcome back, {user?.name?.split(' ')[0]}. Here is your operations snapshot.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-headline font-bold px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            <span>Internal Note</span>
          </button>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-95 transition-transform">
            <span className="material-symbols-outlined">add_circle</span>
            <span>New Support Case</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-48 group hover:bg-secondary-container transition-all duration-500 cursor-default">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary group-hover:text-on-secondary-container" style={{ fontSize: 32 }}>pending_actions</span>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant opacity-60">Real-time</span>
          </div>
          <div>
            <p className="text-4xl font-black font-headline text-on-surface">24</p>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-on-secondary-container/80">Active Support Tickets</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-48 group hover:bg-secondary-container transition-all duration-500 cursor-default">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary group-hover:text-on-secondary-container" style={{ fontSize: 32 }}>timer</span>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant opacity-60">Average</span>
          </div>
          <div>
            <p className="text-4xl font-black font-headline text-on-surface">12m 40s</p>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-on-secondary-container/80">Response Time</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-48 group hover:bg-secondary-container transition-all duration-500 cursor-default">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary group-hover:text-on-secondary-container" style={{ fontSize: 32 }}>forum</span>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant opacity-60">Active Now</span>
          </div>
          <div>
            <p className="text-4xl font-black font-headline text-on-surface">8</p>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-on-secondary-container/80">Open User Chats</p>
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Support Tickets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-headline tracking-tight">Recent Support Tickets</h3>
            <button className="text-primary font-bold text-sm hover:underline">View All Tickets</button>
          </div>
          <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">Ticket ID</th>
                  <th className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">User</th>
                  <th className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">Subject</th>
                  <th className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60 text-center">Priority</th>
                  <th className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-6 font-headline font-bold text-sm">{ticket.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${ticket.initialsColor} flex items-center justify-center text-[10px] font-bold`}>{ticket.initials}</div>
                        <span className="text-sm font-medium">{ticket.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm">{ticket.subject}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 ${ticket.priorityColor} text-[10px] font-black uppercase tracking-tighter rounded-full`}>{ticket.priority}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-sm ${ticket.statusColor}`}>{ticket.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Conversations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-headline tracking-tight">Active Chats</h3>
            <span className="w-2.5 h-2.5 bg-primary-container rounded-full animate-pulse"></span>
          </div>
          <div className="space-y-4">
            {chats.map((chat) => (
              <div key={chat.name} className="bg-surface-container-lowest/60 backdrop-blur-md p-5 rounded-[1.5rem] flex items-center gap-4 border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
                <div className="relative">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">{chat.initials}</div>
                  )}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 ${chat.online ? 'bg-primary-container' : 'bg-outline-variant'} border-2 border-surface-container-lowest rounded-full`}></span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm font-headline">{chat.name}</p>
                    <span className="text-[10px] text-on-surface-variant/60 font-medium">{chat.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-1">{chat.message}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/chat')}
              className="w-full py-4 text-sm font-bold text-on-surface-variant bg-surface-container/40 rounded-2xl hover:bg-surface-container transition-colors border-2 border-dashed border-outline-variant/30 mt-4"
            >
              Go to Messenger
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant/60 font-medium">
          <p>&copy; 2024 NovaHealth Systems. All sensitive health data is encrypted.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">HIPAA Compliance</span>
            <span className="hover:text-primary transition-colors cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
