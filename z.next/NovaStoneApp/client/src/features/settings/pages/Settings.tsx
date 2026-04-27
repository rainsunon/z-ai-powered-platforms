import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Bell, Lock, UserCircle, LogOut, Users, History } from "lucide-react";
import { ProfileTab, SecurityTab, AuditTab, RBACTab } from "../components/SettingsTabs";
import { useAuthStore } from "@/features/auth/store/authStore";
import { api } from "@/lib/api";

function TabButton({ icon: Icon, label, id, active, onClick }: { icon: any; label: string; id: string; active: string; onClick: (val: string) => void }) {
  const isActive = active === id;
  return (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-xs uppercase tracking-widest ${isActive ? "bg-surface-container border border-outline-variant text-primary shadow-lg shadow-black/5" : "text-on-surface-variant hover:text-on-surface"}`}>
      <Icon size={16} />{label}
    </button>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");
  const logout = useAuthStore((s) => s.logout);
  const { data: logs } = useQuery({ queryKey: ["audit-logs"], queryFn: () => api.get("/audit-logs") });

  return (
    <div className="p-8 space-y-8">
      <div><h2 className="text-3xl font-semibold tracking-tight text-on-surface font-sans">Registry Management</h2><p className="text-on-surface-variant text-sm">System configuration and security parameters</p></div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1">
          <TabButton icon={UserCircle} label="User Profile" id="profile" active={activeTab} onClick={setActiveTab} />
          <TabButton icon={Lock} label="Security Protocol" id="security" active={activeTab} onClick={setActiveTab} />
          <TabButton icon={Shield} label="RBAC Controls" id="rbac" active={activeTab} onClick={setActiveTab} />
          <TabButton icon={History} label="System Audit" id="audit" active={activeTab} onClick={setActiveTab} />
          <TabButton icon={Bell} label="Telemetry Prefs" id="notifications" active={activeTab} onClick={setActiveTab} />
          <div className="pt-4 mt-4 border-t border-outline-variant">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors font-bold text-xs uppercase tracking-widest"><LogOut size={16} />Session: EXIT</button>
          </div>
        </aside>
        <main className="flex-1 bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm min-h-[500px]">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "audit" && <AuditTab logs={logs} />}
          {activeTab === "rbac" && <RBACTab />}
        </main>
      </div>
    </div>
  );
}
