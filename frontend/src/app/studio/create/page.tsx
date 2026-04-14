'use client';

import { useState } from 'react';
import { CreateFlow } from '@/components/studio/views/CreateFlow';
import { useStudio } from '@/context/StudioContext';

export default function CreatePage() {
  const { T, lang } = useStudio();
  const [mode, setMode] = useState<'guided' | 'prompt'>('guided');
  const [step, setStep] = useState<'idle' | 'forming' | 'loading' | 'result'>('forming');
  const [progressStep, setProgressStep] = useState(0);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    product: '',
    style: 'Modern',
    platform: 'Instagram',
    description: ''
  });

  const handleFormSubmit = () => {
    let finalPrompt = '';
    if (mode === 'guided') {
      finalPrompt = `${form.product} for ${form.businessName} (${form.businessType}). ${form.description}`;
    } else {
      finalPrompt = originalPrompt;
    }

    setOriginalPrompt(finalPrompt);
    setEnhancedPrompt(`Cinematic high-detail video of ${finalPrompt}. Dramatic lighting, professional camera work, optimized for ${form.platform}.`);
    setStep('loading');
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2500);

    setTimeout(() => {
      setStep('result');
      clearInterval(interval);
    }, 10000);
  };

  const loadingMessages = [
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
        handleFormSubmit={handleFormSubmit}
        progressStep={progressStep}
        loadingMessages={loadingMessages}
        enhancedPrompt={enhancedPrompt}
        T={T}
      />
    </div>
  );
}
