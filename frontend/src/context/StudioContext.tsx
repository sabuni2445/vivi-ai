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
  T: any;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userAssets, setUserAssets] = useState<any[]>([]);

  useEffect(() => {
    const savedLang = localStorage.getItem('vivi-pro-lang') as Language | null;
    if (savedLang) setLang(savedLang);

    const savedTheme = localStorage.getItem('vivi-pro-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);

    const savedAssets = localStorage.getItem('vivi-user-assets');
    if (savedAssets) setUserAssets(JSON.parse(savedAssets));
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
