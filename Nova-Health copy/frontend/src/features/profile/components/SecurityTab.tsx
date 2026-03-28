import React from 'react';
import { ToggleRow } from '@/components/ToggleRow';

export function SecurityTab() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Password Management */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
          Password Management
        </h3>
        <div className="p-5 rounded-2xl bg-surface-container/50 flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface">Password</p>
            <p className="text-sm text-on-surface-variant mt-1">Last changed 14 days ago</p>
          </div>
          <button className="bg-surface-container-high text-on-surface font-bold px-5 py-2.5 rounded-xl hover:bg-surface-container-highest transition-colors text-sm">
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          Two-Factor Authentication
        </h3>
        <div className="p-5 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <p className="font-bold text-on-surface">2FA is Enabled</p>
              <p className="text-sm text-on-surface-variant mt-1">Authenticator app configured</p>
            </div>
          </div>
          <button className="bg-surface-container-high text-on-surface font-bold px-5 py-2.5 rounded-xl hover:bg-surface-container-highest transition-colors text-sm">
            Manage
          </button>
        </div>
      </div>

      {/* Logged Devices */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>devices</span>
          Logged Devices
        </h3>
        <div className="space-y-4">
          {[
            { name: 'MacBook Pro — Chrome', location: 'Austin, TX', time: 'Active now', icon: 'laptop_mac', active: true },
            { name: 'iPhone 15 Pro — Safari', location: 'Austin, TX', time: '2 hours ago', icon: 'phone_iphone', active: false },
          ].map((device) => (
            <div key={device.name} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">{device.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-on-surface">{device.name}</p>
                  {device.active && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                </div>
                <p className="text-sm text-on-surface-variant">{device.location} · {device.time}</p>
              </div>
              {!device.active && (
                <button className="text-error text-sm font-bold hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
