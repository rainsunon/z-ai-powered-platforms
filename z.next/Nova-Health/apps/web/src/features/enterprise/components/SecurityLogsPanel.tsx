import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const securityLogs = [
  { user: 'Admin_SarahK', ip: '192.168.1.45 • Washington, US', icon: 'login', iconBg: 'bg-secondary-container text-primary', status: 'Successful Login', statusBg: 'bg-secondary-container/50 text-on-secondary-container', time: '2 mins ago' },
  { user: 'User_MarkP_X', ip: '45.22.112.9 • Unknown Location', icon: 'report_problem', iconBg: 'bg-error-container text-error', status: 'Failed Attempt', statusBg: 'bg-error-container/50 text-error', time: '14 mins ago' },
  { user: 'Sys_Automator', ip: 'Internal Cluster • Localhost', icon: 'admin_panel_settings', iconBg: 'bg-tertiary-container text-tertiary', status: 'Policy Change', statusBg: 'bg-tertiary-container/50 text-on-tertiary-container', time: '45 mins ago' },
];

export function SecurityLogsPanel() {
  return (
    <Card className="lg:col-span-7 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-extrabold font-headline text-on-surface">Recent Security Logs</h3>
          <p className="text-on-surface-variant text-sm">Real-time authentication and access stream</p>
        </div>
        <Button variant="link" className="text-primary font-bold text-sm p-0 h-auto">View All Logs</Button>
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
              <Badge className={`${log.statusBg} text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>{log.status}</Badge>
              <p className="text-[10px] text-on-surface-variant mt-1 uppercase">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
