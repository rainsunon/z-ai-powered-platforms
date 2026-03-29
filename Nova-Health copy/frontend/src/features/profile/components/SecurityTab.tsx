import React from 'react';
import { ToggleRow } from '@/components/ToggleRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SecurityTab() {
  const devices = [
    { name: 'MacBook Pro — Chrome', location: 'Austin, TX', time: 'Active now', icon: 'laptop_mac', active: true },
    { name: 'iPhone 15 Pro — Safari', location: 'Austin, TX', time: '2 hours ago', icon: 'phone_iphone', active: false },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Password Management */}
      <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-5 rounded-2xl bg-surface-container/50 flex items-center justify-between">
            <div>
              <p className="font-bold text-on-surface">Password</p>
              <p className="text-sm text-on-surface-variant mt-1">Last changed 14 days ago</p>
            </div>
            <Button variant="outline" className="bg-surface-container-high text-on-surface font-bold px-5 py-2.5 rounded-xl hover:bg-surface-container-highest border-0">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-5 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="font-bold text-on-surface">2FA is Enabled</p>
                <p className="text-sm text-on-surface-variant mt-1">Authenticator app configured</p>
              </div>
            </div>
            <Button variant="outline" className="bg-surface-container-high text-on-surface font-bold px-5 py-2.5 rounded-xl hover:bg-surface-container-highest border-0">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logged Devices */}
      <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>devices</span>
            Logged Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.name} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">{device.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface">{device.name}</p>
                    {device.active && <Badge className="w-2 h-2 rounded-full bg-primary px-0 py-0" />}
                  </div>
                  <p className="text-sm text-on-surface-variant">{device.location} · {device.time}</p>
                </div>
                {!device.active && (
                  <Button variant="ghost" className="text-error text-sm font-bold hover:underline p-0 h-auto">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
