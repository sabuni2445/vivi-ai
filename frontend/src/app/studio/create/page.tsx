'use client';

import { useState, useEffect } from 'react';
import { CreateFlow } from '@/components/studio/views/CreateFlow';
import { useStudio } from '@/context/StudioContext';
import { API_BASE_URL } from '@/lib/constants';

const PRE_MADE_VIDEOS = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4',
  '/videos/video5.mp4'
];

export default function CreatePage() {
  const { T, lang, addUserAsset, credits, fetchCredits } = useStudio();
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

  // STEP 1: Generate Script for Review
  const handleScriptGenerate = async () => {
    setStep('loading');
    setRealTimeProgress({ step: "AI Strategy Brainstorming", percentage: 20 });

    // Compile description from guided fields if in guided mode
    const compiledDescription = mode === 'guided' 
      ? `Hook: ${form.hookText}. Action: ${form.action}. Key Message: ${form.message}. Product/Goal: ${form.product || form.description}.`
      : originalPrompt;

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-script`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'anonymous'
        },
        body: JSON.stringify({ 
          productName: form.product || form.businessName || 'My Product',
          description: compiledDescription || originalPrompt || 'A high converting video ad.',
          style: form.style || 'Modern'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === 'CREDITS_EXHAUSTED') throw new Error('NO_CREDITS');
        throw new Error(error.error || 'Script generation failed');
      }

      const data = await response.json();
      setVideoId(data.videoId);
      setScriptData(data.script);
      setMarketingInsights({
        hook: data.script.scenes[0].text,
        audience: form.targetAudience,
        platform: form.platform || 'General',
        strategy: data.script.marketing_strategy
      });
      
      // Automatically trigger image generation
      handleGenerateImages(data.videoId, data.script.scenes);
    } catch (error: any) {
      console.error('Script Error:', error);
      if (error.message === 'NO_CREDITS') {
        alert('Insufficient credits! Please top up.');
        // Redirect to credits page if we had one
      }
      setStep('forming');
    }
  };

  // STEP 2: Generate Images (Async Polling)
  const [imageTasks, setImageTasks] = useState<any[]>([]);
  
  const handleGenerateImages = async (vId: string, scenes: any[]) => {
    setStep('review'); // Show the review page with "Generating Images" overlays
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: vId, scenes })
      });
      const data = await response.json();
      setImageTasks(data.tasks);
      
      // Start polling for each image
      data.tasks.forEach((task: any) => pollImageStatus(task.taskId, task.sceneIndex));
    } catch (err) {
      console.error(err);
    }
  };

  const pollImageStatus = async (taskId: string, sceneIndex: number) => {
    if (!taskId || taskId === 'undefined') {
      console.error(`[Polling] Skipping: No valid Task ID for scene ${sceneIndex}`);
      return;
    }

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/task-status/${taskId}?type=image`);
        const data = await res.json();
        
        if (data.status === 'succeed') {
          setScriptData((prev: any) => {
            const newScenes = [...prev.scenes];
            newScenes[sceneIndex].image_url = data.resultUrl;
            return { ...prev, scenes: newScenes };
          });
        } else if (data.status === 'failed') {
          console.error(`Image task ${taskId} failed`);
        } else {
          setTimeout(check, 3000); // Poll every 3 seconds
        }
      } catch (e) {
        console.error(e);
      }
    };
    check();
  };

  // STEP 3: Finalize & Generate Video (Kling)
  const handleVideoSynthesize = async (finalScript: any) => {
    setStep('loading');
    setRealTimeProgress({ step: "Kling AI Video Engine Initializing", percentage: 10 });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/finalize-video`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': 'anonymous'
        },
        body: JSON.stringify({ 
            videoId: videoId,
            scenes: finalScript.scenes
        })
      });

      if (!response.ok) throw new Error('Video production failed to start');
      
      const data = await response.json();
      pollVideoStatus(data.taskId);
    } catch (error) {
      console.error('Finalize Error:', error);
      alert('Failed to start video production.');
      setStep('review');
    }
  };

  const pollVideoStatus = async (taskId: string) => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/task-status/${taskId}?type=video`);
        const data = await res.json();
        
        if (data.status === 'succeed') {
          setGeneratedVideo(data.resultUrl);
          setStep('result');
          fetchCredits(); // Refresh credits
        } else if (data.status === 'failed') {
          alert('Video generation failed. Credit refunded.');
          setStep('review');
          fetchCredits();
        } else {
          // Update progress based on polling
          setRealTimeProgress({ 
            step: "Kling AI is dreaming your video...", 
            percentage: data.progress || 50 
          });
          setTimeout(check, 5000); // Poll every 5 seconds
        }
      } catch (e) {
        console.error(e);
      }
    };
    check();
  };

  const [videoId, setVideoId] = useState<string | null>(null);


  const loadingMessages = realTimeProgress ? [
    realTimeProgress.step, realTimeProgress.step, realTimeProgress.step, realTimeProgress.step
  ] : [
    T.generating.analyzing,
    T.generating.enhancing,
    T.generating.visuals,
    T.generating.finalizing
  ];


  const handleRegenerateImage = async (sceneIndex: number) => {
    // Optimistically clear the current image to show loading state
    setScriptData((prev: any) => {
      const newScenes = [...prev.scenes];
      newScenes[sceneIndex].image_url = null;
      return { ...prev, scenes: newScenes };
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, scenes: [scriptData.scenes[sceneIndex]] })
      });
      const data = await response.json();
      pollImageStatus(data.tasks[0].taskId, sceneIndex);
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
  };

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
        credits={credits}
        handleRegenerateImage={handleRegenerateImage}
      />
    </div>
  );
}
