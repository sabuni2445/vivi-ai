'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/studio');
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden bg-[#020108] font-sans selection:bg-purple-500/30 min-h-[calc(100vh/0.67)]">
      
      {/* 
        FULL-SCREEN IMMERSIVE VIDEO BACKGROUND 
        A grid of cinematic videos covering the entire screen, with a heavy vignette
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="grid grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 h-full w-full gap-1 opacity-40 transform scale-110 blur-[2px]">
          <video src="/videos/firefly_11.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline />
          <video src="/videos/firefly_12.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline />
          <video src="/videos/firefly_13.mp4" className="hidden lg:block w-full h-full object-cover" muted autoPlay loop playsInline />
          <video src="/videos/firefly_1.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline />
          <video src="/videos/firefly_2.mp4" className="w-full h-full object-cover" muted autoPlay loop playsInline />
          <video src="/videos/firefly_3.mp4" className="hidden lg:block w-full h-full object-cover" muted autoPlay loop playsInline />
        </div>
        {/* Deep cinematic vignette to make the center form pop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,1,8,0.3)_0%,rgba(2,1,8,0.85)_60%,rgba(2,1,8,1)_100%)]" />
        <div className="absolute inset-0 bg-[#020108]/30" />
      </div>

      {/* Hypnotic Animated Mesh Gradients behind the form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] opacity-60 pointer-events-none mix-blend-screen flex items-center justify-center z-10">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] bg-purple-600/50 rounded-full blur-[120px] translate-x-20 translate-y-10"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.3, 1] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[450px] h-[450px] bg-blue-600/40 rounded-full blur-[120px] -translate-x-20 -translate-y-20"
        />
        <motion.div 
          animate={{ rotate: 180, scale: [1, 1.5, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] bg-fuchsia-500/30 rounded-full blur-[100px]"
        />
      </div>

      {/* CENTERED ULTRA-PREMIUM AUTH FORM */}
      <div className="w-full max-w-[460px] px-6 relative z-30 perspective-[1000px]">
        
        <div className="flex justify-center mb-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            onClick={() => router.push('/')}
            className="cursor-pointer"
          >
            <span className="vivi-logo-text text-5xl tracking-tighter">vivi ai</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotateX: 10, y: 40 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative group/form"
        >
          {/* Ultra-Premium Glass Card Container */}
          <div className="relative p-10 sm:p-12 rounded-[40px] bg-black/40 border border-white/[0.08] backdrop-blur-[60px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),_0_40px_100px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
            
            {/* Glass Reflection Highlight */}
            <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-white/10 blur-[80px] rounded-full pointer-events-none opacity-50" />

            {/* Animated scanline over the glass */}
            <motion.div 
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent z-50 pointer-events-none shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />

            <div className="mb-10 text-center relative z-10">
              <h2 className="text-4xl font-black tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                {isLogin ? 'Welcome back.' : 'Start creating.'}
              </h2>
              <p className="text-sm text-white/40 font-medium">
                {isLogin ? 'Access your cinematic workspace.' : 'Join the next generation of AI filmmakers.'}
              </p>
            </div>

            {/* High-End Social Auth */}
            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <button className="group/social flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/5 hover:border-white/20 transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/social:bg-white/10 transition-colors">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                Google
              </button>
              <button className="group/social flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/5 hover:border-white/20 transition-all font-bold text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/social:bg-white/10 transition-colors">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                Apple
              </button>
            </div>

            <div className="relative mb-8 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                <span className="bg-[#0b0718] px-4 py-1 rounded-full text-white/30 border border-white/5 shadow-inner backdrop-blur-md">Or</span>
              </div>
            </div>

            {/* Form with Cyber-Capsule Inputs */}
            <form onSubmit={handleAuth} className="space-y-5 relative z-10">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative group rounded-2xl bg-black/60 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden focus-within:border-transparent focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-white/20 group-focus-within:text-purple-400 group-focus-within:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all" />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-transparent px-14 py-4 outline-none font-semibold placeholder:text-white/20 text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group rounded-2xl bg-black/60 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden focus-within:border-transparent focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/20 group-focus-within:text-purple-400 group-focus-within:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-transparent px-14 py-4 outline-none font-semibold placeholder:text-white/20 text-white"
                />
              </div>

              <div className="relative group rounded-2xl bg-black/60 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden focus-within:border-transparent focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/20 group-focus-within:text-purple-400 group-focus-within:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full bg-transparent px-14 py-4 outline-none font-semibold placeholder:text-white/20 text-white"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end pt-2">
                  <button type="button" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] hover:underline decoration-purple-500/50 underline-offset-4">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full group/btn relative py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 text-white font-black text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_80px_rgba(139,92,246,0.8)] transition-all hover:-translate-y-1 overflow-hidden mt-8 flex items-center justify-center gap-3 border border-white/20"
              >
                {/* High-end glossy reflection */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none" />
                
                {/* Animated shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                
                <span className="relative z-10 drop-shadow-md">{isLogin ? 'Sign In to Studio' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform drop-shadow-md" />
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-semibold text-white/40 relative z-10">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-purple-400 font-black transition-colors ml-1 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
