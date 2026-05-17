'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  videoUrl?: string;
  imageUrl?: string;
  description: string;
}

interface StyleActionGalleryProps {
  items: GalleryItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  title: string;
  subtitle: string;
}

export const StyleActionGallery = ({
  items,
  selectedId,
  onSelect,
  title,
  subtitle
}: StyleActionGalleryProps) => {
  return (
    <div className="space-y-8">
      {title && (
        <div className="space-y-1">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
            {title}
          </h3>
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em]">
            {subtitle}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id)}
              className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]' 
                  : 'border-white/5 hover:border-white/20 bg-black/40'
              }`}
            >
              {/* Preview Container */}
              <div className="aspect-video relative overflow-hidden bg-black/60">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                  />
                ) : item.imageUrl ? (
                  <motion.div 
                    className="w-full h-full overflow-hidden"
                    animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-100'}`}
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase text-muted tracking-widest italic">No Preview</span>
                  </div>
                )}
                
                {/* Selection Overlay */}
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg z-20"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Info Area */}
              <div className="p-6 space-y-2 relative z-10">
                <h4 className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {item.title}
                </h4>
                <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
