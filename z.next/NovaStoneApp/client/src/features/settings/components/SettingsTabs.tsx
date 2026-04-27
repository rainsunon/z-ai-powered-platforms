import React from "react";
import { motion } from "motion/react";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";

export function ProfileTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-on-surface tracking-tight">Identity Registry</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="label-system mb-2 block">Legal Name</label>
          <input type="text" defaultValue="Alex Rivera" className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface focus:border-primary outline-none transition-all" />
        </div>
        <div>
          <label className="label-system mb-2 block">Communication End-point</label>
          <input type="email" defaultValue="alex.rivera@vanguard.sys" className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface focus:border-primary outline-none transition-all" />
        </div>
      </div>
      <button onClick={() => toast.success("Identity updated")} className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20">Sync Changes</button>
    </motion.div>
  );
}

export function SecurityTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-on-surface tracking-tight">Security Protocol</h3>
      <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg"><Smartphone size={24} /></div>
          <div>
            <h4 className="font-semibold text-on-surface">Multi-Factor Authentication</h4>
            <p className="text-xs text-on-surface-variant">Require 2FA/BetterAuth protocol for all system nodes.</p>
          </div>
        </div>
        <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
          <input type="checkbox" className="opacity-0 w-0 h-0 peer" id="mfa-toggle" defaultChecked />
          <label htmlFor="mfa-toggle" className="absolute top-0 left-0 right-0 bottom-0 bg-outline rounded-full cursor-pointer peer-checked:bg-primary transition-all before:absolute before:h-3 before:w-3 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-5"></label>
        </div>
      </div>
    </motion.div>
  );
}

export function AuditTab({ logs }: { logs: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-on-surface tracking-tight">Security Audit Trail</h3>
        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80">Export Registry</button>
      </div>
      <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high text-[10px] text-on-surface-variant font-bold uppercase tracking-widest border-b border-outline-variant">
            <tr>
              <th className="py-4 px-4 whitespace-nowrap">ID HASH</th>
              <th className="py-4 px-4 whitespace-nowrap">OPERATOR</th>
              <th className="py-4 px-4 whitespace-nowrap">ACTION / VECTOR</th>
              <th className="py-4 px-4 whitespace-nowrap">NETWORK IP</th>
              <th className="py-4 px-4 whitespace-nowrap">STATUS</th>
              <th className="py-4 px-4 whitespace-nowrap text-right">EPOCH TIMESTAMP</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-outline-variant text-on-surface-variant">
            {logs?.map((log: any) => (
              <tr key={log.id} className="hover:bg-surface-container-high/30 transition-colors">
                <td className="py-4 px-4"><span className="font-mono text-[10px] bg-surface-container-high px-2 py-1 rounded">{log.id.substring(3)}</span></td>
                <td className="py-4 px-4"><div className="flex flex-col"><span className="text-primary font-bold">{log.user}</span><span className="text-[9px] uppercase font-medium opacity-60 tracking-wider">Node User</span></div></td>
                <td className="py-4 px-4"><div className="flex flex-col"><span className="text-on-surface font-semibold">{log.action}</span><span className="text-[9px] text-on-surface-variant font-bold tracking-tighter uppercase">{log.category}</span></div></td>
                <td className="py-4 px-4"><span className="font-mono text-[10px] text-on-surface-variant opacity-80">{log.ip}</span></td>
                <td className="py-4 px-4"><span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'text-green-600 bg-green-500/10' : log.status === 'FAILED' ? 'text-rose-600 bg-rose-500/10' : 'text-amber-600 bg-amber-500/10'}`}>{log.status}</span></td>
                <td className="py-4 px-4 text-right"><div className="flex flex-col items-end"><span className="text-on-surface-variant font-mono text-[10px]">{new Date(log.timestamp).toLocaleDateString()}</span><span className="text-[9px] opacity-60">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function RBACTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-on-surface tracking-tight">RBAC Controls</h3>
      <p className="text-xs text-on-surface-variant">Define access tiers for node operators.</p>
      <div className="space-y-4">
        <RoleItem role="Administrator" description="Full access to all modules and configurations." active />
        <RoleItem role="Accountant" description="Access to sales, banking, and financial reporting." />
        <RoleItem role="Viewer" description="Read-only access to specific dashboards." />
      </div>
    </motion.div>
  );
}

function RoleItem({ role, description, active = false }: { role: string; description: string; active?: boolean }) {
  return (
    <div className={`p-5 border rounded-2xl flex items-center justify-between transition-all ${active ? 'border-primary/50 bg-primary/5' : 'border-outline-variant bg-surface-container-low'}`}>
      <div>
        <h4 className="font-bold text-on-surface text-sm tracking-tight">{role}</h4>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{description}</p>
      </div>
      <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80">{active ? 'Manage tier' : 'Allocate'}</button>
    </div>
  );
}
