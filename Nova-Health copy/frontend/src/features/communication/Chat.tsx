import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationItem } from './components/ConversationItem';
import { SharedFileItem } from './components/SharedFileItem';

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
        {/* Chat Header */}
        <div className="px-8 py-5 bg-white/50 backdrop-blur-md flex items-center justify-between border-b border-surface-variant/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img alt="Dr. Sarah Jenkins" className="w-12 h-12 rounded-full object-cover ring-4 ring-primary-container/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS6KQm8ao_41Bc5GGxQFjqUHHvt8JGeWVYhsT_0lvD5G7OUJDHk4zAI7FfMFGgx4TRI2x8_kn41eKG3rVAHoIkakF6-WJDDpOoBBDH3K5Ie1y3DyE2R2z0mSlLWOtGTS2NBqkoWDjGmuoLWUfnyorQXEVtNWrRetR-uonNE7cuxkCNTO64x2iYiwzrWTvZdPEWo5gDuOw3awx9Zso-fxicNYmDmX73xCzFfW3Og6tdXChZYmalwvvUIxUp1e3nswvzstF6OKIJcx0" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-lg text-on-surface tracking-tight leading-tight">Dr. Sarah Jenkins</h3>
              <p className="text-xs text-secondary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Cardiologist • Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full hover:bg-surface-container text-stone-500 transition-colors">
              <span className="material-symbols-outlined" data-icon="search">search</span>
            </button>
            <button className="p-2.5 rounded-full hover:bg-surface-container text-stone-500 transition-colors">
              <span className="material-symbols-outlined" data-icon="info">info</span>
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform bg-gradient-to-br from-primary to-primary-container">
              <span className="material-symbols-outlined text-sm" data-icon="videocam">videocam</span>
              Start Video Call
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low/30 via-transparent to-transparent">
          <div className="flex justify-center">
            <span className="px-4 py-1 rounded-full bg-surface-container text-stone-400 text-[10px] font-bold uppercase tracking-widest">Tuesday, Oct 24</span>
          </div>

          {/* Received Message */}
          <div className="flex gap-4 max-w-[80%]">
            <img alt="Dr. Sarah Jenkins" className="w-8 h-8 rounded-full object-cover self-end mb-2 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPkR79QgD5Kxm6BnC6-W64h6FgDvtwgArS-s3N2t_0ZuGyRiz48rmO4BX633H-MlvulzMEq-VcqR-ufP0phxtm8CPP41iFKTHggBhDxy0It0cInnWzny51rMF6zx8R8Qf30eu6UUkURlB7j-xacvkbyO9jmU9zndtV4y6lj6IoW5jby-AKucn77r0Ltyst83YQrKytvG3p1nrc8HM73N5n09jPXl-_i6TjkbJEVmCS3cL47Bp2gddkQs-cdsWefygfn5b6PuTHxWU" />
            <div className="space-y-1">
              <div className="bg-surface-container-high text-on-surface-variant p-4 rounded-t-2xl rounded-br-2xl text-sm leading-relaxed shadow-sm">
                Hello Alex, I've reviewed your latest telemetry data. Everything looks very stable!
              </div>
              <div className="bg-surface-container-high text-on-surface-variant p-4 rounded-b-2xl rounded-tr-2xl text-sm leading-relaxed shadow-sm">
                How have you been feeling after the new medication adjustment?
              </div>
              <p className="text-[10px] text-stone-400 ml-1 font-medium">10:45 AM</p>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
            <div className="space-y-1 flex flex-col items-end">
              <div className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-t-2xl rounded-bl-2xl text-sm leading-relaxed shadow-md shadow-primary/10">
                I'm feeling much more energetic, Dr. Jenkins. No more shortness of breath during my morning walks!
              </div>
              <div className="flex items-center gap-1.5 mt-1 mr-1">
                <p className="text-[10px] text-stone-400 font-medium">10:52 AM</p>
                <span className="material-symbols-outlined text-primary text-[14px]" data-icon="done_all" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
              </div>
            </div>
          </div>

          {/* Document Shared Card */}
          <div className="flex gap-4 max-w-[80%]">
            <img alt="Dr. Sarah Jenkins" className="w-8 h-8 rounded-full object-cover self-end mb-2 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWQPJwIQNyobNbQWk-uvCbxizlS_gTREoMl-ZUalTxJdK_RKcNgpFN6dj3uaoTI1BNpHgvFpFdqUS1E1cqbOU-q7Iwm2Y8pRJ6iIanYZPLjtbaMTcFK2fR-ecPQa8sXXlpgRjfzgqvlrASBIoqWaVahSyWC_wbSYoTYRKoc54PuqEsaYoEPy6ZCt1pU_NovjWY4R4p5qTpKSeD9SIh6RO_5ScjASsfWHpU2PrQxNuCOjLYnn-IKH7D3FRf1IdZrooqS3n9-Y_iWL8" />
            <div className="space-y-1">
              <div className="bg-surface-container-high text-on-surface-variant p-1 rounded-2xl shadow-sm border border-white/40 overflow-hidden">
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl">
                  <div className="w-12 h-12 bg-secondary-container/50 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl" data-icon="description">description</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">Weekly_Report_Oct.pdf</p>
                    <p className="text-xs text-stone-500">2.4 MB • Cardiac Summary</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
                    <span className="material-symbols-outlined" data-icon="download">download</span>
                  </button>
                </div>
                <div className="p-4 pt-3">
                  <p className="text-sm leading-relaxed">Here is the detailed summary. I've highlighted the heart rate trends in green.</p>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 ml-1 font-medium">11:05 AM</p>
            </div>
          </div>

          {/* Sent Message Typing */}
          <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
            <div className="bg-surface-container-high text-stone-400 px-6 py-3 rounded-full flex gap-1 items-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border-t border-surface-variant/10">
          <div className="flex items-end gap-4 max-w-5xl mx-auto">
            <div className="flex gap-1">
              <button className="p-3 rounded-full hover:bg-surface-container-high text-primary transition-colors" title="Upload File">
                <span className="material-symbols-outlined" data-icon="add">add</span>
              </button>
              <button className="p-3 rounded-full hover:bg-surface-container-high text-stone-500 transition-colors" title="Attach Document">
                <span className="material-symbols-outlined" data-icon="attach_file">attach_file</span>
              </button>
              <button className="p-3 rounded-full hover:bg-surface-container-high text-stone-500 transition-colors" title="Add Image">
                <span className="material-symbols-outlined" data-icon="image">image</span>
              </button>
            </div>
            <div className="flex-1 relative group">
              <textarea className="w-full bg-surface-container-low border-none rounded-[2rem] py-3.5 px-6 pr-12 text-sm focus:ring-4 focus:ring-primary/10 placeholder:text-stone-400 resize-none overflow-hidden transition-all shadow-inner" placeholder="Type your health update or question..." rows={1}></textarea>
              <button className="absolute right-2 bottom-2 p-2 rounded-full hover:bg-surface-container-highest text-stone-400 transition-colors">
                <span className="material-symbols-outlined" data-icon="sentiment_satisfied">sentiment_satisfied</span>
              </button>
            </div>
            <button className="bg-primary text-white p-3.5 rounded-full shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-transform bg-gradient-to-br from-primary to-primary-container">
              <span className="material-symbols-outlined" data-icon="send" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-stone-400 mt-4 font-medium uppercase tracking-widest">In case of medical emergency, please call 911 directly.</p>
        </div>
      </section>

      {/* Activity Sidebar (Right) - Bento Style */}
      <section className="w-72 flex flex-col gap-6 hidden xl:flex shrink-0">
        {/* Mini Profile Card */}
        <div className="bg-surface-container-high/40 p-6 rounded-[2rem] border border-white/30">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img alt="Dr. Jenkins" className="w-24 h-24 rounded-3xl object-cover shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBruVPCrZIsrWWvHMkflF6W-wvY0tzZSkc4O2X1wVWCtIg1kgd6R3rF033eDDCqiWd78dCvrCnGixKqEjcERjWBUKUHboTpV2ZwOKPnKCkMVssjSteq04tAVA-9Z-MdLOFRtMSdKX45fRt98sZHSWD5U222zhV4dAixLBnP_1psJwuXMWTUfb9CxKujM8DyvrEoyh_KFE4eKzvmvpZsOhxvyegHqa0BJbbCxkl0sVSr7pZzUCIxmS23m99irXBujkaG7KIUpT14sq8" />
              <span className="absolute -top-2 -right-2 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">MD</span>
            </div>
            <h4 className="font-headline font-extrabold text-on-surface tracking-tight">Dr. Sarah Jenkins</h4>
            <p className="text-xs text-stone-500 font-medium mt-1">St. Jude Medical Center</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-white/60 p-3 rounded-2xl text-center">
              <p className="text-[10px] text-stone-400 font-bold uppercase">Experience</p>
              <p className="text-sm font-bold text-on-surface">12 Years</p>
            </div>
            <div className="bg-white/60 p-3 rounded-2xl text-center">
              <p className="text-[10px] text-stone-400 font-bold uppercase">Rating</p>
              <p className="text-sm font-bold text-on-surface">4.9/5.0</p>
            </div>
          </div>
        </div>

        {/* Shared Files Bento */}
        <div className="flex-1 bg-surface-container-highest/30 rounded-[2rem] p-6 border border-white/20 flex flex-col">
          <h4 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center justify-between">
            Shared Files
            <span className="text-[10px] text-primary font-bold">View All</span>
          </h4>
          <div className="space-y-3">
            {sharedFiles.map((file) => (
              <SharedFileItem key={file.name} {...file} />
            ))}
          </div>

          {/* Pulse Metric Mini Card */}
          <div className="mt-auto bg-gradient-to-br from-primary to-primary-container p-5 rounded-3xl text-white shadow-xl shadow-primary/20">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined" data-icon="favorite" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Avg Heart Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-headline font-extrabold">72</p>
              <p className="text-sm font-medium opacity-90">BPM</p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
              <div className="w-[72%] h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
