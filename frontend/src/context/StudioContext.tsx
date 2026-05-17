'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

interface StudioContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  userAssets: any[];
  addUserAsset: (asset: any) => void;
  credits: number; // legacy alias for video_credits
  videoCredits: number;
  imageCredits: number;
  subscriptionTier: string;
  fetchCredits: () => Promise<void>;
  T: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userAssets, setUserAssets] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [videoCredits, setVideoCredits] = useState<number>(0);
  const [imageCredits, setImageCredits] = useState<number>(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('none');

  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/credits`, {
        headers: { 'x-user-id': 'dev-user-123' } // Use real auth in production
      });
      const data = await res.json();
      setCredits(data.video_credits || 0); // backwards compatible
      setVideoCredits(data.video_credits || 0);
      setImageCredits(data.image_credits || 0);
      setSubscriptionTier(data.subscription_tier || 'none');
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  useEffect(() => {
    // ... (existing localStorage logic)
    fetchCredits();
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('vivi-pro-lang', newLang);
  };

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('vivi-pro-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const addUserAsset = (asset: any) => {
    setUserAssets(prev => {
      const updated = [asset, ...prev];
      localStorage.setItem('vivi-user-assets', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StudioContext.Provider value={{
      lang,
      setLang: handleSetLang,
      theme,
      setTheme: handleSetTheme,
      userAssets,
      addUserAsset,
      credits,
      videoCredits,
      imageCredits,
      subscriptionTier,
      fetchCredits,
      T: translations[lang]
    }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within a StudioProvider');
  return context;
};
