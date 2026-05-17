'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, ImageIcon, User, Globe, Mic, ChevronDown, ChevronRight, Layout, TrendingUp, BarChart3, Clock, Sparkles } from 'lucide-react';
import { VideoItem, suiteTools } from '@/lib/data/studio';
import { useStudio } from '@/context/StudioContext';

interface DashboardViewProps {
  containerVariants: any;
  itemVariants: any;
  categories: any[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  filteredVideos: VideoItem[];
  setActiveTab: (tab: any) => void;
  setStep: (step: any) => void;
  setMode: (mode: any) => void;
}

export const DashboardView = ({
  containerVariants,
  itemVariants,
  categories,
  activeCategory,
  setActiveCategory,
  filteredVideos,
  setActiveTab,
  setStep,
  setMode
}: DashboardViewProps) => {
  const { T, lang, userAssets } = useStudio();

  const allMedia = [...userAssets, ...filteredVideos];

  return (
    <motion.div
      key="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-12 pb-20"
    >
      {/* Studio Performance Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
         {[
            { id: 1, label: lang === 'am' ? 'ባጠቃላይ ቪዲዮዎች' : 'Total Productions', value: (userAssets.length + 42).toString(), icon: <Video className="w-5 h-5 text-primary" />, trend: `+${userAssets.length}` },
            { id: 2, label: lang === 'am' ? 'የስቱዲዮ ሰዓታት' : 'Studio Hours', value: '12.5h', icon: <Clock className="w-5 h-5 text-secondary" />, trend: 'Live' },
            { id: 3, label: lang === 'am' ? 'የተሳለጡ ፕሮምፕቶች' : 'Enhanced Prompts', value: '128', icon: <Sparkles className="w-5 h-5 text-orange-400" />, trend: '88%' },
            { id: 4, label: lang === 'am' ? 'ጥራት (UHD)' : 'Avg. Resolution', value: '4K', icon: <BarChart3 className="w-5 h-5 text-green-500" />, trend: 'Opt' },
         ].map(stat => (
            <div key={stat.id} className="studio-panel p-6 flex items-center justify-between shadow-2xl border-white/5 bg-panel/30 transition-all hover:translate-y-[-4px] cursor-pointer">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted tracking-widest">{stat.label}</p>
                  <div className="flex items-center gap-3">
                     <span className="text-2xl font-black italic uppercase text-foreground">{stat.value}</span>
                     <span className="text-[9px] font-black text-primary px-2 py-0.5 rounded-sm bg-primary/5 uppercase tracking-widest">{stat.trend}</span>
                  </div>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                  {stat.icon}
               </div>
            </div>
         ))}
      </div>

      {/* Navigation Pill */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-panel/60 backdrop-blur-xl rounded-full px-8 py-3 gap-8 text-[11px] font-black text-muted tracking-[0.2em] uppercase border border-border shadow-2xl shadow-black/10">
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><BookOpen className="w-4 h-4 opacity-70" /> Story <ChevronDown className="w-3 h-3 opacity-30" /></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><Video className="w-4 h-4 opacity-70" /> Video <ChevronDown className="w-3 h-3 opacity-30" /></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><ImageIcon className="w-4 h-4 opacity-70" /> Image <ChevronDown className="w-3 h-3 opacity-30" /></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><User className="w-4 h-4 opacity-70" /> Character <ChevronDown className="w-3 h-3 opacity-30" /></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><Globe className="w-4 h-4 opacity-70 text-primary" /> World <span className="text-[8px] bg-green-500 text-black px-1.5 py-0.5 rounded-sm font-black">NEW</span> <ChevronDown className="w-3 h-3 opacity-30" /></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"><Mic className="w-4 h-4 opacity-70" /> Audio <ChevronDown className="w-3 h-3 opacity-30" /></div>
        </div>
      </div>

      {/* Hero Feature Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16 px-4">
        <div className="lg:col-span-2 relative group rounded-3xl overflow-hidden aspect-[21/9] lg:aspect-auto h-full min-h-[320px] cursor-pointer shadow-2xl" onClick={() => { window.location.href = '/studio/create'; }}>
          <video src="/videos/firefly_11.mp4" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" autoPlay muted loop playsInline />
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 z-10 space-y-3">
            <h3 className="text-white text-3xl font-black tracking-tight italic uppercase drop-shadow-2xl">Seedance 2.0 Engine</h3>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-xl text-white text-[11px] font-black border border-white/20 tracking-[0.3em] uppercase transition-all shadow-xl">Synthesize New Work</button>
          </div>
        </div>
        <div className="relative group rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto h-full min-h-[320px] cursor-pointer shadow-2xl" onClick={() => { window.location.href = '/studio/create'; }}>
          <video src="/videos/firefly_12.mp4" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" autoPlay muted loop playsInline />
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 z-10 space-y-3">
            <h3 className="text-white text-xl font-black tracking-tight italic uppercase leading-none drop-shadow-2xl">Creative <br /> World Forge</h3>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-xl text-white text-[10px] font-black border border-white/20 tracking-[0.3em] uppercase transition-all shadow-xl">Explore Worlds</button>
          </div>
        </div>
        <div className="relative group rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto h-full min-h-[320px] cursor-pointer shadow-2xl" onClick={() => { window.location.href = '/studio/create'; }}>
          <video src="/videos/firefly_13.mp4" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" autoPlay muted loop playsInline />
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 z-10 space-y-3">
            <h3 className="text-white text-xl font-black tracking-tight italic uppercase leading-none drop-shadow-2xl">Enterprise <br /> Global Awards</h3>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-xl text-white text-[10px] font-black border border-white/20 tracking-[0.3em] uppercase transition-all shadow-xl font-sans italic">Win $20K Grand Prize</button>
          </div>
        </div>
      </div>

      {/* Suite Tools Section */}
      <div className="mb-20 px-4">
         <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">{lang === 'am' ? 'OpenArt ስብስብ' : 'OpenArt Studio Suite'}</h2>
               <p className="text-[10px] font-black text-primary tracking-[0.6em] uppercase">Enterprise Grade Intelligence</p>
            </div>
            <button className="text-[11px] font-black text-muted hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-3 border border-border px-5 py-2.5 rounded-xl hover:bg-foreground/5 shadow-inner">{lang === 'am' ? 'ተጨማሪ' : 'Explore All'} <ChevronRight className="w-4 h-4" /></button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {suiteTools.map(tool => (
               <div key={tool.id} onClick={() => { window.location.href = '/studio/create'; }} className={`group relative bg-panel/30 border border-border hover:border-primary/40 rounded-[28px] p-6 cursor-pointer transition-all duration-500 overflow-hidden shadow-2xl hover:translate-y-[-4px]`}>
                  <div className="flex items-start justify-between relative z-10 mb-10">
                     <div className="space-y-2">
                        <h4 className={`text-[12px] font-black tracking-[0.2em] uppercase ${tool.titleColor}`}>{tool.title}</h4>
                        <p className="text-[10px] text-muted font-bold leading-tight line-clamp-1">{tool.desc}</p>
                     </div>
                     <div className="w-12 h-12 rounded-[18px] overflow-hidden shrink-0 border border-border bg-black shadow-lg">
                         <video src={tool.icon} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            ))}
         </div>
      </div>

      {/* Media Archive Section */}
      <div className="space-y-10 pt-10 pb-32 px-4 shadow-inner border-t border-border bg-foreground/[0.01]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center md:text-left">
             <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">{T.samples}</h2>
             <p className="text-[10px] font-black text-primary tracking-[0.6em] uppercase">Curated Machine Visuals</p>
          </div>
          <div className="flex bg-panel/60 p-1.5 rounded-2xl border border-border shadow-2xl flex-wrap justify-center">
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all ${activeCategory === c.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-muted hover:text-foreground'}`}>
                {lang === 'am' ? (c.id === 'all' ? 'ሁሉም' : (T.categories[c.id as keyof typeof T.categories] || c.label)) : c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[200px]">
          {allMedia.map((v, idx) => (
            <motion.div
              key={v.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`group relative overflow-hidden bg-black w-full rounded-3xl cursor-pointer shadow-2xl transition-all duration-700`}
              style={{ gridRow: `span ${idx % 3 === 0 ? 2 : 1}` }}
            >
              <video src={v.thumb} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90 transition-opacity flex flex-col justify-end p-8">
                 <span className="text-[10px] font-black text-primary tracking-[0.6em] mb-2 uppercase italic leading-none">{v.category}</span>
                 <h5 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight drop-shadow-lg">{v.title}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
