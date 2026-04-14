'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Share2, Download, Wand2, ArrowRight, Layers } from 'lucide-react';

interface CreateFlowProps {
  step: 'idle' | 'forming' | 'loading' | 'result';
  setStep: (step: any) => void;
  setActiveTab: (tab: any) => void;
  mode: 'guided' | 'prompt';
  setMode: (mode: any) => void;
  form: any;
  setForm: (form: any) => void;
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  handleFormSubmit: () => void;
  progressStep: number;
  loadingMessages: string[];
  enhancedPrompt: string;
  T: any;
}

export const CreateFlow = ({
  step,
  setStep,
  setActiveTab,
  mode,
  setMode,
  form,
  setForm,
  originalPrompt,
  setOriginalPrompt,
  handleFormSubmit,
  progressStep,
  loadingMessages,
  enhancedPrompt,
  T
}: CreateFlowProps) => {
  return (
    <motion.div key="create-space" className="flex-1 flex flex-col relative w-full pt-6">
      <AnimatePresence mode="wait">
        {(() => {
          switch(step) {
            case 'forming':
              return (
                <motion.div key="forming" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-5xl mx-auto w-full px-6 py-8">
                  <div className="glass-card p-12 space-y-12 relative z-10 overflow-hidden inner-glow group">
                      {/* Decorative Gradient Blob */}
                      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/30 transition-all duration-1000" />
                      
                      {/* Header Section */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-border pb-12">
                         <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground">Creative Engine</h2>
                            <p className="text-muted text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-3">
                              <Layers className="w-4 h-4 text-primary" /> Phase 1: Context Definition
                            </p>
                         </div>
                         <div className="flex gap-2 p-1.5 bg-foreground/5 rounded-2xl border border-border shadow-inner">
                           <button onClick={() => setMode('guided')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 ${mode === 'guided' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-muted hover:text-foreground'}`}>
                             {mode === 'guided' && <CheckCircle2 className="w-4 h-4" />} {T.form.mode1}
                           </button>
                           <button onClick={() => setMode('prompt')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 ${mode === 'prompt' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-muted hover:text-foreground'}`}>
                             {mode === 'prompt' && <Sparkles className="w-4 h-4" />} {T.form.mode2}
                           </button>
                         </div>
                      </div>

                      {/* Content Section */}
                      <div className="min-h-[400px]">
                        {mode === 'guided' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-2">
                                   {T.form.businessName} <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                 </label>
                                 <input type="text" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/30" placeholder="e.g. Skyline Media" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-2">
                                   {T.form.businessType} <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                 </label>
                                 <input type="text" value={form.businessType} onChange={(e) => setForm({...form, businessType: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/30" placeholder="e.g. Creative Agency" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-2">{T.form.product}</label>
                                 <input type="text" value={form.product} onChange={(e) => setForm({...form, product: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/30" placeholder="e.g. 3D Architectural Renders" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-2">{T.form.style}</label>
                                 <div className="relative">
                                   <select value={form.style} onChange={(e) => setForm({...form, style: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                                     {T.styles.map((s: string) => <option key={s} value={s} className="bg-panel text-foreground">{s}</option>)}
                                   </select>
                                   <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none rotate-90" />
                                 </div>
                              </div>
                              <div className="md:col-span-2 space-y-4 pt-4">
                                 <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">{T.form.description}</label>
                                 <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/30 min-h-[120px] resize-none" placeholder="Special requirements or additional context..." />
                              </div>
                           </div>
                        ) : (
                          <div className="space-y-8 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase text-primary tracking-[0.4em] flex items-center gap-3">
                                <Wand2 className="w-4 h-4" /> {T.form.promptLabel}
                              </label>
                              <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest"><Sparkles className="w-4 h-4 text-orange-400" /> Neural Enhancement Ready</div>
                            </div>
                            <div className="relative flex-1 group/text">
                              <textarea value={originalPrompt} onChange={(e) => setOriginalPrompt(e.target.value)} className="w-full bg-foreground/5 border border-border rounded-[32px] p-12 text-3xl font-black min-h-[400px] resize-none focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all italic placeholder:text-muted/10 leading-tight text-foreground" placeholder="Visualize your masterpiece in detail..." />
                              <div className="absolute bottom-8 right-8 opacity-0 group-focus-within/text:opacity-100 transition-opacity flex items-center gap-3 text-[10px] font-black text-primary tracking-widest uppercase">
                                Press Enter to refine <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-8 flex flex-col items-center gap-6">
                        <motion.button onClick={handleFormSubmit} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full primary-btn py-8 rounded-[32px] font-black text-2xl tracking-[0.2em] uppercase italic flex items-center justify-center gap-6 transition-all group/btn disabled:opacity-50 disabled:grayscale" disabled={mode === 'prompt' ? !originalPrompt : !form.businessName}>
                          Begin Synthesis <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.6em]">Studio Credit: 2.0 / High Speed Mode</p>
                      </div>
                  </div>
                </motion.div>
              );
            case 'loading':
              return (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center space-y-16 bg-background z-50 overflow-hidden">
                  <div className="w-80 h-80 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-[140px] animate-pulse" />
                    <motion.div className="absolute w-[420px] h-[420px] border border-primary/20 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} />
                    <motion.div className="absolute w-[360px] h-[360px] border border-secondary/10 rounded-full" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} />
                    <svg className="w-full h-full overflow-visible drop-shadow-[0_0_60px_var(--primary-glow)]">
                      <motion.circle cx="160" cy="160" r="145" stroke="var(--primary)" strokeWidth="14" fill="none" strokeDasharray="910" initial={{ strokeDashoffset: 910 }} animate={{ strokeDashoffset: 910 - (progressStep + 1) * 227.5 }} strokeLinecap="round" className="transition-all duration-[3s] ease-in-out" />
                    </svg>
                    <div className="absolute text-3xl font-black text-foreground italic flex items-center gap-2">
                      {Math.round(((progressStep + 1) / 4) * 100)}<span className="text-primary">%</span>
                    </div>
                  </div>
                  <div className="text-center space-y-12 max-w-2xl px-6">
                     <AnimatePresence mode="popLayout">
                       <motion.div key={progressStep} initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }} className="space-y-4">
                         <h2 className="text-6xl font-black italic tracking-tighter text-foreground uppercase leading-none">{loadingMessages[progressStep]}</h2>
                         <p className="text-muted tracking-[0.4em] uppercase text-[10px] font-black">OpenArt Neural Engine Active</p>
                       </motion.div>
                     </AnimatePresence>
                     <div className="w-64 h-1.5 bg-foreground/5 rounded-full overflow-hidden mx-auto"><motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(progressStep + 1) * 25}%` }} /></div>
                  </div>
                </motion.div>
              );
            case 'result':
              return (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col relative z-20 px-8 pt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                      <div className="aspect-video bg-black rounded-[48px] overflow-hidden border border-border shadow-2xl relative transition-transform duration-700 hover:scale-[1.01] inner-glow">
                        <video src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4" controls autoPlay loop className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                         <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-tight text-foreground">Studio Output Ready</h1>
                            <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-4">
                               <CheckCircle2 className="w-6 h-6 text-green-500" /> Ultra-HD Optimization Applied
                            </p>
                         </div>
                         <div className="flex gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-10 py-6 rounded-3xl bg-foreground/5 border border-border text-[11px] font-black tracking-widest uppercase hover:bg-foreground/10 transition-all flex items-center justify-center gap-4 text-foreground"><Share2 className="w-5 h-5" /> Share</button>
                            <button className="flex-1 md:flex-none primary-btn px-12 py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase shadow-2xl flex items-center justify-center gap-4 text-white"><Download className="w-5 h-5" /> Export 4K</button>
                         </div>
                      </div>
                    </div>
                    <div className="lg:col-span-4 space-y-12">
                       <div className="studio-panel p-10 space-y-12 shadow-2xl border-border/50">
                          <div className="space-y-6">
                             <div className="flex items-center justify-between">
                               <p className="text-[10px] uppercase font-black text-primary tracking-[0.6em] italic">Original Prompt</p>
                               <Layers className="w-4 h-4 text-muted opacity-30" />
                             </div>
                             <div className="text-lg italic font-bold leading-relaxed text-foreground/80 font-sans">"{originalPrompt}"</div>
                          </div>
                          <div className="h-[1px] bg-border" />
                          <div className="space-y-6">
                             <div className="flex items-center justify-between">
                               <p className="text-[10px] uppercase font-black text-primary tracking-[0.6em] italic">Engine Enhancement</p>
                               <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                             </div>
                             <div className="text-[11px] leading-relaxed font-bold text-muted tracking-widest uppercase italic bg-foreground/3 p-6 rounded-2xl border border-border/10">{enhancedPrompt}</div>
                          </div>
                          <div className="pt-6">
                             <button onClick={() => setStep('forming')} className="w-full py-5 rounded-2xl border border-primary/30 text-primary font-black uppercase text-[10px] tracking-[0.4em] hover:bg-primary/5 transition-all">NEW PRODUCTION</button>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            default: return null;
          }
        })()}
      </AnimatePresence>
    </motion.div>
  );
};
