'use client';

import { useState } from 'react';
import { useStudio } from '@/context/StudioContext';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Zap, Trophy, Crown } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

export default function CreditsPage() {
  const { credits, fetchCredits } = useStudio();
  const [loading, setLoading] = useState<string | null>(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 3,
      price: '$9',
      description: 'Perfect for trying out your first high-converting ads.',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      features: ['8s AI Video Generation', '3 Production Credits', 'Standard Processing Speed']
    },
    {
      id: 'pro',
      name: 'Business Pro',
      credits: 10,
      price: '$25',
      popular: true,
      description: 'The standard choice for growing brands and startups.',
      icon: <Trophy className="w-6 h-6 text-orange-400" />,
      features: ['8s AI Video Generation', '10 Production Credits', 'Priority Queue Access', 'Scene-Level Regeneration']
    },
    {
      id: 'elite',
      name: 'Elite Agency',
      credits: 30,
      price: '$60',
      description: 'Scale your marketing with volume AI production.',
      icon: <Crown className="w-6 h-6 text-yellow-400" />,
      features: ['8s AI Video Generation', '30 Production Credits', 'Ultra-HD Upscaling', '24/7 Priority Support']
    }
  ];

  const handleBuy = async (pkgId: string) => {
    setLoading(pkgId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/credits/buy`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': 'anonymous'
        },
        body: JSON.stringify({ packageId: pkgId })
      });
      
      if (res.ok) {
        alert('Payment successful! Credits added.');
        await fetchCredits();
      }
    } catch (error) {
      alert('Simulation failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Sparkles className="w-4 h-4" /> Production Fuel
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-7xl font-black italic uppercase tracking-tighter text-foreground">
            Scale Your <span className="text-primary">Vision</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted text-lg font-bold tracking-tight">
            Purchase production credits to generate high-converting AI Video Ads instantly.
          </motion.p>
          <div className="pt-6">
             <div className="inline-flex items-center gap-6 px-8 py-4 rounded-3xl bg-foreground/5 border border-border">
                <span className="text-xs font-black uppercase tracking-widest text-muted">Current Balance:</span>
                <span className="text-2xl font-black italic text-foreground">{credits} Credits</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`relative glass-card p-10 space-y-8 flex flex-col border-border/50 group transition-all hover:scale-[1.02] ${pkg.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                   <div className="px-6 py-1 bg-primary rounded-full text-[10px] font-black text-white uppercase tracking-widest">Most Popular</div>
                </div>
              )}

              <div className="space-y-4">
                 <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {pkg.icon}
                 </div>
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{pkg.name}</h3>
                    <p className="text-muted text-[11px] font-bold uppercase tracking-widest">{pkg.credits} Credits</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="text-5xl font-black italic text-foreground tracking-tighter">{pkg.price}</div>
                 <p className="text-muted text-xs leading-relaxed">{pkg.description}</p>
              </div>

              <div className="space-y-4 flex-1">
                 {pkg.features.map(f => (
                   <div key={f} className="flex items-center gap-3 text-[10px] font-black uppercase text-foreground/70 tracking-widest">
                      <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => handleBuy(pkg.id)}
                disabled={loading !== null}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${pkg.popular ? 'primary-btn shadow-xl shadow-primary/30' : 'bg-foreground/5 border border-border hover:bg-foreground/10'}`}
              >
                {loading === pkg.id ? 'Processing...' : 'Buy Now'} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
           <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Powered by Telebirr Secure Simulation Technology</p>
        </div>
      </div>
    </div>
  );
}
