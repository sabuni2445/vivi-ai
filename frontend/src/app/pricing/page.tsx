'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PricingCards } from '@/components/pricing/PricingCards';
import { Sparkles, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Unleash Your Creative Potential</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-foreground leading-[0.9]">
             Pick Your <span className="text-primary">Power</span> Level
          </h1>
          <p className="text-muted text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
             From solo creators to global brands, choose the plan that fuels your vision with cinematic AI technology.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <PricingCards />

      {/* Additional Information / FAQ Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground">Creator Insights</h2>
             <p className="text-muted text-sm font-black uppercase tracking-[0.4em]">Everything you need to know about Vivi-AI production</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.div 
               whileHover={{ y: -5 }}
               className="glass-card p-8 border-white/5 space-y-4"
             >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                   <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Production Logic</h4>
                <p className="text-sm text-muted leading-relaxed font-medium">
                   1 AI Video equals exactly 1 Video Credit. Credits are only deducted when final cinematic rendering starts, allowing you to iterate on your vision for free.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="glass-card p-8 border-white/5 space-y-4"
             >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                   <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Commercial Rights</h4>
                <p className="text-sm text-muted leading-relaxed font-medium">
                   All plans include Commercial Use Support. Your generated content is yours to use across TikTok, Instagram, and any professional marketing platform.
                </p>
             </motion.div>

             <motion.div 
               whileHover={{ y: -5 }}
               className="glass-card p-8 border-white/5 space-y-4 md:col-span-2"
             >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-16 h-16 rounded-[24px] bg-foreground/5 flex items-center justify-center shrink-0">
                     <HelpCircle className="w-8 h-8 text-muted" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black uppercase tracking-widest text-foreground">Frequently Asked Questions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-4">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Do unused credits expire?</p>
                          <p className="text-xs font-medium text-muted">Unused credits remain available during your active subscription period.</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">What video format do I get?</p>
                          <p className="text-xs font-medium text-muted">Videos are optimized in high-fidelity cinematic vertical format (9:16).</p>
                       </div>
                    </div>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center relative z-10 border-t border-white/5">
         <div className="vivi-logo text-3xl font-black tracking-tighter italic mb-4">vivi ai</div>
         <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">The Future of Ethiopian Marketing • Powered by Neural Art</p>
      </footer>
    </div>
  );
}
