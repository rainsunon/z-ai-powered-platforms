import React from 'react';

const securityLogs = [
  { user: 'Admin_SarahK', ip: '192.168.1.45 • Washington, US', icon: 'login', iconBg: 'bg-secondary-container text-primary', status: 'Successful Login', statusBg: 'bg-secondary-container/50 text-on-secondary-container', time: '2 mins ago' },
  { user: 'User_MarkP_X', ip: '45.22.112.9 • Unknown Location', icon: 'report_problem', iconBg: 'bg-error-container text-error', status: 'Failed Attempt', statusBg: 'bg-error-container/50 text-error', time: '14 mins ago' },
  { user: 'Sys_Automator', ip: 'Internal Cluster • Localhost', icon: 'admin_panel_settings', iconBg: 'bg-tertiary-container text-tertiary', status: 'Policy Change', statusBg: 'bg-tertiary-container/50 text-on-tertiary-container', time: '45 mins ago' },
];

const accessRequests = [
  { name: 'Dr. Julianne Davis', initials: 'JD', department: 'Neurology', role: 'Medical Staff', date: 'Oct 12, 2023' },
  { name: 'Richard Sterling', initials: 'RS', department: 'Finance', role: 'Billing Manager', date: 'Oct 11, 2023' },
];

export function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full bg-surface-container-low min-h-full">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary font-bold text-sm tracking-widest uppercase">NovaHealth Lumina</span>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mt-1">Admin Command Center</h2>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-highest px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-xs font-bold text-on-surface-variant uppercase">All Systems Nominal</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-2xl">
              <span className="material-symbols-outlined">dns</span>
            </div>
            <span className="text-primary font-bold text-xs uppercase">Server Uptime</span>
          </div>
          <div className="mt-8">
            <div className="text-3xl font-black font-headline text-on-surface">99.9%</div>
            <p className="text-on-surface-variant text-sm mt-1">Operational (30 Days)</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-2xl">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <span className="text-tertiary font-bold text-xs uppercase">API Latency</span>
          </div>
          <div className="mt-8">
            <div className="text-3xl font-black font-headline text-on-surface">240ms</div>
            <p className="text-on-surface-variant text-sm mt-1">Avg Response Time</p>
          </div>
        </div>

        <div className="bg-primary text-on-primary p-6 rounded-[2rem] shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-start">
            <div className="p-3 bg-white/20 rounded-2xl">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <span className="font-bold text-xs uppercase opacity-80">Security Shield</span>
          </div>
          <div className="relative z-10 mt-8">
            <div className="text-3xl font-black font-headline">12,482</div>
            <p className="text-sm mt-1 opacity-90">Blocked Threats (24h)</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined" style={{ fontSize: '9rem' }}>verified_user</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-outline-variant/30 text-on-surface-variant rounded-2xl">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <span className="text-on-surface-variant font-bold text-xs uppercase">Active Nodes</span>
          </div>
          <div className="mt-8 flex items-end gap-1 h-12">
            {[60, 80, 70, 90, 100].map((h, i) => (
              <div key={i} className="w-2 rounded-full" style={{ height: `${h}%`, opacity: 0.2 + i * 0.2, backgroundColor: 'var(--tw-primary, #066e00)' }}></div>
            ))}
            <div className="flex-1 ml-2">
              <div className="text-xl font-black font-headline text-on-surface">32/32</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Security Logs */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-extrabold font-headline text-on-surface">Recent Security Logs</h3>
              <p className="text-on-surface-variant text-sm">Real-time authentication and access stream</p>
            </div>
            <button className="text-primary font-bold text-sm hover:underline">View All Logs</button>
          </div>
          <div className="space-y-4">
            {securityLogs.map((log) => (
              <div key={log.user} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${log.iconBg} flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{log.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{log.user}</p>
                    <p className="text-xs text-on-surface-variant">{log.ip}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`${log.statusBg} text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>{log.status}</span>
                  <p className="text-[10px] text-on-surface-variant mt-1 uppercase">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts + API Health */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-highest rounded-[2.5rem] p-8">
            <h3 className="text-xl font-extrabold font-headline text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">warning</span>
              <span>System Alerts</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-5 rounded-3xl border-l-4 border-primary">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Upcoming Maintenance</p>
                <p className="text-sm font-semibold text-on-surface">Database clustering optimization scheduled for 02:00 UTC.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant">Ref: MH-4429</span>
                  <button className="text-xs font-bold text-primary">Dismiss</button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-3xl border-l-4 border-error">
                <p className="text-xs font-bold text-error uppercase tracking-widest mb-1">Critical Storage</p>
                <p className="text-sm font-semibold text-on-surface">Cluster B-12 storage reaching 92% capacity threshold.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant">Impact: Data Logging</span>
                  <button className="px-3 py-1 bg-error text-white rounded-full text-xs font-bold">Investigate</button>
                </div>
              </div>
            </div>
          </div>

          {/* API Health Sync */}
          <div className="bg-gradient-to-br from-inverse-surface to-[#2a3326] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold font-headline mb-4">API Health Sync</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-60">FHIR Endpoint</span>
                  <span className="text-secondary-fixed">Live</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                  <div className="bg-secondary-fixed h-full w-[94%] rounded-full shadow-[0_0_8px_rgba(159,248,136,0.6)]"></div>
                </div>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="opacity-60">Auth Service</span>
                  <span className="text-secondary-fixed">Live</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                  <div className="bg-secondary-fixed h-full w-[98%] rounded-full shadow-[0_0_8px_rgba(159,248,136,0.6)]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* User Access Requests Table */}
        <div className="lg:col-span-12 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-extrabold font-headline text-on-surface">User Access Requests</h3>
              <p className="text-on-surface-variant text-sm">Approval queue for new personnel accounts</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                  <th className="pb-4 pl-4">Requestor</th>
                  <th className="pb-4">Department</th>
                  <th className="pb-4">Proposed Role</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {accessRequests.map((req) => (
                  <tr key={req.name}>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary">{req.initials}</div>
                        <span className="font-semibold">{req.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">{req.department}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold">{req.role}</span>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">{req.date}</td>
                    <td className="py-4 pr-4 text-right space-x-2">
                      <button className="p-2 text-error hover:bg-error-container rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">block</span>
                      </button>
                      <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md transition-all">Approve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-12 flex flex-col items-center justify-center border-t border-outline-variant/10 gap-2 opacity-50">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">NovaHealth Encryption Standard v4.2</p>
        <p className="text-[10px] text-on-surface-variant">Secure Session: XA-4819-B2 &bull; Connected to Primary Cluster</p>
      </footer>
    </div>
  );
}
