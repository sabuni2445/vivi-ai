'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, MessageSquare, RefreshCw, User, Sparkles, Sun, Moon, X } from 'lucide-react';
import { DynamicGrid, CanvasParticles } from '@/components/ui/AntigravityBackground';
import { useStudio } from '@/context/StudioContext';

interface LandingProps {
  mousePosition: { x: number; y: number };
  setView: (view: any) => void;
}

export const ViviLanding = ({ mousePosition, setView }: LandingProps) => {
  const { theme, setTheme } = useStudio();
  const isLight = theme === 'light';
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'result'>('idle');
  const [loadingText, setLoadingText] = useState('Understanding your idea...');

  const startGeneration = () => {
    setGenerationState('loading');
    setLoadingText('Understanding your idea...');
    setTimeout(() => setLoadingText('Creating your script...'), 3000);
    setTimeout(() => setLoadingText('Generating your ad...'), 6000);
    setTimeout(() => setGenerationState('result'), 9000);
  };

  return (
    <div
      className="min-h-screen text-foreground font-sans selection:bg-primary selection:text-white relative overflow-hidden bg-background transition-colors duration-500"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {/* Interactive Antigravity Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-background transition-colors duration-500">
        <div className={`absolute inset-0 transition-colors duration-1000 bg-[radial-gradient(circle_at_50%_-20%,${isLight ? '#F5F3FF' : '#1A1245'}_0%,transparent_70%)]`} />
        <div className={`absolute inset-0 z-[2] pointer-events-none ${isLight ? 'mix-blend-multiply opacity-60' : 'mix-blend-screen'}`}>
          <div className={`absolute w-[600px] h-[600px] ${isLight ? 'bg-purple-300/60' : 'bg-purple-600/20'} blur-[140px] rounded-full top-[20%] left-[10%] transition-colors duration-1000`} />
          <div className={`absolute w-[500px] h-[500px] ${isLight ? 'bg-blue-300/60' : 'bg-blue-600/20'} blur-[120px] rounded-full bottom-[10%] right-[10%] transition-colors duration-1000`} />
        </div>
        <div className="absolute inset-0" style={{ perspective: '2000px' }}>
          <div className="w-full h-full transform-gpu rotate-x-[60deg] scale-[2] opacity-20">
            <DynamicGrid />
          </div>
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none perspective-[1200px]">
          <div
            className="w-full h-full"
            style={{
              transform: `rotateX(60deg) scale(1.2)`,
              transformOrigin: "center",
              opacity: 0.25
            }}
          />
        </div>
        <div
          className={`absolute lg:w-[1200px] lg:h-[1200px] w-[800px] h-[800px] rounded-full blur-[160px] opacity-30 pointer-events-none z-[1] transform-gpu ${isLight ? 'mix-blend-normal opacity-40' : 'mix-blend-screen'}`}
          style={{
            background: isLight 
              ? 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0) 70%)'
              : 'radial-gradient(circle, rgba(157,92,255,0.15) 0%, rgba(59,130,246,0) 70%)',
            top: 'calc(var(--mouse-y) - 600px)',
            left: 'calc(var(--mouse-x) - 600px)',
            transition: 'top 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <CanvasParticles mousePosition={mousePosition} />
      </div>

      {/* Spatial Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl z-[100] px-6">
        <div className={`spatial-glass h-16 rounded-full px-8 flex items-center justify-between inner-glow transition-all duration-500 shadow-2xl ${isLight ? 'shadow-black/5 bg-white/40 border border-black/5' : 'shadow-black/50 bg-[#0c0a19]/50 border border-white/10'}`}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/images/vivi_ai_logo.png" alt="vivi ai" className="h-12" />
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
            <span>Archive</span>
            <span>Engine</span>
            <span>Pricing</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
            </button>
            <button onClick={() => setView('app')} className="primary-btn px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              STUDIO ACCESS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4 max-w-4xl w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md text-sm font-bold text-primary mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 fill-current" /> Seedance 2.0 Video Engine Live
          </div>
          <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-muted drop-shadow-2xl">Turn Ideas Into <br className="hidden md:block" /> Ads in Seconds</h1>
          <p className="text-xl md:text-3xl text-muted font-medium max-w-2xl mx-auto leading-relaxed mt-6 mb-12">AI-powered marketing for every business</p>
          
          <div className="pt-8 w-full max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl group-focus-within:bg-primary/40 group-focus-within:blur-3xl transition-all duration-700 rounded-full pointer-events-none" />
            <div className="relative flex items-center bg-card/60 backdrop-blur-2xl border border-glass-stroke rounded-[28px] shadow-2xl shadow-black/20 overflow-hidden transition-all duration-500 group-focus-within:scale-[1.02] group-focus-within:border-primary/50 group-focus-within:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              <input 
                type="text" 
                placeholder="Describe your business or idea..." 
                className="w-full bg-transparent border-none outline-none py-7 pl-8 pr-4 text-xl text-foreground placeholder:text-foreground/40 font-medium"
                onKeyDown={(e) => { if (e.key === 'Enter') startGeneration(); }}
              />
              <button onClick={startGeneration} className="primary-btn shrink-0 mr-3 px-8 py-5 text-lg whitespace-nowrap z-10 flex items-center gap-3">
                Generate Ad <ChevronRight className="w-5 h-5 opacity-70" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Edge-to-Edge Continuous Visual Wall */}
      <section className="w-full relative z-10 overflow-hidden bg-black mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-0 w-full relative">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => (
            <div key={i} className="group relative aspect-video w-full bg-[#050505] overflow-hidden cursor-crosshair">
               <video src={`/videos/firefly_${i}.mp4`} className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105" muted loop playsInline onMouseEnter={(e) => { e.currentTarget.play(); e.currentTarget.muted = true; }} onMouseLeave={(e) => e.currentTarget.pause()} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-5">
                  <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em] opacity-90 drop-shadow-md border border-primary/30 bg-black/40 backdrop-blur-md px-2 py-1 rounded-sm">Vivi Engine</span>
                     <p className="text-white text-xs font-bold leading-tight opacity-90">Auto-generated marketing footage</p>
                  </div>
               </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-card border-t border-border relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="high-end-card p-8 space-y-6">
            <MessageSquare className="w-10 h-10 text-primary" />
            <h3 className="text-2xl font-bold">Chat-based Creation</h3>
            <p className="text-muted leading-relaxed">Turn your ideas into video reality by simply describing them.</p>
          </div>
          <div className="high-end-card p-8 space-y-6">
            <RefreshCw className="w-10 h-10 text-orange-500" />
            <h3 className="text-2xl font-bold">Iterative Editing</h3>
            <p className="text-muted leading-relaxed">Say "make it faster" and see changes instantly.</p>
          </div>
          <div className="high-end-card p-8 space-y-6">
            <User className="w-10 h-10 text-blue-500" />
            <h3 className="text-2xl font-bold">Consistency</h3>
            <p className="text-muted leading-relaxed">Keep characters consistent across different scenes.</p>
          </div>
        </div>
      </section>

      <div className="h-[100px]" />
      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="/images/vivi_ai_logo.png" alt="vivi ai" className="h-10" />
          <div className="flex gap-8 text-sm text-muted">
            <span>Discord</span>
            <span>Twitter</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>

      {/* Cinematic Overlays */}
      <AnimatePresence>
        {generationState === 'loading' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
               className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" 
            />
            <div className="relative z-10 flex flex-col items-center">
              <RefreshCw className="w-12 h-12 text-primary animate-spin mb-10 opacity-80" />
              <motion.h2 
                key={loadingText}
                initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-center"
              >
                {loadingText}
              </motion.h2>
              <div className="mt-10 mx-auto w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 9, ease: "linear" }}
                  className="h-full bg-primary shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {generationState === 'result' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full max-w-6xl aspect-video rounded-[24px] overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.3)] border border-primary/30 bg-black relative z-10 group"
            >
               <video src="/videos/firefly_8.mp4" className="w-full h-full object-cover" autoPlay loop playsInline />
               <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               <button onClick={() => setGenerationState('idle')} className="absolute top-6 right-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-xl hover:bg-white/20 transition-all border border-white/10 hover:scale-110 z-20">
                 <X className="w-5 h-5" />
               </button>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-12 text-3xl md:text-5xl font-black text-white tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Premiere Generation</motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-10 flex gap-6 z-10">
              <button className="secondary-btn px-10 py-5 text-sm font-bold uppercase tracking-widest text-white border-white/20 hover:bg-white/5 flex items-center gap-2">Download UHD</button>
              <button onClick={() => setView('app')} className="primary-btn px-10 py-5 text-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]">Open In Studio <ChevronRight className="w-4 h-4"/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
