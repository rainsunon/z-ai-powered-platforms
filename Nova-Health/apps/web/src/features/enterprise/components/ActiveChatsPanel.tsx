import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const chats = [
  { name: 'Liam Foster', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDObq0ZRrxbmVaU4QDgS5y56js_SMNhz4Nb3eQgjT-mbapKPoo8eoUcdsHyfSScd-J3q06xkYpQGcAkZjAC5M46puVv0p3UVXlzHptJvv0ct8uM_8cAEiCX4cCkXo3_N0h4Lfjn0zQdMbdbDJTjGg1ZVsig2ofmhHSsimmM32HnwXHLY-HNp7476rwRBZ1Es2tjGsLleqqpm109OIb_NB6d7lWVHUakAZrlj0Unt9kWqqi58qAAFdatBc7ykHE7UjikwLnZ0W6DfY', message: '"When will my labs be available?"', time: '2m ago', online: true },
  { name: 'Elena Vance', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD17raGj0puvdU1l7020oqt5vb89YBz4jW1bIKLU7DQDgRiXF1tCh-aU3pv9ouLfojhxEKhqEFnofoQXuwrNYDA4qjSQvr7TKP85ovf1X1JjAdlFAVdEhfUbdJKB1NgDkNX9adZlGTfEt8Js7G-SJMl_OmSe9oFIQwXy2ND5ooojXtUxTlUA_hZakfvGxEDrllUioOCjpVnDscXEm_eqlSJX7m0C2nd8aQYoTsPbdlG4S41ssTCUGNwsCfwRS5VwRIhpuvNBDcOgdk', message: '"The document upload is failing..."', time: '14m ago', online: true },
  { name: 'Kevin Tran', initials: 'KT', message: '"Thank you for the help!"', time: '1h ago', online: false },
];

export function ActiveChatsPanel() {
  const navigate = useNavigate();
  return (
    <Card className="space-y-6 border-0">
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
        <Button
          onClick={() => navigate('/chat')}
          className="w-full py-4 text-sm font-bold text-on-surface-variant bg-surface-container/40 rounded-2xl hover:bg-surface-container transition-colors border-2 border-dashed border-outline-variant/30 mt-4 h-auto"
          variant="outline"
        >
          Go to Messenger
        </Button>
      </div>
    </Card>
  );
}
