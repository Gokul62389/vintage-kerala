import React, { useEffect, useRef } from 'react';
import { SoundscapeType } from '../../types/experience';

interface AtmosphericCanvasProps {
  soundscapeType: SoundscapeType;
  sceneId: string;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({ soundscapeType }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle state
    let particles: any[] = [];
    let ripples: any[] = [];
    let teaDrops: any[] = [];
    let speedLines: any[] = [];

    // Initialize scene-specific particle systems
    if (soundscapeType === 'rain') {
      const dropCount = Math.floor(width * 0.22);
      for (let i = 0; i < dropCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 32 + 20, // longer motion-blurred rain streak
          speed: Math.random() * 18 + 22,
          opacity: Math.random() * 0.4 + 0.2,
          wind: -3.5,
        });
      }
    } else if (soundscapeType === 'bus') {
      // High-speed window motion blur streaks rushing past
      const streakCount = 40;
      for (let i = 0; i < streakCount; i++) {
        speedLines.push({
          x: width * 0.45 + Math.random() * (width * 0.55),
          y: height * 0.15 + Math.random() * (height * 0.75),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 25 + 35,
          opacity: Math.random() * 0.35 + 0.1,
        });
      }
    } else if (soundscapeType === 'tea-shop') {
      // Steam & tea droplets
      for (let i = 0; i < 35; i++) {
        particles.push({
          x: width * 0.36 + (Math.random() - 0.5) * 35,
          y: height * 0.68 + (Math.random() - 0.5) * 20,
          radius: Math.random() * 3.5 + 1.2,
          speedY: -(Math.random() * 0.8 + 0.5),
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.3 + 0.1,
          life: Math.random() * 80,
          maxLife: Math.random() * 110 + 70,
        });
      }
    } else if (soundscapeType === 'ferry') {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: height * 0.52 + Math.random() * (height * 0.48),
          length: Math.random() * 35 + 15,
          speedX: Math.random() * 0.8 + 0.3,
          opacity: Math.random() * 0.35 + 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // --- 1. KAIRALI TEA SHOP: REALISTIC TEA POURING STREAM WITH DYNAMIC MOTION BLUR ---
      if (soundscapeType === 'tea-shop') {
        // Stream start (kettle spout) & end (receiving glass) in responsive coords
        const startX = width * 0.368;
        const startY = height * 0.655;
        const endX = width * 0.378;
        const endY = height * 0.718;

        // Draw dynamic liquid stream with motion blur
        ctx.save();
        ctx.shadowColor = 'rgba(215, 140, 50, 0.8)';
        ctx.shadowBlur = 4;

        // Liquid core
        ctx.strokeStyle = 'rgba(225, 135, 38, 0.9)';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Subtle fluid turbulence wave
        const waveOffset = Math.sin(frame * 0.35) * 1.8;
        const midX = (startX + endX) / 2 + waveOffset;
        const midY = (startY + endY) / 2;
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.stroke();

        // Inner golden highlight line (motion streak)
        ctx.strokeStyle = 'rgba(255, 230, 160, 0.7)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(midX + 0.5, midY, endX, endY);
        ctx.stroke();
        ctx.restore();

        // Pouring droplets & splash micro-particles
        if (Math.random() > 0.4) {
          teaDrops.push({
            x: endX + (Math.random() - 0.5) * 6,
            y: endY,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -(Math.random() * 2.5 + 1.2),
            life: 14,
          });
        }

        // Render & update splash droplets
        ctx.fillStyle = 'rgba(240, 170, 70, 0.75)';
        for (let i = teaDrops.length - 1; i >= 0; i--) {
          const d = teaDrops[i];
          d.x += d.vx;
          d.y += d.vy;
          d.vy += 0.25; // gravity
          d.life--;

          ctx.beginPath();
          ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
          ctx.fill();

          if (d.life <= 0) teaDrops.splice(i, 1);
        }

        // Render rising steam from tea
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speedY;
          p.x += p.speedX;
          p.life++;

          const progress = p.life / p.maxLife;
          const currentOpacity = p.opacity * Math.sin(progress * Math.PI);

          ctx.fillStyle = `rgba(245, 235, 215, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + progress * 1.8), 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) {
            p.x = width * 0.36 + (Math.random() - 0.5) * 25;
            p.y = height * 0.69 + (Math.random() - 0.5) * 15;
            p.life = 0;
          }
        }

      // --- 2. KSRTC BUS: DYNAMIC HIGH-SPEED SCENERY MOTION BLUR ---
      } else if (soundscapeType === 'bus') {
        // Render horizontal motion blur streaks across the open window
        ctx.save();
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';

        for (let i = 0; i < speedLines.length; i++) {
          const s = speedLines[i];
          s.x -= s.speed;

          // Motion blur gradient line
          const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
          grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
          grad.addColorStop(0.5, `rgba(235, 245, 255, ${s.opacity})`);
          grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y);
          ctx.stroke();

          // Reset streak when it exits left of window opening
          if (s.x + s.length < width * 0.35) {
            s.x = width + Math.random() * 100;
            s.y = height * 0.15 + Math.random() * (height * 0.72);
            s.speed = Math.random() * 25 + 35;
          }
        }
        ctx.restore();

      // --- 3. MONSOON COURTYARD: SLANTING RAIN WITH DYNAMIC VELOCITY BLUR & SPLASHES ---
      } else if (soundscapeType === 'rain') {
        ctx.strokeStyle = 'rgba(235, 245, 255, 0.45)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.moveTo(p.x, p.y);
          // Motion-blurred rain streaks
          ctx.lineTo(p.x + p.wind, p.y + p.length);

          p.y += p.speed;
          p.x += p.wind;

          // Splash on courtyard stone floor
          if (p.y > height * 0.72) {
            if (Math.random() > 0.94 && ripples.length < 28) {
              ripples.push({
                x: p.x,
                y: p.y + Math.random() * 25,
                radius: 1,
                maxRadius: Math.random() * 14 + 6,
                opacity: 0.4,
              });
            }
            p.y = -p.length;
            p.x = Math.random() * (width + 120);
          }
        }
        ctx.stroke();

        // Expanding splash rings
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          ctx.strokeStyle = `rgba(235, 245, 255, ${r.opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 2, r.radius * 0.65, 0, 0, Math.PI * 2);
          ctx.stroke();

          r.radius += 0.45;
          r.opacity -= 0.018;
          if (r.opacity <= 0) ripples.splice(i, 1);
        }

      // --- 4. BACKWATER FERRY: WATER CAUSTICS & LIGHT SHIMMER ---
      } else if (soundscapeType === 'ferry') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.speedX;
          if (p.x > width) p.x = 0;

          const shimmer = (Math.sin(frame * 0.05 + p.phase) + 1) * 0.5;
          ctx.strokeStyle = `rgba(225, 250, 255, ${p.opacity * shimmer})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.length, 1.6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

      // --- 5. VILLAGE EATERY & BUS STOP: AMBIENT HEAT & DUST MOTES ---
      } else {
        for (let i = 0; i < 28; i++) {
          const mx = (frame * 0.8 + i * 45) % width;
          const my = (height * 0.45 + Math.sin(frame * 0.02 + i) * 80) % height;
          ctx.fillStyle = `rgba(245, 225, 175, 0.22)`;
          ctx.beginPath();
          ctx.arc(mx, my, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [soundscapeType]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 w-full h-full mix-blend-screen"
    />
  );
};
