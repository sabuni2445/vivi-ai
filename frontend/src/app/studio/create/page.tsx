'use client';

import { useState, useEffect } from 'react';
import { CreateFlow } from '@/components/studio/views/CreateFlow';
import { useStudio } from '@/context/StudioContext';
import { API_BASE_URL } from '@/lib/constants';
import { ATMOSPHERES, ACTIONS } from '@/lib/studio-data';

const PRE_MADE_VIDEOS = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
  '/videos/video4.mp4',
  '/videos/video5.mp4'
];

export default function CreatePage() {
  const { T, lang, addUserAsset, credits, videoCredits, imageCredits, subscriptionTier, fetchCredits } = useStudio();
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
    marketingAngle: '',
    keyFeatures: '',
    // Specialized Fields
    creationMode: 'brand-first',
    atmosphereId: 'luxury-gold',
    actionId: 'grand-reveal',
    productImage: null as File | null,
    logoFile: null as File | null,
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
    cta: 'Claim Offer Now',
    voiceId: '',
    generationMode: 'pro',
    enhancedMotion: false
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

  // STEP 1: Generate Script (OpenAI)
  const handleScriptGenerate = async () => {
    setStep('loading');
    setRealTimeProgress({ step: "AI Strategy Brainstorming", percentage: 10 });

    let productImageUrl = '';
    let logoUrl = '';

    // 1. Upload Assets if they exist
    if (form.productImage || form.logoFile) {
        setRealTimeProgress({ step: "Uploading Brand Assets...", percentage: 20 });
        const formData = new FormData();
        if (form.productImage) formData.append('productImage', form.productImage);
        if (form.logoFile) formData.append('logoFile', form.logoFile);

        try {
            const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            productImageUrl = uploadData.productImageUrl || '';
            logoUrl = uploadData.logoUrl || '';
        } catch (e) {
            console.error("Upload failed", e);
        }
    }

    // Compile description from guided fields if in guided mode
    const atmosphere = ATMOSPHERES.find(a => a.id === form.atmosphereId)?.title || 'Luxury';
    const action = ACTIONS.find(a => a.id === form.actionId)?.title || 'Cinematic';
    
    const compiledDescription = mode === 'guided' 
      ? `Marketing Goal: ${form.message}. Visual Style: ${atmosphere}. Cinematic Motion: ${action}. Creation Mode: ${form.creationMode}.`
      : originalPrompt;

    try {
      const finalDescription = productImageUrl 
        ? `${compiledDescription} Based on an uploaded product image at ${productImageUrl}.` 
        : compiledDescription;

      const response = await fetch(`${API_BASE_URL}/api/generate-script`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'dev-user-123'
        },
        body: JSON.stringify({ 
          productName: form.product || form.businessName || 'My Product',
          description: finalDescription || originalPrompt || 'A high converting video ad.',
          userDescription: `Marketing Angle/Target: ${form.marketingAngle || 'General'}. Key Features to show: ${form.keyFeatures || 'None specified'}.`,
          style: atmosphere,
          productImageUrl: productImageUrl
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === 'CREDITS_EXHAUSTED') throw new Error('NO_CREDITS');
        throw new Error(error.error || 'Script generation failed');
      }

      const data = await response.json();
      
      // Inject User Assets into Scenes
      const updatedScenes = data.script.scenes.map((scene: any, idx: number) => {
          if (productImageUrl && form.creationMode === 'brand-first') {
              return { ...scene, reference_image: API_BASE_URL + productImageUrl };
          } else if (productImageUrl && idx === 0) {
              return { ...scene, reference_image: API_BASE_URL + productImageUrl };
          }
          return scene;
      });

      setVideoId(data.videoId);
      setScriptData({ ...data.script, scenes: updatedScenes });
      setMarketingInsights({
        hook: updatedScenes[0].text,
        audience: form.targetAudience,
        platform: form.platform || 'General',
        strategy: data.script.marketing_strategy
      });
      
      // Automatically trigger image generation for remaining scenes
      handleGenerateImages(data.videoId, updatedScenes);
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
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'dev-user-123' // Consistency with Pricing
        },
        body: JSON.stringify({ videoId: vId, scenes, mode: form.generationMode })
      });
      const data = await response.json();
      setImageTasks(data.tasks);
      
      // Start polling for each image
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task: any) => pollImageStatus(task.taskId, task.sceneIndex));
      } else if (data.error) {
        alert(`Generation Error: ${data.error}`);
        setStep('forming');
      }
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
        
        if (data.status === 'succeed' || data.status === 'COMPLETED') {
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
      const scenesWithVoice = finalScript.scenes.map((s: any, idx: number) => 
        idx === 0 ? { ...s, voiceId: form.voiceId } : s
      );

      const response = await fetch(`${API_BASE_URL}/api/finalize-video`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': 'dev-user-123'
        },
        body: JSON.stringify({ 
            videoId: videoId,
            scenes: scenesWithVoice,
            mode: form.generationMode,
            enhancedMotion: form.enhancedMotion,
            logoUrl: assetsData?.logoUrl
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Finalize Error Details:', errData);
        throw new Error(errData.details || errData.error || 'Video production failed to start');
      }
      
      const data = await response.json();
      pollVideoStatus(data.taskId);
    } catch (error: any) {
      console.error('Finalize Error:', error);
      alert(`Video production failed: ${error.message}`);
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
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'dev-user-123' 
        },
        body: JSON.stringify({ videoId, scenes: [scriptData.scenes[sceneIndex]] })
      });
      const data = await response.json();
      pollImageStatus(data.tasks[0].taskId, sceneIndex);
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
  };

  const handleEnhanceImage = async (sceneIndex: number) => {
    const scene = scriptData.scenes[sceneIndex];
    if (!scene.image_url) {
      alert("Please upload a photo first to enhance it.");
      return;
    }

    setScriptData((prev: any) => {
      const newScenes = [...prev.scenes];
      newScenes[sceneIndex].image_url = null;
      return { ...prev, scenes: newScenes };
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/enhance-image`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'dev-user-123'
        },
        body: JSON.stringify({ 
          imageUrl: scene.image_url, 
          prompt: scene.visual_prompt,
          strength: 0.6
        })
      });
      const data = await response.json();
      
      if (data.status === 'succeed') {
        setScriptData((prev: any) => {
          const newScenes = [...prev.scenes];
          newScenes[sceneIndex].image_url = data.resultUrl;
          return { ...prev, scenes: newScenes };
        });
      } else {
        pollImageStatus(data.taskId, sceneIndex);
      }
    } catch (err) {
      console.error('Enhance failed:', err);
      alert("AI Enhancement failed. Please try again.");
      setScriptData((prev: any) => {
        const newScenes = [...prev.scenes];
        newScenes[sceneIndex].image_url = scene.image_url; // restore
        return { ...prev, scenes: newScenes };
      });
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
        videoCredits={videoCredits}
        imageCredits={imageCredits}
        subscriptionTier={subscriptionTier}
        handleRegenerateImage={handleRegenerateImage}
        handleEnhanceImage={handleEnhanceImage}
      />
    </div>
  );
}
