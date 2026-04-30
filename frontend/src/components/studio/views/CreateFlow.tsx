'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Share2, Download, Wand2, ArrowRight, Layers } from 'lucide-react';

interface CreateFlowProps {
  step: 'idle' | 'forming' | 'review' | 'preview' | 'loading' | 'result';
  setStep: (step: any) => void;
  setActiveTab: (tab: any) => void;
  mode: 'guided' | 'prompt';
  setMode: (mode: any) => void;
  form: any;
  setForm: (form: any) => void;
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  handleFormSubmit: () => void;
  handleVideoSynthesize: (finalScript: any) => void;
  progressStep: number;
  loadingMessages: string[];
  enhancedPrompt: string;
  generatedVideo: string | null;
  generatedCaption: string;
  generatedHashtags: string;
  setLogoFile: (file: File | null) => void;
  scriptData: any;
  setScriptData: (data: any) => void;
  T: any;
  marketingInsights?: {
    hook: string;
    audience: string;
    platform: string;
    strategy: string;
  };
  realTimeProgress?: { step: string, percentage: number } | null;
  handleFetchAssets?: () => void;
  assetsData?: any;
  selectedVisuals?: Record<string, string>;
  setSelectedVisuals?: (v: Record<string, string>) => void;
  credits?: number;
  handleRegenerateImage?: (sceneIndex: number) => void;
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
  handleVideoSynthesize,
  progressStep,
  loadingMessages,
  enhancedPrompt,
  generatedVideo,
  generatedCaption,
  generatedHashtags,
  setLogoFile,
  scriptData,
  setScriptData,
  T,
  marketingInsights,
  realTimeProgress,
  handleFetchAssets,
  assetsData,
  selectedVisuals,
  setSelectedVisuals,
  credits,
  handleRegenerateImage
}: CreateFlowProps) => {
  const [subStep, setSubStep] = React.useState(0);

  React.useEffect(() => {
    if (assetsData?.assets && selectedVisuals && Object.keys(selectedVisuals).length === 0) {
      const initials: Record<string, string> = {};
      assetsData.assets.forEach((a: any) => {
        if (a.options && a.options.length > 0) initials[a.sceneId] = a.options[0].url;
      });
      setSelectedVisuals?.(initials);
    }
  }, [assetsData, selectedVisuals, setSelectedVisuals]);

  const renderFormStep = () => {
    const commonSteps = [
      {
        title: "Format & Canvas",
        subtitle: "Where will your story live?",
        content: (
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Content Format</label>
              <div className="grid grid-cols-3 gap-4">
                {['TikTok', 'Instagram', 'Social Ad'].map((f) => (
                  <button key={f} onClick={() => { setForm({...form, format: f}); setSubStep(0); }} className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${form.format === f ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : 'bg-foreground/5 border-border hover:bg-foreground/10'}`}>
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Sparkles className={`w-4 h-4 ${form.format === f ? 'text-primary' : 'text-muted'}`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.format === f ? 'text-primary' : 'text-muted'}`}>{f}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-4">
                {[{ label: 'Vertical', ratio: '9:16', icon: '📱' }, { label: 'Square', ratio: '1:1', icon: '⬛' }, { label: 'Landscape', ratio: '16:9', icon: '📺' }].map((r) => (
                  <button key={r.ratio} onClick={() => setForm({...form, aspectRatio: r.ratio})} className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${form.aspectRatio === r.ratio ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/20' : 'bg-foreground/5 border-border hover:bg-foreground/10'}`}>
                    <span className="text-2xl">{r.icon}</span>
                    <span className={`block text-[10px] font-black uppercase tracking-widest ${form.aspectRatio === r.ratio ? 'text-secondary' : 'text-muted'}`}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      }
    ];

    const tiktokSteps = [
      ...commonSteps,
      {
        title: "The Viral Hook",
        subtitle: "The first 1.5 seconds are everything.",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Opening Style</label>
              <div className="grid grid-cols-2 gap-4">
                {['POV Style', 'Life Hack', 'Wait for it...', 'Storytime'].map(s => (
                  <button key={s} onClick={() => setForm({...form, vibe: s})} className={`p-4 rounded-xl border text-[10px] font-bold uppercase transition-all ${form.vibe === s ? 'bg-primary text-white' : 'bg-foreground/5'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">The "Thumb Stop" Text</label>
              <textarea value={form.hookText} onChange={(e) => setForm({...form, hookText: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-xl font-black italic" placeholder="e.g. Stop Scrolling if you want to save money..." />
            </div>
          </div>
        )
      },
      {
        title: "Creative Direction",
        subtitle: "What is actually happening on screen?",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Video Action</label>
              <textarea value={form.action} onChange={(e) => setForm({...form, action: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold min-h-[120px]" placeholder="e.g. A split screen of someone struggling vs. using the product, with quick cuts and text overlays." />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Key Message</label>
              <input type="text" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold" placeholder="e.g. This app saved me 10 hours a week" />
            </div>
          </div>
        )
      },
      {
        title: "Energy & Vibe",
        subtitle: "How fast should we move?",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Pacing</label>
              <select className="w-full bg-foreground/5 border border-border rounded-2xl p-6 font-bold" value={form.style} onChange={(e) => setForm({...form, style: e.target.value})}>
                <option value="Fast & Chaotic">Fast & Chaotic (High Energy)</option>
                <option value="Smooth & Satisfying">Smooth & Satisfying (ASMR)</option>
                <option value="Authentic & Raw">Authentic & Raw (Vlog Style)</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Background "Sound" Mood</label>
              <input type="text" value={form.vibe} onChange={(e) => setForm({...form, vibe: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 font-bold" placeholder="e.g. Upbeat House, Lofi Chill, Aggressive Phonk" />
            </div>
          </div>
        )
      }
    ];

    const instagramSteps = [
      ...commonSteps,
      {
        title: "Visual Palette",
        subtitle: "Crafting the perfect aesthetic.",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Mood Profile</label>
              <div className="grid grid-cols-2 gap-4">
                {['Minimalist', 'Luxury', 'Boho/Earth', 'Cyber/Neon'].map(m => (
                  <button key={m} onClick={() => setForm({...form, mood: m})} className={`p-6 rounded-xl border text-[10px] font-black uppercase transition-all ${form.mood === m ? 'bg-primary text-white' : 'bg-foreground/5'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Primary Brand Colors</label>
              <input type="text" value={form.colors} onChange={(e) => setForm({...form, colors: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold" placeholder="e.g. Sage Green & Cream" />
            </div>
          </div>
        )
      },
      {
        title: "Storytelling",
        subtitle: "The lifestyle behind the product.",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">The Narrative</label>
              <textarea value={form.narrative} onChange={(e) => setForm({...form, narrative: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold min-h-[120px]" placeholder="e.g. A transition from a messy workspace to a perfectly organized one using our desk setup." />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Visual Elements</label>
              <input type="text" value={form.visualElements} onChange={(e) => setForm({...form, visualElements: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold" placeholder="e.g. Coffee, Morning Sunlight, High-end furniture" />
            </div>
          </div>
        )
      },
      {
        title: "Brand Voice",
        subtitle: "How do we talk to the audience?",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {['Professional', 'Witty/Sassy', 'Inspiring'].map(t => (
                  <button key={t} onClick={() => setForm({...form, vibe: t})} className={`p-4 rounded-xl border text-[9px] font-black uppercase transition-all ${form.vibe === t ? 'bg-primary text-white' : 'bg-foreground/5'}`}>{t}</button>
                ))}
              </div>
            </div>
            <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold resize-none min-h-[100px]" placeholder="What is the one thing they should remember?" />
          </div>
        )
      }
    ];

    const adSteps = [
      ...commonSteps,
      {
        title: "Pain Point Analysis",
        subtitle: "What problem are we solving?",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">The "Frustration"</label>
              <textarea value={form.pain} onChange={(e) => setForm({...form, pain: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold min-h-[120px]" placeholder="Explain why the customer is currently unhappy..." />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Target Customer Profile</label>
              <input type="text" value={form.targetAudience} onChange={(e) => setForm({...form, targetAudience: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold" placeholder="e.g. Busy Moms, Freelancers" />
            </div>
          </div>
        )
      },
      {
        title: "Direct Response Flow",
        subtitle: "The journey from problem to solution.",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">The "Big Solve"</label>
              <textarea value={form.action} onChange={(e) => setForm({...form, action: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold min-h-[100px]" placeholder="Describe the exact moment the product solves the user's pain." />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Visual Metaphor</label>
              <input type="text" value={form.visualElements} onChange={(e) => setForm({...form, visualElements: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold" placeholder="e.g. From black & white to full color, weight being lifted" />
            </div>
          </div>
        )
      },
      {
        title: "The Irresistible Offer",
        subtitle: "Why should they click NOW?",
        content: (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Primary Deal/Value</label>
              <input type="text" value={form.offer} onChange={(e) => setForm({...form, offer: e.target.value})} className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-xl font-black text-secondary" placeholder="e.g. 30-Day Money Back Guarantee" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Final Call to Action</label>
              <select className="w-full bg-foreground/5 border border-border rounded-2xl p-6 font-bold" value={form.cta} onChange={(e) => setForm({...form, cta: e.target.value})}>
                <option value="Claim Offer Now">Claim Offer Now</option>
                <option value="Get Instant Access">Get Instant Access</option>
                <option value="Book Free Consultation">Book Free Consultation</option>
              </select>
            </div>
          </div>
        )
      }
    ];

    const getActiveSteps = () => {
      if (form.format === 'TikTok') return tiktokSteps;
      if (form.format === 'Instagram') return instagramSteps;
      return adSteps;
    };

    const steps = getActiveSteps();
    const currentStep = steps[subStep];

    return (
      <div className="space-y-12">
        <div className="flex items-center gap-4 mb-8">
           {steps.map((_, i) => (
             <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= subStep ? 'bg-primary' : 'bg-foreground/5'}`} />
           ))}
        </div>
        
        <div className="space-y-1">
          <motion.h2 key={currentStep.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-black italic uppercase tracking-tighter text-foreground">{currentStep.title}</motion.h2>
          <motion.p key={currentStep.subtitle} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-muted text-[11px] font-black uppercase tracking-[0.4em]">{currentStep.subtitle}</motion.p>
        </div>

        <motion.div key={`${form.format}-${subStep}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="min-h-[250px]">
          {currentStep.content}
        </motion.div>

        <div className="flex items-center justify-between pt-8 border-t border-border">
          <button 
            onClick={() => setSubStep(Math.max(0, subStep - 1))} 
            className={`text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground transition-all ${subStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            ← Previous
          </button>
          
          {subStep < steps.length - 1 ? (
            <button 
              onClick={() => setSubStep(subStep + 1)} 
              className="primary-btn px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-primary/20"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFormSubmit} 
              className="primary-btn px-16 py-6 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl shadow-primary/30"
            >
              Begin Campaign Synthesis <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div key="create-space" className="flex-1 flex flex-col relative w-full pt-6">
      <AnimatePresence mode="wait">
        {(() => {
          switch(step) {
            case 'forming':
              return (
                <motion.div key="forming" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto w-full px-6 py-8">
                  <div className="glass-card p-12 relative z-10 overflow-hidden inner-glow group">
                      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                      
                       <div className="flex items-center justify-between mb-16">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-muted flex items-center gap-3">
                            <Layers className="w-4 h-4 text-primary" /> Strategy Briefing
                          </h3>
                          <div className="flex items-center gap-6">
                            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-3">
                              <Sparkles className="w-3 h-3 text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{credits ?? 0} Credits</span>
                            </div>
                            <div className="flex gap-2 p-1 bg-foreground/5 rounded-xl border border-border">
                              <button onClick={() => setMode('guided')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'guided' ? 'bg-primary text-white' : 'text-muted'}`}>Guided</button>
                              <button onClick={() => setMode('prompt')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'prompt' ? 'bg-primary text-white' : 'text-muted'}`}>Expert</button>
                            </div>
                          </div>
                       </div>

                      {mode === 'guided' ? renderFormStep() : (
                        <div className="space-y-8">
                          <label className="text-[10px] font-black uppercase text-primary tracking-[0.4em] flex items-center gap-3">
                            <Wand2 className="w-4 h-4" /> Custom Prompt
                          </label>
                          <textarea value={originalPrompt} onChange={(e) => setOriginalPrompt(e.target.value)} className="w-full bg-foreground/5 border border-border rounded-[32px] p-12 text-3xl font-black min-h-[400px] resize-none focus:outline-none italic placeholder:text-muted/10 leading-tight text-foreground" placeholder="Describe your vision..." />
                          <button onClick={handleFormSubmit} className="w-full primary-btn py-8 rounded-[32px] font-black text-2xl tracking-[0.2em] uppercase italic transition-all disabled:opacity-50" disabled={!originalPrompt}>
                            Start Synthesis
                          </button>
                        </div>
                      )}
                  </div>
                </motion.div>
              );
            case 'review':
              return (
                <motion.div key="review" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="max-w-6xl mx-auto w-full px-6 py-8">
                  <div className="flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground">Campaign Strategy</h2>
                          <p className="text-muted text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-orange-400" /> Neural Strategy Engine 2.0 • Phase 2: Refinement
                          </p>
                       </div>
                       <button onClick={() => setStep('forming')} className="px-6 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground hover:bg-foreground/5 mb-4">Re-Brief</button>
                    </div>

                    {(scriptData?.strategy?.summary || scriptData?.strategyExplanation) && (
                      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 mb-4">
                        <div className="flex items-center gap-3 mb-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                          <Wand2 className="w-4 h-4" /> Compiler Insight: Logic Trace
                        </div>
                        <p className="text-foreground/80 font-bold italic text-lg leading-relaxed">
                          "{scriptData?.strategy?.summary || scriptData.strategyExplanation}"
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                       <div className="lg:col-span-8 space-y-6">
                          {scriptData?.scenes?.map((scene: any, idx: number) => (
                             <div key={idx} className="studio-panel p-8 group hover:border-primary/40 transition-all relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                <div className="flex items-start gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                      <span className="text-xl font-black italic text-primary">{idx + 1}</span>
                                   </div>
                                   <div className="flex-1 space-y-4">
                                      <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-4">
                                           <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">{idx === 0 ? 'Hook' : idx === 1 ? 'Problem' : idx === 2 ? 'Solution' : 'CTA'}</span>
                                         </div>
                                      </div>
                                      
                                       <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                         <div className="md:col-span-8 space-y-6">
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-black text-muted uppercase tracking-widest italic">Scene Script (Voiceover)</label>
                                              <textarea 
                                                value={scene.voiceover || scene.dialogue || scene.text || ""} 
                                                onChange={(e) => {
                                                  const newScenes = [...scriptData.scenes];
                                                  const field = scene.voiceover ? 'voiceover' : (scene.dialogue ? 'dialogue' : 'text');
                                                  newScenes[idx][field] = e.target.value;
                                                  setScriptData({...scriptData, scenes: newScenes});
                                                }}
                                                className="w-full bg-foreground/5 border border-border/50 rounded-xl p-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all resize-none min-h-[80px]"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-black text-muted uppercase tracking-widest italic">Visual Search Prompt</label>
                                              <div className="flex gap-3">
                                                <input 
                                                  type="text"
                                                  value={scene.visual_prompt || scene.visual || scene.keywords || ""}
                                                  onChange={(e) => {
                                                    const newScenes = [...scriptData.scenes];
                                                    newScenes[idx].visual_prompt = e.target.value;
                                                    setScriptData({...scriptData, scenes: newScenes});
                                                  }}
                                                  className="flex-1 bg-foreground/5 border border-border/50 rounded-xl p-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] focus:outline-none focus:border-primary/50 transition-all"
                                                />
                                                <button 
                                                  onClick={() => handleRegenerateImage?.(idx)}
                                                  className="px-4 bg-secondary/10 border border-secondary/20 rounded-xl hover:bg-secondary/20 transition-all"
                                                  title="Regenerate AI Image"
                                                >
                                                  <Wand2 className="w-4 h-4 text-secondary" />
                                                </button>
                                              </div>
                                            </div>
                                         </div>
                                         <div className="md:col-span-4">
                                            <div className="aspect-[9/16] bg-foreground/5 rounded-2xl overflow-hidden border border-border relative group/img">
                                              {scene.image_url ? (
                                                <img src={scene.image_url} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />
                                              ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted">AI Generating...</span>
                                                </div>
                                              )}
                                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">9:16 AI Preview</span>
                                              </div>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>

                       <div className="lg:col-span-4 space-y-8">
                          <div className="glass-card p-10 space-y-8 border-secondary/20">
                             <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase text-secondary tracking-[0.4em] flex items-center gap-3">Social Media Caption</label>
                               <textarea 
                                 value={scriptData?.caption} 
                                 onChange={(e) => setScriptData({...scriptData, caption: e.target.value})}
                                 className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/20 min-h-[120px] resize-none"
                               />
                             </div>
                             <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase text-secondary tracking-[0.4em] flex items-center gap-3">Optimization Tags</label>
                               <input 
                                 type="text" 
                                 value={typeof scriptData?.hashtags === 'string' ? scriptData.hashtags : scriptData?.hashtags?.join(' ')} 
                                 onChange={(e) => setScriptData({...scriptData, hashtags: e.target.value.split(' ')})}
                                 className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/20"
                               />
                             </div>
                             <div className="pt-6">
                                 <motion.button 
                                   onClick={() => handleVideoSynthesize(scriptData)}
                                   whileHover={{ scale: 1.02 }} 
                                   whileTap={{ scale: 0.98 }} 
                                   className="w-full primary-btn py-6 rounded-2xl font-black text-lg tracking-[0.2em] uppercase italic flex items-center justify-center gap-4"
                                   disabled={scriptData?.scenes?.some((s: any) => !s.image_url)}
                                 >
                                   Produce Final Video <ArrowRight className="w-5 h-5" />
                                 </motion.button>
                                 <p className="text-[9px] text-center mt-6 font-black text-muted uppercase tracking-[0.4em]">Cost: 1 Production Credit</p>
                              </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            case 'preview':
              return (
                <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-6xl mx-auto space-y-8 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-4xl font-black text-foreground italic tracking-tighter uppercase">Scene Visuals</h2>
                      <p className="text-muted tracking-[0.2em] uppercase text-xs font-bold mt-2">Human-In-The-Loop Validation</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {assetsData?.assets?.map((asset: any) => (
                      <div key={asset.sceneId} className="bg-foreground/5 border border-border rounded-2xl p-4 space-y-4">
                         <div className="flex justify-between items-center text-xs font-black uppercase text-muted tracking-widest">
                           <span>Scene {asset.sceneId}</span>
                         </div>
                         <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden relative border border-border">
                           <video key={selectedVisuals?.[asset.sceneId] || asset.options?.[0]?.url} src={selectedVisuals?.[asset.sceneId] || asset.options?.[0]?.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                           <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                             <p className="text-white text-[10px] font-mono tracking-wider opacity-80 truncate">{asset.keywords}</p>
                           </div>
                         </div>
                         
                         {/* Option grid */}
                         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                           {asset.options?.map((opt: any) => {
                             const isSelected = selectedVisuals?.[asset.sceneId] === opt.url;
                             return (
                               <button 
                                 key={opt.id} 
                                 onClick={() => setSelectedVisuals?.({ ...selectedVisuals, [asset.sceneId]: opt.url })}
                                 className={`flex-shrink-0 w-12 h-16 rounded-md overflow-hidden border-2 transition-all ${isSelected ? 'border-primary shadow-[0_0_10px_var(--primary)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                               >
                                 <img src={opt.fallbackThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                               </button>
                             );
                           })}
                         </div>

                         <audio src={asset.audioUrl} controls className="w-full h-8" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-8">
                    <motion.button 
                      onClick={() => handleVideoSynthesize(scriptData)}
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="w-96 primary-btn py-5 rounded-xl font-black text-lg tracking-[0.2em] uppercase italic flex items-center justify-center gap-4"
                    >
                      Finalize & Render <ArrowRight className="w-5 h-5" />
                    </motion.button>
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
                      <motion.circle cx="160" cy="160" r="145" stroke="var(--primary)" strokeWidth="14" fill="none" strokeDasharray="910" initial={{ strokeDashoffset: 910 }} animate={{ strokeDashoffset: 910 - ((realTimeProgress?.percentage || 0) / 100) * 910 }} strokeLinecap="round" className="transition-all duration-700 ease-in-out" />
                    </svg>
                    <div className="absolute text-5xl font-black text-foreground italic flex items-center gap-2">
                      {realTimeProgress?.percentage || 0}<span className="text-primary text-3xl">%</span>
                    </div>
                  </div>
                  <div className="text-center space-y-12 max-w-2xl px-6">
                     <AnimatePresence mode="popLayout">
                       <motion.div key={progressStep} initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }} className="space-y-4">
                         <h2 className="text-6xl font-black italic tracking-tighter text-foreground uppercase leading-none">{loadingMessages[progressStep]}</h2>
                         <p className="text-muted tracking-[0.4em] uppercase text-[10px] font-black">OpenArt Neural Engine Active</p>
                       </motion.div>
                     </AnimatePresence>
                     <div className="w-64 h-1.5 bg-foreground/5 rounded-full overflow-hidden mx-auto">
                        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${realTimeProgress?.percentage || 0}%` }} transition={{ duration: 0.5 }} />
                     </div>
                  </div>
                </motion.div>
              );
            case 'result':
              return (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col relative z-20 px-8 pt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                      <div className="aspect-video bg-black rounded-[48px] overflow-hidden border border-border shadow-2xl relative transition-transform duration-700 hover:scale-[1.01] inner-glow">
                        {generatedVideo && (
                          <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-cover" />
                        )}
                        {!generatedVideo && (
                           <div className="w-full h-full flex items-center justify-center text-muted font-black italic uppercase tracking-widest">Processing Final Output...</div>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                         <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-tight text-foreground">Studio Output Ready</h1>
                            <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-4">
                               <CheckCircle2 className="w-6 h-6 text-green-500" /> Ultra-HD Optimization Applied
                            </p>
                         </div>
                         <div className="flex gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-10 py-6 rounded-3xl bg-foreground/5 border border-border text-[11px] font-black tracking-widest uppercase hover:bg-foreground/10 transition-all flex items-center justify-center gap-4 text-foreground"><Share2 className="w-5 h-5" /> Copy Link</button>
                            <a 
                              href={generatedVideo || '#'} 
                              download="vivi_ai_production.mp4"
                              className="flex-1 md:flex-none primary-btn px-12 py-6 rounded-3xl text-[11px] font-black tracking-widest uppercase shadow-2xl flex items-center justify-center gap-4 text-white"
                            >
                              <Download className="w-5 h-5" /> Download 4K
                            </a>
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
                               <p className="text-[10px] uppercase font-black text-secondary tracking-[0.6em] italic">Marketing Intelligence</p>
                               <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                             </div>
                             <div className="space-y-4">
                                {marketingInsights && (
                                  <div className="space-y-3 bg-foreground/5 p-6 rounded-2xl border border-border/10">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] opacity-70">Hook</span>
                                      <span className="text-sm font-bold text-foreground">"{marketingInsights.hook}"</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] opacity-70">Marketing Strategy</span>
                                      <span className="text-xs font-bold text-foreground italic">"{marketingInsights.strategy}"</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] opacity-70">Target Audience</span>
                                      <span className="text-xs font-bold text-foreground/80">{marketingInsights.audience}</span>
                                    </div>
                                  </div>
                                )}
                                <div className="text-[11px] leading-relaxed font-bold text-foreground/80 tracking-widest uppercase italic bg-foreground/5 p-6 rounded-2xl border border-border/10">
                                  {generatedCaption || "AI is composing your social copy..."}
                                </div>
                                <div className="text-[10px] font-black text-secondary tracking-widest opacity-60 px-2 leading-loose">
                                  {generatedHashtags || "#ViviAI #Marketing #Automation"}
                                </div>
                                <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Predicted Engagement</span>
                                  <span className="text-sm font-black text-primary">+32%</span>
                                </div>
                             </div>
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
