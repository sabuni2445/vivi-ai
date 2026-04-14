'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ViviLanding } from '@/components/landing/ViviLanding';

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSetView = (view: string) => {
    if (view === 'app') {
      router.push('/studio');
    }
  };

  return <ViviLanding mousePosition={mousePosition} setView={handleSetView} />;
}
