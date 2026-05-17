'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Sparkles, 
  Zap, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  Check, 
  ArrowRight,
  MonitorPlay,
  QrCode,
  LayoutDashboard,
  Film
} from 'lucide-react';
import { DynamicGrid, CanvasParticles } from '@/components/ui/AntigravityBackground';

interface LandingProps {
  mousePosition: { x: number; y: number };
  setView: (view: any) => void;
}

export const ViviLanding = ({ mousePosition, setView }: LandingProps) => {
  const [activePlan, setActivePlan] = useState<'starter' | 'popular' | 'business'>('popular');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '2,500 ETB',
      credits: 3,
      features: [
        '3 Cinematic AI Videos',
        '15 AI-Generated Images',
        'Standard Rendering',
        'Commercial Use Support'
      ]
    },
    {
      id: 'creator',
      name: 'Creator Plan',
      price: '6,500 ETB',
      credits: 10,
      popular: true,
      features: [
        '10 Cinematic AI Videos',
        '50 AI-Generated Images',
        'Priority Rendering',
        'Enhanced Cinematic Motion'
      ]
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: '15,000 ETB',
      credits: 30,
      features: [
        '30 Cinematic AI Videos',
        'Unlimited AI Images',
        'Premium Quality Rendering',
        'Team Collaboration'
      ]
    }
  ];

  const steps = [
    { title: 'Enter Product Info', desc: 'Paste a URL or describe your product', icon: MonitorPlay },
    { title: 'AI Generates Scenes', desc: 'Smart AI creates ad scripts & visuals', icon: Sparkles },
    { title: 'Select Visuals', desc: 'Choose your preferred AI images', icon: ImageIcon },
    { title: 'Cinematic Render', desc: 'AI generates your final video ad', icon: Film },
  ];

  const features = [
    'AI Script Generation',
    'Cinematic Video Rendering',
    'Smart Scene Creation',
    'Social Media Optimization',
    'Fast Cloud Processing',
    'Ethiopian Business Focus'
  ];

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-purple-500/30 relative overflow-hidden bg-[#05050A]"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1A1245_0%,transparent_50%)] opacity-60" />
        <div className="absolute w-[800px] h-[800px] bg-purple-600/10 blur-[120px] rounded-full top-[10%] left-[20%]" />
        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full bottom-[10%] right-[20%]" />
        <div className="absolute inset-0 opacity-20" style={{ perspective: '1000px' }}>
          <div className="w-full h-full transform-gpu rotate-x-[60deg] scale-[2]">
            <DynamicGrid />
          </div>
        </div>
        <CanvasParticles mousePosition={mousePosition} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="vivi-logo-text text-3xl tracking-tighter">vivi ai</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('auth')} className="text-sm font-medium text-white/70 hover:text-white transition-colors">Login</button>
            <button onClick={() => setView('auth')} className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-purple-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Unified Apple-Level Hero Showcase Section */}
      <section className="relative pt-40 pb-32 px-6 w-full flex flex-col items-center text-center z-10 overflow-hidden perspective-[2000px] min-h-screen">
        
        {/* Deep background gradient & grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#020108]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[100vh] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15)_0%,transparent_70%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Animated Connecting Dots */}
          <CanvasParticles mousePosition={mousePosition} />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} 
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[1.05] mb-8"
          >
            Create <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-fuchsia-400 to-blue-500 animate-gradient drop-shadow-[0_0_40px_rgba(192,132,252,0.4)]">movies</span><br />
            from imagination.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} 
            className="text-xl md:text-2xl text-white/60 max-w-3xl mb-12 font-medium tracking-tight"
          >
            Generate cinematic AI videos, ads, stories, and visuals in seconds.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} 
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button onClick={() => setView('auth')} className="px-10 py-5 rounded-full bg-white text-black font-extrabold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:scale-105 flex items-center gap-2">
              Start Creating <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setView('auth')} className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md">
              Watch Demo <Play className="w-5 h-5 fill-current" />
            </button>
          </motion.div>
        </div>

        {/* Centerpiece: The 3D Fan Stack */}
        <div className="relative mt-24 h-[600px] md:h-[800px] w-full max-w-7xl mx-auto flex items-center justify-center z-30">
          
          {/* Subtle rotating aurora behind cards */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] opacity-20 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(96,165,250,0.3) 90deg, transparent 180deg, rgba(157,92,255,0.3) 270deg, transparent 360deg)'
            }}
          />

          <motion.div 
            className="relative w-full max-w-5xl h-full flex items-center justify-center transform-style-3d group/showcase"
            initial={{ opacity: 0, rotateX: 30, y: 150 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, type: "spring", bounce: 0.3 }}
            style={{
              rotateY: `calc((var(--mouse-x) - 50vw) * 0.015deg)`,
              rotateX: `calc((var(--mouse-y) - 50vh) * -0.015deg)`,
            }}
          >
            {[1, 2, 3, 4, 5].map((i, index) => {
              const isCenter = index === 2;
              const offset = index - 2; 
              const rotation = offset * 8; 
              const translateX = offset * 110; 
              const translateY = Math.abs(offset) * 25; 
              const zTranslate = -Math.abs(offset) * 80; 
              
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + (index * 0.1), type: "spring", stiffness: 100 }}
                  style={{ 
                    rotateZ: rotation, 
                    x: translateX, 
                    y: translateY,
                    z: zTranslate,
                    zIndex: 10 - Math.abs(offset)
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateZ: 0, 
                    y: -40,
                    z: 50,
                    zIndex: 50,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className={`absolute aspect-[9/16] ${isCenter ? 'w-[280px] md:w-[380px]' : 'w-[240px] md:w-[320px]'} rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-[1px] border-white/20 bg-[#05050A] cursor-pointer group/card glass-card`}
                >
                  {/* Premium Glass Edge Glow */}
                  <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] p-[1px] bg-gradient-to-br from-white/40 via-white/5 to-transparent pointer-events-none opacity-60 group-hover/card:opacity-100 transition-opacity z-20" />
                  
                  <video 
                    src={`/videos/firefly_${i}.mp4`} 
                    className="w-full h-full object-cover rounded-[2rem] md:rounded-[3rem] filter brightness-90 group-hover/card:brightness-110 transition-all duration-700" 
                    muted loop playsInline 
                    autoPlay={isCenter}
                    onMouseEnter={(e) => { e.currentTarget.play(); e.currentTarget.muted = false; }}
                    onMouseLeave={(e) => { if(!isCenter) { e.currentTarget.pause(); } e.currentTarget.muted = true; }}
                  />
                  
                  {/* Ambient Shadows & Vignette */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-30 transition-opacity duration-700 z-10" />
                  
                </motion.div>
              );
            })}

            {/* Floating AI Feature Tags */}
            {[
              { text: "4K Cinematic", top: "10%", left: "5%", delay: 1.0, yAnim: [0, -20, 0] },
              { text: "Text to Video", top: "70%", left: "2%", delay: 1.2, yAnim: [0, -15, 0] },
              { text: "Studio Lighting", top: "15%", left: "85%", delay: 1.1, yAnim: [0, -25, 0] },
              { text: "Ultra Realism", top: "65%", left: "88%", delay: 1.3, yAnim: [0, -18, 0] },
              { text: "Instant Rendering", top: "85%", left: "20%", delay: 1.4, yAnim: [0, -22, 0] },
              { text: "AI Motion Engine", top: "80%", left: "75%", delay: 1.5, yAnim: [0, -16, 0] },
            ].map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: tag.delay, type: "spring" }}
                className="absolute hidden lg:flex items-center gap-3 px-5 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40"
                style={{ top: tag.top, left: tag.left }}
              >
                <motion.div
                  animate={{ y: tag.yAnim }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)] animate-pulse" />
                  <span className="text-sm font-bold text-white/90 tracking-wide">{tag.text}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Fading Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="relative z-20 mt-10 flex flex-col items-center pb-20"
        >
          <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-[0.3em] mb-8">Powered by industry-leading AI models</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-xl md:text-2xl font-black tracking-tighter">KLING AI</span>
             <span className="text-xl md:text-2xl font-black tracking-tighter">FREEPIK MYSTIC</span>
             <span className="text-xl md:text-2xl font-black tracking-tighter">ELEVENLABS</span>
          </div>
        </motion.div>

        {/* Dashboard Preview Glass Hint */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 w-[90vw] max-w-6xl h-[400px] rounded-[3rem] bg-white/[0.02] backdrop-blur-[100px] border border-white/10 shadow-[0_-30px_100px_rgba(139,92,246,0.15)] z-0 hidden md:block" />
        
      </section>

      {/* Premium AI Pricing Section */}
      <section className="relative py-40 px-6 z-10 overflow-hidden bg-[#020108]">
        {/* Deep background gradients */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-20">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
            >
              Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">creative power.</span>
            </motion.h2>
            <p className="text-xl text-white/50 mb-12">Scale from solo creators to full AI-powered studios.</p>

            {/* Futuristic Toggle Switch */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 rounded-full bg-white/10 border border-white/20 relative flex items-center px-1 transition-all hover:bg-white/15"
              >
                <motion.div 
                  layout
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                  animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-white/40'}`}>Yearly</span>
                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)] animate-pulse">Save 30%</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 group"
            >
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-white/40 mb-6">Perfect for startups & sellers</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black">2,500</span>
                <span className="text-white/40 text-sm">ETB</span>
              </div>
              <button onClick={() => setView('auth')} className="w-full py-4 rounded-full bg-white/5 border border-white/10 font-bold mb-8 hover:bg-white/10 transition-colors">
                Start Free
              </button>
              <ul className="space-y-4">
                {[
                  '3 Cinematic AI Videos',
                  '15 AI-Generated Images',
                  '5 HD Image Enhancements',
                  'Background Removals',
                  'Commercial Use Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0 group-hover:text-purple-400 transition-colors" /> {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro Plan (Center Elevated) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-10 rounded-[32px] bg-[#0A051A]/80 border border-purple-500/30 backdrop-blur-2xl shadow-[0_20px_80px_rgba(139,92,246,0.15)] z-20 md:-translate-y-6 hover:shadow-[0_20px_100px_rgba(139,92,246,0.25)] transition-all duration-500 group"
            >
              {/* Glowing animated border */}
              <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-purple-500/50 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              {/* Floating particles hint */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
              
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                Most Popular
              </div>

              <h3 className="text-2xl font-bold mb-2">Creator</h3>
              <p className="text-sm text-purple-200/50 mb-6">For agencies & influencers</p>
              <div className="flex items-baseline gap-2 mb-8 relative">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                  6,500
                </span>
                <span className="text-white/40 text-sm">ETB</span>
              </div>
              <button onClick={() => setView('auth')} className="group/btn relative w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-bold mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                Go Pro
              </button>
              
              {/* Neon Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-8" />

              <ul className="space-y-4">
                {[
                  '10 Cinematic AI Videos',
                  '50 AI-Generated Images',
                  'Priority Rendering Queue',
                  'Enhanced Cinematic Motion',
                  'AI Product Photography',
                  'Commercial Use License',
                  'Priority Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90 font-medium">
                    <Zap className="w-5 h-5 text-purple-400 shrink-0 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 group"
            >
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-sm text-white/40 mb-6">Professional brand scaling</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black">15,000</span>
                <span className="text-white/40 text-sm">ETB</span>
              </div>
              <button onClick={() => setView('auth')} className="w-full py-4 rounded-full bg-white text-black font-bold mb-8 hover:bg-gray-200 transition-colors">
                Contact Sales
              </button>
              <ul className="space-y-4">
                {[
                  '30 Cinematic AI Videos',
                  'Unlimited AI Images',
                  'Unlimited 4K Enhancements',
                  'Premium Cinematic Rendering',
                  'Team Collaboration Features',
                  'Bulk AI Generation Tools',
                  'Full Commercial Usage Rights'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0 group-hover:text-blue-400 transition-colors" /> {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* AI Engine Capabilities Marquee */}
          <div className="mt-32 pt-16 border-t border-white/5 overflow-hidden">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Neural Engine Online</span>
              </div>
            </div>
            
            <div className="relative w-full overflow-hidden flex whitespace-nowrap py-4">
              {/* Fade gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020108] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020108] to-transparent z-10 pointer-events-none" />
              
              {/* Moving Track */}
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                className="flex items-center gap-8 md:gap-16 text-3xl md:text-6xl font-black tracking-tighter text-white/10 uppercase"
              >
                {/* We double the content for infinite scroll effect */}
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    <span className="hover:text-purple-400 transition-colors duration-300 cursor-default">4K Cinematic</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                    <span className="hover:text-blue-400 transition-colors duration-300 cursor-default">Voice Cloning</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                    <span className="hover:text-white transition-colors duration-300 cursor-default">AI Scripting</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                    <span className="hover:text-purple-400 transition-colors duration-300 cursor-default">Lip Sync</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                    <span className="hover:text-blue-400 transition-colors duration-300 cursor-default">Scene Gen</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                    <span className="hover:text-white transition-colors duration-300 cursor-default">Visual FX</span>
                    <span className="text-purple-500/30 text-xl md:text-3xl">✦</span>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic AI Pipeline Journey */}
      <section className="relative py-40 px-6 z-10 overflow-hidden bg-[#020108]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.05)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">How imagination becomes cinema.</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">From idea to cinematic AI advertisement in under 60 seconds.</p>
          </div>

          <div className="relative">
            {/* The Horizontal Glowing Pathway */}
            <div className="absolute top-32 left-[10%] right-[10%] h-[1px] bg-white/5 hidden lg:block">
              <motion.div 
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[1px] shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>

            <div className="grid lg:grid-cols-4 gap-20 lg:gap-8 relative z-10">
              {/* Step 1: Idea Input */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative flex flex-col items-center group">
                <div className="w-48 h-48 rounded-full bg-[#05050A] border border-white/5 flex items-center justify-center relative mb-12 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-3/4 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center px-4 backdrop-blur-md shadow-inner">
                      <span className="text-[10px] text-white/50 font-mono flex items-center whitespace-nowrap">Create an ad for...<span className="w-1.5 h-3 bg-white/80 ml-1 animate-pulse" /></span>
                   </div>
                </div>
                <div className="text-center px-4">
                  <div className="text-blue-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Phase 01</div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Idea Input</h3>
                  <p className="text-white/40 text-sm leading-relaxed">Describe your product or paste a URL</p>
                </div>
              </motion.div>

              {/* Step 2: AI Brain */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative flex flex-col items-center group">
                <div className="w-48 h-48 rounded-full bg-[#05050A] border border-white/5 flex items-center justify-center relative mb-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-purple-500/30 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]">
                   <div className="absolute inset-0 rounded-full border border-purple-500/20 border-dashed animate-[spin_10s_linear_infinite]" />
                   <div className="absolute inset-4 rounded-full border border-blue-500/10 border-dotted animate-[spin_15s_linear_infinite_reverse]" />
                   <Sparkles className="w-10 h-10 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-center px-4">
                  <div className="text-purple-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Phase 02</div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Neural Core</h3>
                  <p className="text-white/40 text-sm leading-relaxed">AI writes scenes, hooks, scripts, and creative direction</p>
                </div>
              </motion.div>

              {/* Step 3: Visual Generation */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="relative flex flex-col items-center group">
                <div className="w-48 h-48 rounded-full bg-[#05050A] border border-white/5 flex items-center justify-center relative mb-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-fuchsia-500/30 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(217,70,239,0.2)] perspective-[1000px]">
                   <div className="absolute w-12 h-16 rounded-lg bg-white/5 border border-white/10 transform rotate-[-20deg] -translate-x-6 translate-y-2 group-hover:-translate-x-8 transition-transform duration-500 backdrop-blur-sm" />
                   <div className="absolute w-14 h-20 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500 backdrop-blur-md flex items-center justify-center">
                     <ImageIcon className="w-4 h-4 text-white/50" />
                   </div>
                   <div className="absolute w-12 h-16 rounded-lg bg-white/5 border border-white/10 transform rotate-[20deg] translate-x-6 translate-y-2 group-hover:translate-x-8 transition-transform duration-500 backdrop-blur-sm" />
                </div>
                <div className="text-center px-4">
                  <div className="text-fuchsia-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Phase 03</div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Visual Gen</h3>
                  <p className="text-white/40 text-sm leading-relaxed">Generate multiple AI scenes and visual styles instantly</p>
                </div>
              </motion.div>

              {/* Step 4: Cinematic Render */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="relative flex flex-col items-center group">
                <div className="w-48 h-48 rounded-full bg-[#05050A] border border-white/5 flex items-center justify-center relative mb-12 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.1)]">
                   <div className="w-32 h-20 rounded-xl border border-white/20 bg-black flex items-center justify-center relative overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                     <Play className="w-6 h-6 text-white ml-1" />
                     <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white/50">Rendering 99%</div>
                   </div>
                </div>
                <div className="text-center px-4">
                  <div className="text-white font-black text-[10px] tracking-[0.3em] uppercase mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Phase 04</div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Final Render</h3>
                  <p className="text-white/40 text-sm leading-relaxed">Export studio-quality cinematic ads ready for social media</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Massive Cinematic Bottom CTA */}
      <section className="relative py-48 px-6 z-10 overflow-hidden bg-[#020108]">
        {/* Massive Glowing Orb Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1500px] max-h-[1500px] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15)_0%,transparent_50%)] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-5xl mx-auto text-center relative z-20 flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-8"
          >
            Start creating cinematic <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-300 to-blue-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">AI ads today.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl text-white/60 mb-16 max-w-3xl mx-auto tracking-tight"
          >
            No editing team. No expensive production. Just imagination.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-2xl opacity-50 animate-pulse" />
            <button onClick={() => setView('auth')} className="group relative px-10 py-6 md:px-16 md:py-8 rounded-full bg-white text-black font-black text-xl md:text-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] transition-all hover:scale-105 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10 flex items-center gap-4">Generate Your First Video <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" /></span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-[#020108] z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            <span className="vivi-logo-text text-3xl tracking-tighter">vivi ai</span>
          </div>
          <div className="text-sm font-bold text-white/30 uppercase tracking-widest">
            © {new Date().getFullYear()} VIVI AI
          </div>
          <div className="flex gap-8 text-sm font-bold text-white/40 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
