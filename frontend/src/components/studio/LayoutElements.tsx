'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Library, TrendingUp, Settings, Plus, Search, Sun, Moon, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { Language } from '@/lib/translations';

export const StudioSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-72 h-full bg-sidebar border-r border-border flex flex-col z-[100] transition-all duration-500 inner-glow shrink-0 overflow-hidden">
      <Link href="/" className="p-8 pt-10 flex items-center justify-start cursor-pointer group">
        <img src="/images/vivi_ai_logo.png" alt="vivi ai" className="h-10 group-hover:scale-105 transition-transform" />
      </Link>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <Link 
          href="/studio" 
          className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-bold text-xs ${isActive('/studio') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted hover:bg-foreground/5 hover:text-foreground'}`}
        >
          <Layout className="w-4 h-4" /> Dashboard
        </Link>
        <Link 
          href="/studio/library" 
          className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-bold text-xs ${isActive('/studio/library') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted hover:bg-foreground/5 hover:text-foreground'}`}
        >
          <Library className="w-4 h-4" /> Studio Assets
        </Link>
        <button className="w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-bold text-xs text-muted hover:bg-foreground/5 hover:text-foreground">
          <TrendingUp className="w-4 h-4" /> Analytics
        </button>
        <button className="w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-bold text-xs text-muted hover:bg-foreground/5 hover:text-foreground">
          <Settings className="w-4 h-4" /> Settings
        </button>
      </nav>

      <div className="p-6 space-y-6 mb-4">
        <div className="bg-foreground/5 p-4 rounded-2xl border border-border shadow-inner">
          <div className="flex items-center justify-between mb-2">
             <p className="text-[9px] font-black uppercase tracking-widest text-primary">Premium Creator</p>
             <span className="text-[10px] font-black text-primary">80%</span>
          </div>
          <p className="text-[10px] font-bold text-muted mb-4 italic">Pro Account Active</p>
          <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-[80%] shadow-[0_0_10px_var(--primary-glow)]" />
          </div>
        </div>

        <Link
          href="/studio/create"
          className="w-full primary-btn py-4 rounded-xl font-black flex items-center justify-center gap-3 text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" /> NEW PRODUCTION
        </Link>

        {/* User Profile Hook */}
        <div className="pt-6 border-t border-border mt-4 group/profile">
           <div className="flex items-center gap-4 cursor-pointer p-2 rounded-2xl hover:bg-foreground/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover/profile:scale-110 transition-transform">
                 <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-[11px] font-black uppercase text-foreground truncate">Vivi Creator</p>
                 <p className="text-[10px] font-bold text-muted truncate">pro_user@vivi.ai</p>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-muted hover:text-red-500 transition-all">
                 <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
};

interface HeaderProps {
  theme: string;
  setTheme: (theme: any) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const StudioHeader = ({ theme, setTheme, lang, setLang }: HeaderProps) => {
  return (
    <header className="h-20 bg-background/20 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative max-w-lg w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search projects, templates..."
            className="w-full bg-foreground/5 border border-border rounded-xl py-2.5 pl-14 pr-6 text-xs font-bold placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-foreground/5 p-1 rounded-xl border border-border mr-2 shadow-inner">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-primary text-white shadow-xl' : 'text-muted hover:text-foreground'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('am')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'am' ? 'bg-primary text-white shadow-xl' : 'text-muted hover:text-foreground'}`}
          >
            AM
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-foreground/5 rounded-full border border-border shadow-inner">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Studio Online</span>
        </div>

        <button
           onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
           className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center border border-border transition-all shadow-inner"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
      </div>
    </header>
  );
};
