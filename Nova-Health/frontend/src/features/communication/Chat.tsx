import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationItem } from './components/ConversationItem';
import { ChatHeader } from './components/ChatHeader';
import { MessageDateDivider, ReceivedMessage, SentMessage, DocumentMessage, TypingIndicator } from './components/ChatMessages';
import { ChatInputBar } from './components/ChatInputBar';
import { DoctorProfileCard } from './components/DoctorProfileCard';
import { SharedFilesPanel } from './components/SharedFilesPanel';

const conversations = [
  {
    name: 'Dr. Sarah Jenkins', isActive: true, isOnline: true, time: 'Active',
    lastMessage: 'Your blood work looks great, Alex!',
    avatarSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiyDMvDbAGr4JX82bDPQwT4-Ip7fLh0dQA7wNF4ogdxCiZQajDpypQHtVvlkxkvhE69d_H92Hx1FJ9sSzcpScPAOBDMTrmYLNkDyvyXh4paPhLZktbe1qVuR5niHHoA4k8HX5YDhHqF4thubJl07Iv7kvPZKMuxlUuhLN6C3L3znTpdk4JUVWSxca1n4bJS2EPJt_8WEuhosqapPbhAu0HAZ4rf0PY4jXizIP8xLotFixXXTpamytPynsr9eHVMzQ7w4eiO-KNXxY',
  },
  {
    name: 'Dr. Michael Chen', isOnline: false, time: '2h ago', unreadCount: 2,
    lastMessage: "Let's schedule the follow-up.",
    avatarSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD69KBiywcQK9KDv-mOM4ocR9kOTz5Em34T3B55Vxxi_NZsYc2NvpSQMEbhRQsvzWtqv7ZDo1ARVBa1wmZ38KT81qYmnFMtSbR6F08blN9TG80ZRHDAZpmAIc8ZuZTjx8zi_y-brqCcciKrK8o0CAYr2CgSCbDddqztYEGR54pUnOJWOeX6xRWLKQP6BmkP_4-vBwusAQBgNNDdxXojfHI6kCfKIh19dUUh_mpHacRmRgJ2G7nUnHX3Ms39FuJYZHxl4vu11vkCWZc',
  },
  {
    name: 'Nova Support', isOnline: true, time: 'Yesterday',
    lastMessage: 'Your insurance claim was approved.',
    avatarInitials: 'NS',
  },
  {
    name: 'Elena Vance', isOnline: false, time: 'Mon',
    lastMessage: 'Did you receive the vitamins?',
    avatarSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvgdPCMELniMF589B8_VKbNgZHtujSNlbSUMxs8fEbque9JUj8vo4xTqPlTK5VDoZDuZwhXo04JMutBpavaswjmXLz4UIp2BIvVvfKGNCF2wLl80mXB7N8bvrAtTr9GCrHAuNKjea-ITSlGLWhhFv_PQ3K-ab3J5DsoBN4ZuVb4keZrRPhDILC1CkMdmEMxYVSMuzB_pzjQ7nI8b99YmJW-bBhAL5vG82b73nKjLHCXCU1AlBNBiF3QXtiBWGpn08D_SF2Oma7b6U',
  },
];

const sharedFiles = [
  { name: 'Lab_Results.pdf', date: 'Oct 20', size: '1.2 MB', icon: 'picture_as_pdf', iconBgClass: 'bg-error-container/20', iconColorClass: 'text-error' },
  { name: 'X-Ray_Chest.jpg', date: 'Oct 18', size: '4.5 MB', icon: 'image', iconBgClass: 'bg-primary-container/10', iconColorClass: 'text-primary' },
  { name: 'Vitals_Log.csv', date: 'Oct 15', size: '42 KB', icon: 'description', iconBgClass: 'bg-tertiary-container/20', iconColorClass: 'text-tertiary' },
];

