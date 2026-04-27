import React from "react";
import { Search, Bell, Settings, HelpCircle, User, Wifi, WifiOff, Moon, Sun } from "lucide-react";
import { useUIStore } from "@/shared/store/uiStore";
import { useTranslation } from "react-i18next";
import { cn } from "@/src/lib/utils";

export function Header({ onNavigate }: { onNavigate: () => void }) {
  const { sidebarOpen, theme, setTheme } = useUIStore();
  const { t, i18n } = useTranslation();
  const [isOnline, setIsOnline] = React.useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 transition-all duration-300"
      style={{ left: sidebarOpen ? '16rem' : '5rem' }}
    >
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#f8fafb] border border-gray-200 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#0077c5] focus:border-[#0077c5] transition-all text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
            <Settings size={20} />
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <button onClick={onNavigate} className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
