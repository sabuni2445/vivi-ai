import React from 'react';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BulkPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary/10 border border-secondary/20 mb-4 relative">
          <Layers className="w-10 h-10 text-secondary" />
          <div className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black py-1 px-3 rounded-full uppercase tracking-widest">
            Coming Soon
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Bulk AI Generation</h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Scale your content production effortlessly. Soon, you will be able to upload a spreadsheet of product links and have Vivi-AI automatically generate variations of video ads for your entire catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-secondary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">A/B Testing</h3>
            <p className="text-xs text-muted">Generate multiple hooks for the same product instantly.</p>
          </div>
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-secondary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">Catalog Sync</h3>
            <p className="text-xs text-muted">Import directly from Shopify or WooCommerce.</p>
          </div>
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-secondary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">Format Export</h3>
            <p className="text-xs text-muted">Auto-resize ads for TikTok, Instagram, and YouTube.</p>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/studio">
            <button className="px-8 py-4 bg-secondary text-black rounded-xl font-black uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 mx-auto">
              Return to Studio
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
