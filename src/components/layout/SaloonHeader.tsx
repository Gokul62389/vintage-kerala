import React, { useState, useEffect } from 'react';
import { Environment } from '../../types/experience';

interface SaloonHeaderProps {
  activeEnvironment: Environment;
  environmentIndex: number;
  totalEnvironments: number;
  onNextEnvironment: () => void;
}

export const SaloonHeader: React.FC<SaloonHeaderProps> = ({
  activeEnvironment,
  environmentIndex,
  totalEnvironments,
  onNextEnvironment,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [listenerCount, setListenerCount] = useState<number>(35);

  // Live real-time clock updating every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const minStr = minutes < 10 ? `0${minutes}` : minutes;
      setTimeStr(`${hours} ${minStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle natural fluctuation in listener count (like saloon.wtf)
  useEffect(() => {
    const countInterval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(26, Math.min(48, prev + delta));
      });
    }, 12000);
    return () => clearInterval(countInterval);
  }, []);

  return (
    <>
      {/* 1. Top-Left: Live Clock */}
      <div className="fixed left-5 top-5 z-20 text-sm font-medium tabular-nums text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] select-none">
        {timeStr}
      </div>

      {/* 2. Top-Center: Live Online Count */}
      <div 
        className="
          fixed left-1/2 top-5 z-20 -translate-x-1/2
          inline-flex items-center gap-2 rounded-full
          py-1.5 pl-3 pr-4 text-sm font-medium text-white
          drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] select-none
        " 
        aria-live="polite"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
        </span>
        <span className="tabular-nums font-mono">{listenerCount}</span>
        <span className="text-white/70">online</span>
      </div>

      {/* 3. Top-Right: External Streaming & Kerala Scene Switcher Pills */}
      <div className="fixed right-5 top-5 z-20 flex items-center gap-2 select-none">
        {/* Kerala Scene Selector Pill */}
        <button
          onClick={onNextEnvironment}
          title="Switch to Next Scene (or use keys 1-6 / arrows)"
          className="group/pill flex items-center gap-2 rounded-full text-sm font-medium text-white p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:bg-white/20 active:scale-95 cursor-pointer bg-black/40 backdrop-blur-md border border-white/20"
        >
          <span className="font-mono text-[11px] text-[#C6A46A] font-bold">
            {environmentIndex + 1}/{totalEnvironments}
          </span>
          <span className="hidden sm:inline text-xs font-medium">{activeEnvironment.name.split('(')[0].trim()}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-70 group-hover/pill:opacity-100 transition-transform group-hover/pill:translate-x-0.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* YouTube Source Track Pill */}
        <a 
          href="https://www.youtube.com/watch?v=KB4XtZr-7X4" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group/pill flex items-center gap-2 rounded-full text-sm font-medium text-white p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:bg-white/20 active:scale-95 bg-black/40 backdrop-blur-md border border-white/20" 
          aria-label="Source on YouTube"
          title="Source: Best Melodies of All Time (Saina Music)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="hidden sm:inline">YouTube</span>
          <span className="hidden sm:inline-flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="-rotate-45 opacity-50 transition group-hover/pill:opacity-90">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </span>
        </a>
      </div>
    </>
  );
};
