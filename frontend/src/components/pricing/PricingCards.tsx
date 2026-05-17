'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Rocket, Users, Download, Image as ImageIcon, Video, Layers } from 'lucide-react';

const PLANS = [
  {
    name: "STARTER PLAN",
    price: "2,500",
    currency: "ETB",
    period: "Per Month",
    description: "Perfect for startups, students, online sellers, and first-time creators.",
    features: [
      { text: "3 Cinematic AI Advertisement Videos", icon: Video },
      { text: "15 AI-Generated Images", icon: ImageIcon },
      { text: "5 HD / 4K Image Enhancements", icon: Zap },
      { text: "3 AI Photo Restorations", icon: Shield },
      { text: "10 Text-to-Image Generations", icon: Sparkles },
      { text: "10 Background Removals", icon: Layers },
      { text: "Vertical Social Media Format (9:16)", icon: Download },
      { text: "Commercial Use Support", icon: Check },
    ],
    cta: "Start Creating",
    color: "primary",
    popular: false,
    bestFor: "Small businesses, TikTok ads, Instagram promotions, startup marketing."
  },
  {
    name: "CREATOR PLAN",
    price: "6,500",
    currency: "ETB",
    period: "Per Month",
    description: "Built for content creators, agencies, influencers, and growing businesses.",
    features: [
      { text: "10 Cinematic AI Advertisement Videos", icon: Video },
      { text: "50 AI-Generated Images", icon: ImageIcon },
      { text: "20 HD / 4K Enhancements", icon: Zap },
      { text: "10 AI Photo Restorations", icon: Shield },
      { text: "Unlimited Text-to-Image Generations", icon: Sparkles },
      { text: "Priority Rendering Queue", icon: Rocket },
      { text: "Enhanced Cinematic Motion", icon: Video },
      { text: "AI Product Photography Generation", icon: ImageIcon },
      { text: "Commercial Use License", icon: Check },
    ],
    cta: "Upgrade to Creator",
    color: "secondary",
    popular: true,
    bestFor: "Content creators, digital marketers, agencies, ecommerce brands."
  },
  {
    name: "BUSINESS PLAN",
    price: "15,000",
    currency: "ETB",
    period: "Per Month",
    description: "Designed for brands, agencies, and professional marketing teams.",
    features: [
      { text: "30 Cinematic AI Advertisement Videos", icon: Video },
      { text: "150 AI Image Generations", icon: ImageIcon },
      { text: "50 HD / 4K Enhancements", icon: Zap },
      { text: "50 AI Photo Restorations", icon: Shield },
      { text: "Premium Cinematic Rendering", icon: Rocket },
      { text: "Team Collaboration Features", icon: Users },
      { text: "Advanced Branding & Product Visuals", icon: Sparkles },
      { text: "Bulk AI Generation Tools", icon: Layers },
      { text: "Commercial & Business Usage Rights", icon: Check },
    ],
    cta: "Get Business Access",
    color: "primary",
    popular: false,
    bestFor: "Marketing agencies, companies, large ecommerce stores, professional campaigns."
  }
];

export const PricingCards = () => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    const packageId = planName.split(' ')[0].toLowerCase();
    setLoading(packageId);
    
    try {
      const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'dev-user-123' // Fallback for dev
        },
        body: JSON.stringify({ packageId })
      });

      if (response.ok) {
        alert('Successfully subscribed to ' + planName + '!');
        window.location.href = '/studio';
      } else {
        alert('Failed to subscribe.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Network error occurred.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-20">
      {PLANS.map((plan, idx) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className={`relative group h-full`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-secondary px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-secondary/20">
                Most Popular
              </div>
            </div>
          )}

          <div className={`h-full glass-card p-10 flex flex-col border-2 transition-all duration-500 ${plan.popular ? 'border-secondary/40 ring-4 ring-secondary/5' : 'border-white/5 hover:border-primary/20'}`}>
            {/* Header */}
            <div className="mb-10">
              <h3 className={`text-[11px] font-black uppercase tracking-[0.5em] mb-6 ${plan.color === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black italic tracking-tighter text-foreground">{plan.price}</span>
                <span className="text-xl font-bold text-muted">{plan.currency}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-6">{plan.period}</p>
              <p className="text-sm font-medium leading-relaxed text-foreground/70">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="flex-1 space-y-5 mb-12">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 border-b border-white/5 pb-2">What's Included</p>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className={`p-2 rounded-lg bg-foreground/5 border border-white/5 group-hover/item:border-primary/20 transition-colors`}>
                    <feature.icon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground/80 leading-snug">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-foreground/5 border border-white/5">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-relaxed">
                   <span className="text-primary">BEST FOR:</span> {plan.bestFor}
                </p>
              </div>
              <button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading === plan.name.split(' ')[0].toLowerCase()}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] italic transition-all duration-300 ${plan.color === 'secondary' ? 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:scale-[1.02]' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'} ${loading === plan.name.split(' ')[0].toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading === plan.name.split(' ')[0].toLowerCase() ? 'Processing...' : plan.cta}
              </button>
            </div>

            {/* Background Accent */}
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[120px] rounded-full pointer-events-none opacity-20 ${plan.color === 'secondary' ? 'bg-secondary' : 'bg-primary'}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
