'use client';

import { useState } from 'react';
import { DashboardView } from '@/components/studio/views/DashboardView';
import { sampleVideos } from '@/lib/data/studio';
import { AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { staggerChildren: 0.1, duration: 0.6, ease: "easeOut" } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'realEstate', label: 'Real Estate' },
  ];

  const filteredVideos = activeCategory === 'all'
    ? sampleVideos
    : sampleVideos.filter(v => v.category === activeCategory);

  return (
    <div className="flex-1 w-full">
      <AnimatePresence mode="wait">
        <DashboardView 
            key="dashboard"
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredVideos={filteredVideos}
            setActiveTab={() => {}} 
            setStep={() => {}} 
            setMode={() => {}} 
        />
      </AnimatePresence>
    </div>
  );
}
