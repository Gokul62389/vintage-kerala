import React, { useRef, useState } from 'react';
import { Song } from '../../types/experience';
import { ListMusic, Search, X } from 'lucide-react';

interface SaloonPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
  allSongs?: Song[];
  currentIndex?: number;
  onSelectTrack?: (index: number) => void;
  isLofiEnabled?: boolean;
  onToggleLofi?: () => void;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const SaloonPlayer: React.FC<SaloonPlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isLoading,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  allSongs = [],
  currentIndex = 0,
  onSelectTrack,
  isLofiEnabled = true,
  onToggleLofi,
}) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(pct * duration);
  };

  const handlePrev = () => {
    if (allSongs.length > 1) {
      onPrevTrack();
    } else {
      // Single continuous track: seek back 15 seconds or rewind
      onSeek(Math.max(0, currentTime - 15));
    }
  };

  const handleNext = () => {
    if (allSongs.length > 1) {
      onNextTrack();
    } else {
      // Single continuous track: seek forward 15 seconds
      onSeek(Math.min(duration, currentTime + 15));
    }
  };

  const filteredSongs = allSongs.filter((song) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative mb-[6vh] sm:mb-[8vh] flex w-full flex-col items-center px-4 sm:px-6 select-none pointer-events-auto">
      {/* 1. Track Queue Tray (if multiple songs exist) */}
      {isQueueOpen && allSongs.length > 1 && (
        <div className="
          w-full max-w-xl mb-3 rounded-2xl overflow-hidden
          bg-black/75 backdrop-blur-2xl backdrop-saturate-150
          border border-white/20
          shadow-[0_16px_50px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.2)]
          p-3 sm:p-4 text-white animate-in fade-in slide-in-from-bottom-2 duration-200 z-30
        ">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold block leading-tight">
                Tracks Playlist
              </span>
              <span className="text-[10px] text-white/60">
                {allSongs.length} Tracks Available
              </span>
            </div>

            <button
              onClick={() => setIsQueueOpen(false)}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Scrollable song list */}
          <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1 pr-1">
            {filteredSongs.map((song) => {
              const originalIndex = allSongs.findIndex((s) => s.id === song.id);
              const isSelected = originalIndex === currentIndex;

              return (
                <button
                  key={song.id}
                  onClick={() => {
                    if (onSelectTrack) onSelectTrack(originalIndex);
                    setIsQueueOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer
                    ${
                      isSelected
                        ? 'bg-white/20 border border-white/30 text-white'
                        : 'hover:bg-white/10 text-white/70 hover:text-white border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-white/40 w-5 shrink-0 text-right">
                      {originalIndex + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {song.title}
                      </p>
                      <p className="text-[10px] text-white/50 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="relative flex h-2 w-2 ml-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Main Deluxe Saloon Player Dock */}
      <div className="w-full max-w-xl">
        <div className="
          group relative flex items-center gap-3 sm:gap-4 rounded-full p-2.5 sm:p-3 pr-4 sm:pr-5
          bg-black/45 backdrop-blur-2xl backdrop-saturate-150
          border border-white/20
          shadow-[0_16px_50px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.2)]
          text-white transition-all duration-300
        ">
          {/* Album Cover Art / Spinning Vinyl Icon */}
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full shadow-md border border-white/25">
            {currentSong.cover ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className={`h-full w-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'rotate-[360deg] duration-[12000ms] repeat-infinite ease-linear' : ''
                }`}
                style={{
                  animation: isPlaying ? 'spin 18s linear infinite' : 'none',
                }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-amber-700/80 to-amber-950/80 flex items-center justify-center">
                <span className="text-base">📻</span>
              </div>
            )}
            
            {/* Center Vinyl Spindle Hole */}
            <div className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-black/80 border border-white/40" />
          </div>

          {/* Song Info & Interactive Progress Bar */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            {/* Title & Artist */}
            <div className="flex items-baseline justify-between gap-2 overflow-hidden pr-1">
              <span className="truncate text-xs sm:text-sm font-semibold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                {currentSong.title}
              </span>
              <span className="shrink-0 truncate text-[11px] sm:text-xs text-white/70">
                {currentSong.artist}
              </span>
            </div>

            {/* Clickable / Draggable Progress Scrubber */}
            <div className="mt-1 flex flex-col justify-center">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="group/seek relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2"
                title={`Seek position (${formatTime(currentTime)} / ${formatTime(duration)})`}
              >
                {/* Played Progress Bar */}
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-100 relative group-hover/seek:bg-amber-300"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Scrubber Thumb Knob on Hover */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3 w-3 rounded-full bg-white shadow-md scale-0 group-hover/seek:scale-100 transition-transform" />
                </div>
              </div>

              {/* Timestamp & Lo-Fi Badge */}
              <div className="mt-0.5 flex items-center justify-between text-[10px] tabular-nums text-white/60 font-mono">
                <div className="flex items-center gap-2">
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  {onToggleLofi && (
                    <button
                      onClick={onToggleLofi}
                      title={isLofiEnabled ? "Lo-Fi Tape Warmth & Vinyl Crackle ON (Click to bypass)" : "Lo-Fi Tape Warmth OFF (Click to enable)"}
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-medium transition cursor-pointer border ${
                        isLofiEnabled
                          ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                          : "bg-white/5 text-white/40 border-white/10 hover:text-white/70"
                      }`}
                    >
                      {isLofiEnabled ? "📻 Lo-Fi ON" : "Lo-Fi OFF"}
                    </button>
                  )}
                </div>
                
                {allSongs.length > 1 && (
                  <button
                    onClick={() => setIsQueueOpen(!isQueueOpen)}
                    title="View tracks list"
                    className="flex items-center gap-1 text-[10px] text-amber-300 hover:underline font-sans cursor-pointer transition"
                  >
                    <ListMusic className="w-3 h-3" />
                    <span className="hidden sm:inline">Tracks ({currentIndex + 1}/{allSongs.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Controls: Prev (-15s), Play/Pause, Next (+15s) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {allSongs.length > 1 && (
              <button 
                type="button"
                onClick={() => setIsQueueOpen(!isQueueOpen)}
                title="Browse playlist"
                aria-label="Toggle playlist queue"
                className={`grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full transition cursor-pointer ${
                  isQueueOpen ? 'bg-white/25 text-amber-300' : 'text-white/60 hover:text-white hover:bg-white/15'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Previous Track / Rewind 15s */}
            <button 
              type="button" 
              onClick={handlePrev}
              aria-label="Previous track" 
              title={allSongs.length > 1 ? "Previous song (or left arrow)" : "Rewind 15 seconds (or left arrow)"}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play / Pause Button (White Circle) */}
            <button 
              type="button" 
              onClick={onTogglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pause' : 'Play'} 
              title={isPlaying ? 'Pause song (Spacebar)' : 'Play song (Spacebar)'}
              className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next Track / Forward 15s */}
            <button 
              type="button" 
              onClick={handleNext}
              aria-label="Next track" 
              title={allSongs.length > 1 ? "Next song (or right arrow)" : "Forward 15 seconds (or right arrow)"}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 6h2v12h-2zm-2 6L5.5 6v12z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