const DR_JENKINS_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPkR79QgD5Kxm6BnC6-W64h6FgDvtwgArS-s3N2t_0ZuGyRiz48rmO4BX633H-MlvulzMEq-VcqR-ufP0phxtm8CPP41iFKTHggBhDxy0It0cInnWzny51rMF6zx8R8Qf30eu6UUkURlB7j-xacvkbyO9jmU9zndtV4y6lj6IoW5jby-AKucn77r0Ltyst83YQrKytvG3p1nrc8HM73N5n09jPXl-_i6TjkbJEVmCS3cL47Bp2gddkQs-cdsWefygfn5b6PuTHxWU';
const DR_JENKINS_HEADER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS6KQm8ao_41Bc5GGxQFjqUHHvt8JGeWVYhsT_0lvD5G7OUJDHk4zAI7FfMFGgx4TRI2x8_kn41eKG3rVAHoIkakF6-WJDDpOoBBDH3K5Ie1y3DyE2R2z0mSlLWOtGTS2NBqkoWDjGmuoLWUfnyorQXEVtNWrRetR-uonNE7cuxkCNTO64x2iYiwzrWTvZdPEWo5gDuOw3awx9Zso-fxicNYmDmX73xCzFfW3Og6tdXChZYmalwvvUIxUp1e3nswvzstF6OKIJcx0';
const DR_JENKINS_DOC_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWQPJwIQNyobNbQWk-uvCbxizlS_gTREoMl-ZUalTxJdK_RKcNgpFN6dj3uaoTI1BNpHgvFpFdqUS1E1cqbOU-q7Iwm2Y8pRJ6iIanYZPLjtbaMTcFK2fR-ecPQa8sXXlpgRjfzgqvlrASBIoqWaVahSyWC_wbSYoTYRKoc54PuqEsaYoEPy6ZCt1pU_NovjWY4R4p5qTpKSeD9SIh6RO_5ScjASsfWHpU2PrQxNuCOjLYnn-IKH7D3FRf1IdZrooqS3n9-Y_iWL8';
const DR_JENKINS_PROFILE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBruVPCrZIsrWWvHMkflF6W-wvY0tzZSkc4O2X1wVWCtIg1kgd6R3rF033eDDCqiWd78dCvrCnGixKqEjcERjWBUKUHboTpV2ZwOKPnKCkMVssjSteq04tAVA-9Z-MdLOFRtMSdKX45fRt98sZHSWD5U222zhV4dAixLBnP_1psJwuXMWTUfb9CxKujM8DyvrEoyh_KFE4eKzvmvpZsOhxvyegHqa0BJbbCxkl0sVSr7pZzUCIxmS23m99irXBujkaG7KIUpT14sq8';

export function Chat() {
  return (
    <div className="flex-1 flex overflow-hidden gap-6 h-[calc(100vh-8rem)]">
      {/* Conversation List Panel */}
      <section className="w-80 flex flex-col bg-surface-container-lowest rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.04)] overflow-hidden shrink-0">
        <div className="p-6 border-b border-surface-variant/20">
          <h2 className="font-headline font-bold text-xl text-on-surface">Messages</h2>
          <Tabs defaultValue="all">
            <TabsList className="mt-4 bg-transparent h-auto gap-2 p-0">
              <TabsTrigger value="all" className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-secondary-container data-active:text-on-secondary-container bg-surface-container text-stone-500">All</TabsTrigger>
              <TabsTrigger value="doctors" className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-container data-active:text-on-secondary-container bg-surface-container text-stone-500">Doctors</TabsTrigger>
              <TabsTrigger value="support" className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-container data-active:text-on-secondary-container bg-surface-container text-stone-500">Support</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          {conversations.map((conv) => (
            <ConversationItem key={conv.name} {...conv} />
          ))}
        </div>
      </section>

      {/* Chat Main Window */}
      <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] overflow-hidden relative">
        <ChatHeader
          doctorName="Dr. Sarah Jenkins"
          specialty="Cardiologist"
          avatarSrc={DR_JENKINS_HEADER_AVATAR}
          isOnline
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low/30 via-transparent to-transparent">
          <MessageDateDivider date="Tuesday, Oct 24" />

          <ReceivedMessage
            avatarSrc={DR_JENKINS_AVATAR}
            avatarAlt="Dr. Sarah Jenkins"
            messages={[
              "Hello Alex, I've reviewed your latest telemetry data. Everything looks very stable!",
              "How have you been feeling after the new medication adjustment?",
            ]}
            time="10:45 AM"
          />

          <SentMessage
            message="I'm feeling much more energetic, Dr. Jenkins. No more shortness of breath during my morning walks!"
            time="10:52 AM"
            isRead
          />

          <DocumentMessage
            avatarSrc={DR_JENKINS_DOC_AVATAR}
            avatarAlt="Dr. Sarah Jenkins"
            fileName="Weekly_Report_Oct.pdf"
            fileSize="2.4 MB"
            fileDescription="Cardiac Summary"
            caption="Here is the detailed summary. I've highlighted the heart rate trends in green."
            time="11:05 AM"
          />

          <TypingIndicator />
        </div>

        <ChatInputBar />
      </section>

      {/* Activity Sidebar (Right) - Bento Style */}
      <section className="w-72 flex flex-col gap-6 hidden xl:flex shrink-0">
        <DoctorProfileCard
          name="Dr. Sarah Jenkins"
          hospital="St. Jude Medical Center"
          avatarSrc={DR_JENKINS_PROFILE_AVATAR}
          experience="12 Years"
          rating="4.9/5.0"
        />
        <SharedFilesPanel files={sharedFiles} />
      </section>
    </div>
  );
}
