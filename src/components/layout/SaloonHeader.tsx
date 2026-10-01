import React, { useState, useEffect } from 'react';
import { Environment } from '../../types/experience';

interface SaloonHeaderProps {
  activeEnvironment: Environment;
  environmentIndex: number;
  totalEnvironments: number;
  onNextEnvironment: () => void;
  onToggleSpotify: () => void;
  isSpotifyOpen: boolean;
}

export const SaloonHeader: React.FC<SaloonHeaderProps> = ({
  activeEnvironment,
  environmentIndex,
  totalEnvironments,
  onNextEnvironment,
  onToggleSpotify,
  isSpotifyOpen,
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

        {/* Spotify Playlist Pill */}
        <button 
          onClick={onToggleSpotify}
          title={isSpotifyOpen ? "Hide Spotify Player" : "Connect Spotify Playlist"}
          className={`group/pill flex items-center gap-2 rounded-full text-sm font-medium p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition active:scale-95 cursor-pointer ${
            isSpotifyOpen 
              ? 'bg-[#1DB954] text-black shadow-[0_0_15px_rgba(29,185,84,0.5)]' 
              : 'bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
          }`}
          aria-label="Toggle Spotify Playlist Player"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="hidden sm:inline">Spotify</span>
          {isSpotifyOpen && (
            <span className="hidden sm:inline-flex h-2 w-2 rounded-full bg-black/60" />
          )}
        </button>

        {/* YT Music Pill */}
        <a 
          href="https://music.youtube.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group/pill flex items-center gap-2 rounded-full text-sm font-medium text-white p-2.5 sm:py-2 sm:pl-3 sm:pr-3.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:opacity-80 active:scale-95" 
          aria-label="Open on YouTube Music"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
          </svg>
          <span className="hidden sm:inline">YT Music</span>
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
