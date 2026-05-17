import React from 'react';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20 mb-4 relative">
          <Users className="w-10 h-10 text-primary" />
          <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black py-1 px-3 rounded-full uppercase tracking-widest">
            Coming Soon
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Team Collaboration</h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            We are building the ultimate collaborative environment for marketing teams. Soon, you will be able to invite team members, share brand assets, and co-create campaigns in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-primary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">Shared Workspaces</h3>
            <p className="text-xs text-muted">Organize projects by client or campaign.</p>
          </div>
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-primary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">Approval Workflows</h3>
            <p className="text-xs text-muted">Get feedback directly on video drafts.</p>
          </div>
          <div className="bg-foreground/5 border border-border rounded-2xl p-6 space-y-4">
            <Sparkles className="w-6 h-6 text-primary mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-widest">Brand Library</h3>
            <p className="text-xs text-muted">Centralize your logos and product images.</p>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/studio">
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mx-auto">
              Return to Studio
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
