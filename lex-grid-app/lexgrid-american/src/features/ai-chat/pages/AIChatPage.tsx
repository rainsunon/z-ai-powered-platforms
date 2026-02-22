// src/features/ai-chat/pages/AIChatPage.tsx
import React, { useState } from 'react';
import Layout from '../../../components/layout/Layout';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import { IntelligenceSidebar } from '../components/IntelligenceSidebar';

interface AIChatPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const AIChatPage: React.FC<AIChatPageProps> = ({ theme, toggleTheme }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello Julian. I have analyzed the initial documents regarding the Ontario residential tenancy dispute. Based on the Residential Tenancies Act (2006), specifically Section 48, I can help you determine the validity of the N12 notice issued.', time: '10:42 AM' },
        { role: 'user', content: "I need to cross-reference the landlord's 'good faith' claim with previous LTB rulings in the GTA area. Can we also look at similar cases from 2023?", time: '10:45 AM' },
        { role: 'assistant', content: "Searching LTB database for 2023 GTA 'Good Faith' N12 cases... Found 142 relevant rulings. I've highlighted the most applicable ones below.", time: '10:46 AM' }
    ]);

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                {/* Chat Main Area */}
                <div className="flex-1 flex flex-col bg-brand dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
                    <ChatHeader />
                    <MessageList messages={messages} />
                    <ChatInput />
                </div>
                <IntelligenceSidebar />
            </div>
        </Layout>
    );
};

export default AIChatPage;
