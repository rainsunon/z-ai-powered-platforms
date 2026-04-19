import React from 'react';
import { useEmergencyContactsWithActions } from '@/store/useProfileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmergencyContactsCardProps {
  onAddContact: () => void;
}

export function EmergencyContactsCard({ onAddContact }: EmergencyContactsCardProps) {
  const { emergencyContacts, removeEmergencyContact } = useEmergencyContactsWithActions();

  return (
    <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          Emergency Contacts
        </CardTitle>
        <Button variant="ghost" onClick={onAddContact} className="text-primary text-sm font-bold hover:underline p-0 h-auto">
          <span className="material-symbols-outlined text-[16px] mr-1">add</span>
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50 group hover:bg-surface-container transition-colors">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${contact.isPrimary ? 'bg-primary/15' : 'bg-secondary/15'}`}>
                <span className={`material-symbols-outlined ${contact.isPrimary ? 'text-primary' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-headline font-bold text-on-surface">{contact.name}</p>
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter bg-primary-container/40 text-primary px-2 py-0.5 rounded-full">
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant">{contact.relationship} · {contact.phone}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest p-0">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center hover:bg-error/20 p-0"
                >
                  <span className="material-symbols-outlined text-[18px] text-error">delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
