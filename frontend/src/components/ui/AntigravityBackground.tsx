'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudio } from '@/context/StudioContext';

export const DynamicGrid = () => {
  const { theme } = useStudio();
  const [cells, setCells] = useState<any[]>([]);

  useEffect(() => {
    const generateCells = () => {
      const cols = Math.ceil(window.innerWidth / 40);
      const rows = Math.ceil(window.innerHeight / 40);
      const newCells = [];
      for (let i = 0; i < 40; i++) {
        newCells.push({
          id: Math.random(),
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
          opacity: Math.random() * 0.6 + 0.3,
          duration: Math.random() * 5 + 3,
          color: Math.random() > 0.6 ? 'bg-primary/30' : (Math.random() > 0.5 ? 'bg-secondary/20' : 'bg-white/10'),
          blur: Math.random() > 0.8 ? 'blur-md' : (Math.random() > 0.6 ? 'blur-sm' : '')
        });
      }
      setCells(newCells);
    };

    generateCells();
    const interval = setInterval(generateCells, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: theme === 'light' 
            ? 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)'
            : 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <AnimatePresence>
        {cells.map((cell) => (
          <motion.div
            key={cell.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: cell.opacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: cell.duration, ease: "easeInOut" }}
            className={`absolute ${cell.color} ${cell.blur} border border-white/5 rounded-sm`}
            style={{
              left: cell.x * 40,
              top: cell.y * 40,
              width: 40,
              height: 40,
              boxShadow: cell.color.includes('primary') 
                ? '0 0 15px rgba(139, 92, 246, 0.2)' 
                : (theme === 'light' ? '0 0 15px rgba(0, 0, 0, 0.1)' : '0 0 15px rgba(255, 255, 255, 0.1)')
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const CanvasParticles = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => {
  const { theme } = useStudio();
  const themeRef = useRef(theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width;
    let h = canvas.height;
    let particles: Particle[] = [];
    let animationId: number;
    let mouse: { x: number | null, y: number | null, radius: number } = { x: null, y: null, radius: 150 };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      speedX: number;
      speedY: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = themeRef.current === 'light' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = themeRef.current === 'light' ? 8 : 5;
        ctx.shadowColor = themeRef.current === 'light' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(173, 216, 230, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w || this.x < 0) this.speedX *= -1;
        if (this.y > h || this.y < 0) this.speedY *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      // Limit particles to a reasonable number even on giant screens
      const numberOfParticles = Math.min((w * h) / 25000, 150);
        for (let i = 0; i < numberOfParticles; i++) {
          particles.push(new Particle(w, h));
        }
    };

    const connect = () => {
      if (!ctx) return;
      // Optimization: Only check a subset of particles for connections 
      // or use a simpler proximity check to avoid O(n^2)
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          // Faster distance check (skip sqrt if possible, but let's just use a squared check first)
          let distanceSq = dx * dx + dy * dy;

          if (distanceSq < 100 * 100) { // 100px range
            let distance = Math.sqrt(distanceSq);
            let opacityValue = 1 - (distance / 100);
            ctx.strokeStyle = themeRef.current === 'light' ? `rgba(139, 92, 246, ${opacityValue * 0.25})` : `rgba(173, 216, 230, ${opacityValue * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connect();
      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[10] pointer-events-none transform-gpu transition-transform duration-300 ease-out"
      style={{
        transform: mounted ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)` : 'none'
      }}
    />
  );
};
