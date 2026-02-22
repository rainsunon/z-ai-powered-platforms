// src/features/ai-chat/components/MessageList.tsx
import React from 'react';

interface Message {
    role: string;
    content: string;
    time: string;
}

interface MessageListProps {
    messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
            {messages.map((msg, i) => (
                <div key={i} className={`flex gap-6 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 shadow-xl overflow-hidden ${msg.role === 'assistant' ? 'bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700' : ''}`}>
                        {msg.role === 'assistant' ? (
                            <span className="material-icons text-primary dark:text-primary-400 text-2xl">smart_toy</span>
                        ) : (
                            <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" alt="User Avatar" />
                        )}
                    </div>
                    <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-6 rounded-3xl shadow-2xl ${msg.role === 'assistant' ? 'bg-white dark:bg-slate-800 rounded-tl-none text-slate-700 dark:text-slate-200' : 'bg-primary text-white rounded-tr-none'}`}>
                            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-white/60 dark:text-slate-500 font-black uppercase tracking-widest drop-shadow-sm px-1">{msg.time}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
