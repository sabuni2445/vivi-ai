'use client';

import React, { useState } from 'react';
import { Search, Grid, List, Filter, Download, MoreVertical, Play, Trash2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleVideos } from '@/lib/data/studio';
import { useStudio } from '@/context/StudioContext';

export default function LibraryPage() {
  const { T, lang } = useStudio();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = sampleVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-panel/40 p-10 rounded-[40px] border border-border shadow-2xl">
         <div className="space-y-1">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-foreground">{lang === 'am' ? 'የስቱዲዮ ሀብቶች' : 'Studio Assets'}</h1>
            <p className="text-[10px] font-black text-primary tracking-[0.6em] uppercase">Manage and Export Production Metadata</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-foreground/5 p-1 rounded-xl border border-border">
               <button onClick={() => setViewType('grid')} className={`p-2.5 rounded-lg transition-all ${viewType === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-foreground'}`}><Grid className="w-5 h-5" /></button>
               <button onClick={() => setViewType('list')} className={`p-2.5 rounded-lg transition-all ${viewType === 'list' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-foreground'}`}><List className="w-5 h-5" /></button>
            </div>
            <button className="primary-btn px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-3">
              <Download className="w-4 h-4" /> Batch Export
            </button>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-6">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={lang === 'am' ? 'ፈልግ...' : 'Search your library...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel/60 border border-border rounded-2xl py-4 pl-16 pr-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
         </div>
         <button className="px-6 py-4 rounded-2xl bg-panel/60 border border-border text-muted hover:text-foreground transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest italic">
            <Filter className="w-4 h-4" /> Filter
         </button>
      </div>

      {/* Assets Grid/List */}
      <AnimatePresence mode="wait">
        {viewType === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group glass-card overflow-hidden hover:translate-y-[-8px] transition-all duration-700 hover:border-primary/40 cursor-pointer shadow-black/20">
                 <div className="aspect-video relative overflow-hidden bg-black/20">
                    <video src={asset.thumb} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 fill-current" />
                       </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"><Share2 className="w-4 h-4" /></button>
                       <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"><Download className="w-4 h-4" /></button>
                    </div>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                       <div className="space-y-1">
                          <h3 className="text-sm font-black italic uppercase text-foreground leading-tight">{asset.title}</h3>
                          <p className="text-[10px] text-muted font-bold tracking-widest uppercase">{asset.category}</p>
                       </div>
                       <button className="text-muted hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                       <span className="text-[9px] font-black text-muted uppercase tracking-widest italic">Created 2h ago</span>
                       <span className="text-[9px] font-black text-primary px-2 py-0.5 rounded-sm bg-primary/5 border border-primary/10 uppercase tracking-widest">4K READY</span>
                    </div>
                 </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group studio-panel p-4 flex items-center justify-between gap-8 hover:bg-foreground/5 transition-all cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="w-24 aspect-video rounded-xl overflow-hidden bg-black/20 border border-border">
                       <video src={asset.thumb} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xs font-black uppercase italic text-foreground">{asset.title}</h3>
                       <p className="text-[10px] text-muted font-bold tracking-wider">{asset.category} • 4K UHD • 15s</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                   <div className="hidden md:flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-[9px] font-black uppercase border border-green-500/20">Synced</span>
                      <span className="text-[9px] font-black text-muted uppercase tracking-widest">Oct 24, 2024</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-muted hover:text-primary transition-all"><Share2 className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-muted hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      <button className="w-10 h-10 rounded-xl primary-btn flex items-center justify-center text-white"><Play className="w-4 h-4 fill-current" /></button>
                   </div>
                 </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
