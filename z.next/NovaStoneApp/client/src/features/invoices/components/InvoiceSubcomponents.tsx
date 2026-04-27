import React from "react";
import { cn } from "@/src/lib/utils";

export function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-6">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-gray-900">${value}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub}</span>
      </div>
    </div>
  );
}

export function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
        active ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
          active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

export function CollapsibleButton({ label }: { label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-all font-sans">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest text-left">{label}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>
  );
}

export function FormField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold"
      />
    </div>
  );
}

export function FormDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <div className="flex-1 relative">
        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} /></svg>
      </div>
    </div>
  );
}

export function ActionMenuItem({ icon: Icon, label, variant }: { icon: any; label: string; variant?: "danger" }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-2 rounded-lg text-xs font-bold transition-all",
      variant === "danger" ? "text-red-500 hover:bg-red-50" : "text-gray-600 hover:bg-gray-50"
    )}>
      <Icon size={14} />
      {label}
    </button>
  );
}

export function CreditCardIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center text-[6px] font-bold text-white">BANK</div>
      <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center text-[6px] font-bold text-white italic">AMEX</div>
      <div className="w-8 h-5 bg-orange-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-red-600 -mr-1" />
        <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-80" />
      </div>
      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] font-black text-white">VISA</div>
    </div>
  );
}

export function AttachmentSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">Attachments</h3>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeWidth={2} /><circle cx="12" cy="17" r="0.5" /></svg>
      </div>
      <div className="border-2 border-dashed border-blue-200 rounded-[2rem] p-12 bg-blue-50/10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-blue-50/30 transition-all">
        <svg className="w-12 h-12 text-blue-200 group-hover:scale-110 group-hover:text-blue-300 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        <div className="text-center font-sans">
          <p className="text-sm font-bold text-gray-600">Drag files here or click to upload</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Max 20MB</p>
        </div>
      </div>
      <div className="bg-[#fff1e6] border border-[#ff914d]/20 rounded-xl p-4 flex justify-between items-center font-sans">
        <div className="flex items-center gap-3">
          <div className="text-[#ff914d]">
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg>
          </div>
          <span className="text-xs font-bold text-[#4a321f]">Attach files to your invoices and fire them off, right from Wave.</span>
        </div>
        <button className="px-4 py-2 bg-[#ffdac1] text-[#7c2d12] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcfaf] transition-all">
          Upgrade now
        </button>
      </div>
    </div>
  );
}
