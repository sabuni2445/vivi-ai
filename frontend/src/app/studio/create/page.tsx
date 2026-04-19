'use client';

import { useState, useEffect } from 'react';
import { CreateFlow } from '@/components/studio/views/CreateFlow';
import { useStudio } from '@/context/StudioContext';

const PRE_MADE_VIDEOS = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4',
  '/videos/video5.mp4'
];

export default function CreatePage() {
  const { T, lang, addUserAsset } = useStudio();
  const [mode, setMode] = useState<'guided' | 'prompt'>('guided');
  const [step, setStep] = useState<'idle' | 'forming' | 'review' | 'preview' | 'loading' | 'result'>('forming');
  const [progressStep, setProgressStep] = useState(0);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    product: '',
    style: 'Modern',
    platform: 'Instagram',
    format: 'TikTok',
    aspectRatio: '9:16',
    goal: 'Sales Conversion',
    targetAudience: 'Young Professionals',
    description: '',
    // Specialized Fields
    vibe: '',
    hookText: '',
    action: '',
    message: '',
    mood: '',
    colors: '',
    narrative: '',
    visualElements: '',
    pain: '',
    offer: '',
    cta: 'Claim Offer Now'
  });

  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [scriptData, setScriptData] = useState<any>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [marketingInsights, setMarketingInsights] = useState<{hook: string, audience: string, platform: string, strategy?: string} | undefined>(undefined);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [realTimeProgress, setRealTimeProgress] = useState<{step: string, percentage: number} | null>(null);
  const [assetsData, setAssetsData] = useState<any>(null);
  const [selectedVisuals, setSelectedVisuals] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('vivi_studio_persist');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.step) {
           // Prevent loading screen soft-locks on refresh
           setStep(['loading'].includes(state.step) ? 'forming' : state.step);
        }
        if (state.form) setForm(state.form);
        if (state.originalPrompt) setOriginalPrompt(state.originalPrompt);
        if (state.scriptData) setScriptData(state.scriptData);
        if (state.assetsData) setAssetsData(state.assetsData);
        if (state.selectedVisuals) Object.keys(state.selectedVisuals).length > 0 && setSelectedVisuals(state.selectedVisuals);
        if (state.campaignId) setCampaignId(state.campaignId);
        if (state.generatedVideo) setGeneratedVideo(state.generatedVideo);
      } catch (e) {
        console.error("Hydration Failed", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('vivi_studio_persist', JSON.stringify({
      step, form, originalPrompt, scriptData, assetsData, selectedVisuals, campaignId, generatedVideo
    }));
  }, [step, form, originalPrompt, scriptData, assetsData, selectedVisuals, campaignId, generatedVideo]);

  // Phase 1: Generate Script for Review
  const handleScriptGenerate = async () => {
    let finalPrompt = '';
    if (mode === 'guided') {
      finalPrompt = `
        USER STRATEGY BRIEF:
        - Main Brand/Business: ${form.businessName} (${form.businessType})
        - Core Product/Service: ${form.product}
        - Primary Goal: ${form.goal}
        - Target Audience: ${form.targetAudience}
        - Target Platform: ${form.format} (${form.aspectRatio})
        
        PLATFORM-SPECIFIC DIRECTION:
        - Opening Hook Style: ${form.vibe}
        - On-Screen Hook Text: ${form.hookText}
        - Main Narrative/Story: ${form.narrative}
        - Core Visual Action: ${form.action}
        - Key Visual Elements: ${form.visualElements}
        - Customer Pain Point: ${form.pain}
        - Primary Offer: ${form.offer}
        - Call to Action: ${form.cta}
        
        VISUAL DNA:
        - Overall Style: ${form.style}
        - Mood Profile: ${form.mood}
        - Brand Colors: ${form.colors}
        - Final Message: ${form.message}

        ADDITIONAL CONTEXT: ${originalPrompt || 'None'}
      `.trim();
    } else {
      finalPrompt = originalPrompt;
    }

    setOriginalPrompt(finalPrompt);
    setStep('loading');
    setProgressStep(0);

    try {
      // Create Database Campaign Entry (Phase 1 Persistence)
      const campaignRes = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...form, manualContext: originalPrompt})
      });
      const campaignEntry = await campaignRes.json();
      const currentCampaignId = campaignEntry.id;
      setCampaignId(currentCampaignId);

      const response = await fetch('http://localhost:5000/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          brief: { ...form, manualContext: originalPrompt }
        }),
      });

      if (!response.ok) throw new Error('Script generation failed');

      const data = await response.json();
      setScriptData(data);
      setMarketingInsights({
        hook: data.hook,
        audience: form.targetAudience,
        platform: form.platform || 'General',
        strategy: data.strategyExplanation
      });
      setStep('review');
    } catch (error) {
      console.error('Script Error:', error);
      alert('Failed to generate script. Using fallback.');
      setStep('forming');
    }
  };

  // Phase 1.5: Fetch Assets for human review
  const handleFetchAssets = async () => {
    setStep('loading');
    setRealTimeProgress({ step: "Sourcing Stock Assets", percentage: 50 });
    try {
      const response = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptData, campaignId })
      });
      if (!response.ok) throw new Error('Asset fetch failed');
      const data = await response.json();
      setAssetsData(data);
      setRealTimeProgress(null);
      setStep('preview');
    } catch (err) {
      console.error(err);
      alert('Failed to fetch assets.');
      setRealTimeProgress(null);
      setStep('review');
    }
  };

  // Phase 2: Synthesize Video from Script
  const handleVideoSynthesize = async (finalScript: any) => {
    setIsSynthesizing(true);
    setStep('loading');
    setProgressStep(1); // Start from logical visual generation step

    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 15000);

    try {
      const formData = new FormData();
      formData.append('prompt', originalPrompt);
      formData.append('script', JSON.stringify(finalScript));
      formData.append('platform', form.platform);
      formData.append('aspectRatio', form.aspectRatio);
      formData.append('selectedVisuals', JSON.stringify(selectedVisuals));
      if (campaignId) formData.append('campaignId', campaignId);
      if (logoFile) formData.append('logo', logoFile);

      // Start Real-Time SSE Listener
      let eventSource: EventSource | null = null;
      if (campaignId) {
        eventSource = new EventSource(`http://localhost:5000/api/progress/${campaignId}`);
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setRealTimeProgress(data);
        };
      }

      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (eventSource) eventSource.close();

      if (!response.ok) throw new Error('Video generation failed');

      const data = await response.json();
      const result = data.results[0];

      setGeneratedVideo(result.videoUrl);
      setGeneratedCaption(result.caption);
      setGeneratedHashtags(result.hashtags);
      
      addUserAsset({
        id: Date.now().toString(),
        title: originalPrompt.substring(0, 30) + '...',
        category: form.businessType || 'Marketing',
        thumb: result.videoUrl,
        videoUrl: result.videoUrl,
        createdAt: new Date().toISOString(),
        quality: '4K READY'
      });
      
      clearInterval(interval);
      setProgressStep(3);
      setTimeout(() => {
        setStep('result');
        setIsSynthesizing(false);
      }, 1000);

    } catch (error) {
      console.error('Synthesis Error:', error);
      alert('Failed to synthesize video.');
      setStep('review');
      clearInterval(interval);
      setIsSynthesizing(false);
    }
  };

  const loadingMessages = realTimeProgress ? [
    realTimeProgress.step, realTimeProgress.step, realTimeProgress.step, realTimeProgress.step
  ] : [
    T.generating.analyzing,
    T.generating.enhancing,
    T.generating.visuals,
    T.generating.finalizing
  ];

  return (
    <div className="flex-1 w-full">
      <CreateFlow 
        step={step}
        setStep={setStep}
        setActiveTab={() => {}}
        mode={mode}
        setMode={setMode}
        form={form}
        setForm={setForm}
        originalPrompt={originalPrompt}
        setOriginalPrompt={setOriginalPrompt}
        handleFormSubmit={handleScriptGenerate}
        handleFetchAssets={handleFetchAssets}
        handleVideoSynthesize={handleVideoSynthesize}
        progressStep={progressStep}
        loadingMessages={loadingMessages}
        enhancedPrompt={enhancedPrompt}
        generatedVideo={generatedVideo}
        generatedCaption={generatedCaption}
        generatedHashtags={generatedHashtags}
        setLogoFile={setLogoFile}
        scriptData={scriptData}
        setScriptData={setScriptData}
        assetsData={assetsData}
        selectedVisuals={selectedVisuals}
        setSelectedVisuals={setSelectedVisuals}
        T={T}
        realTimeProgress={realTimeProgress}
      />
    </div>
  );
}
