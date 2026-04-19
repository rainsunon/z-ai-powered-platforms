import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwitchAccountModal } from '@/components/SwitchAccountModal';

const familyMembers = [
  {
    id: 'sarah',
    name: 'Sarah Rivera',
    role: 'Account Owner',
    age: 42,
    avatar: 'face_4',
    color: 'bg-primary',
    gradient: 'from-primary to-primary/70',
    bloodType: 'A+',
    lastCheckup: 'Oct 12, 2024',
    vaccination: 'Up to date',
    status: 'Active',
    permissions: 'Full Access',
  },
  {
    id: 'leo',
    name: 'Leo Rivera',
    role: 'Teen Member',
    age: 14,
    avatar: 'face_3',
    color: 'bg-tertiary',
    gradient: 'from-tertiary to-tertiary/70',
    bloodType: 'O+',
    lastCheckup: 'Sep 28, 2024',
    vaccination: 'Up to date',
    status: 'Active',
    permissions: 'Limited Access',
  },
  {
    id: 'maya',
    name: 'Maya Rivera',
    role: 'Child Member',
    age: 8,
    avatar: 'face_5',
    color: 'bg-secondary',
    gradient: 'from-secondary to-secondary/70',
    bloodType: 'A+',
    lastCheckup: 'Nov 03, 2024',
    vaccination: 'Due Dec 2024',
    status: 'Active',
    permissions: 'View Only',
  },
];

const pendingInvitations = [
  { name: 'Carlos Rivera', email: 'carlos.r@email.com', sentDate: 'Oct 18, 2024', status: 'Pending' },
];

export function FamilyPermissions() {
  const navigate = useNavigate();
  const [switchModal, setSwitchModal] = useState<{ open: boolean; member: typeof familyMembers[0] | null }>({ open: false, member: null });

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => navigate('/family')} className="p-2 rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Family Management</span>
          </div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Manage Family Permissions</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Control access levels, manage health data sharing, and configure permissions for each family member.</p>
        </div>
      </section>

      {/* Household Overview + Family Vault */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Household Overview */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">groups</span>
            Household Overview
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-primary" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(3 / 4) * 314.16} ${314.16}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-headline text-on-surface">3/4</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Slots</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Active Members</span>
                <span className="text-sm font-bold text-on-surface">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Pending Invites</span>
                <span className="text-sm font-bold text-on-surface">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Available Slots</span>
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Plan Limit</span>
                <span className="text-sm font-bold text-on-surface">4 members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Family Vault */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
            Family Vault
          </h3>
          <p className="text-sm text-on-surface-variant mb-6">All family health data is encrypted with AES-256 and stored securely. Only authorized members can access shared records.</p>
          <div className="space-y-3">
            {[
              { icon: 'lock', label: 'End-to-end encryption', desc: 'All data encrypted in transit & at rest' },
              { icon: 'verified_user', label: 'HIPAA Compliant', desc: 'Full healthcare privacy compliance' },
              { icon: 'admin_panel_settings', label: 'Role-based access', desc: 'Granular permission controls per member' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container/50">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <div>
                  <p className="text-sm font-bold text-on-surface">{label}</p>
                  <p className="text-xs text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Cards Grid */}
      <section>
        <h3 className="font-headline font-bold text-2xl text-on-surface mb-6">Family Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {familyMembers.map((member) => (
            <div key={member.id} className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500">
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${member.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{member.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg">{member.name}</h4>
                    <p className="text-white/80 text-sm">{member.role}</p>
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Age</p>
                    <p className="font-headline font-bold text-on-surface mt-1">{member.age}</p>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Blood Type</p>
                    <p className="font-headline font-bold text-on-surface mt-1">{member.bloodType}</p>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Last Checkup</p>
                    <p className="font-headline font-bold text-on-surface mt-1 text-sm">{member.lastCheckup}</p>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Access Level</p>
                    <p className="font-headline font-bold text-primary mt-1 text-sm">{member.permissions}</p>
                  </div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-bold text-primary">{member.status}</span>
                </div>
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/family/permissions/${member.id}`)}
                    className="w-full primary-gradient text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                    Manage Permissions
                  </button>
                  <button
                    onClick={() => navigate(`/family/health-summary/${member.id}`)}
                    className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">monitor_heart</span>
                    View Health Summary
                  </button>
                  <button
                    onClick={() => setSwitchModal({ open: true, member })}
                    className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">swap_horiz</span>
                    Switch Profile
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Member Placeholder */}
          <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] flex flex-col items-center justify-center p-10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group min-h-[350px]">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">person_add</span>
            </div>
            <p className="font-headline font-bold text-on-surface-variant group-hover:text-primary transition-colors">Add Family Member</p>
            <p className="text-xs text-on-surface-variant mt-1">1 slot available</p>
          </div>
        </div>
      </section>

      {/* Account Invitations */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">mail</span>
          Account Invitations
        </h3>
        {pendingInvitations.length > 0 ? (
          <div className="space-y-4">
            {pendingInvitations.map((inv) => (
              <div key={inv.email} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/15 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-tertiary">hourglass_top</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{inv.name}</p>
                  <p className="text-sm text-on-surface-variant">{inv.email}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Sent {inv.sentDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    {inv.status}
                  </span>
                  <button className="text-sm font-bold text-error hover:underline">Revoke</button>
                  <button className="text-sm font-bold text-primary hover:underline">Resend</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">No pending invitations.</p>
        )}
      </section>

      {/* Switch Account Modal */}
      {switchModal.member && (
        <SwitchAccountModal
          open={switchModal.open}
          onClose={() => setSwitchModal({ open: false, member: null })}
          onConfirm={() => setSwitchModal({ open: false, member: null })}
          memberName={switchModal.member.name}
          memberRole={switchModal.member.role}
          memberAvatar={switchModal.member.avatar}
          memberColor={switchModal.member.color}
        />
      )}
    </div>
  );
}
