'use client';

import { StudioSidebar, StudioHeader } from '@/components/studio/LayoutElements';
import { useStudio } from '@/context/StudioContext';

function StudioContent({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, lang, setLang } = useStudio();

  return (
    <div className="flex bg-background text-foreground h-screen overflow-hidden font-sans selection:bg-primary selection:text-white transition-colors duration-500">
      {/* Sidebar - Solid and Stationary Flow */}
      <StudioSidebar />

      {/* Main Workspace - Independent Scroll */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <StudioHeader theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
        <main className="flex-1 p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioContent>{children}</StudioContent>
  );
}
