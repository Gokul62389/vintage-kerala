import React, { useRef } from 'react';
import { Song, Environment } from '../../types/experience';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  ListMusic, 
  Sliders
} from 'lucide-react';

interface MinimalDockProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  activeEnvironment: Environment;
  environmentIndex: number;
  totalEnvironments: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
  onPrevEnvironment: () => void;
  onNextEnvironment: () => void;
  onOpenSelector: () => void;
  onOpenMixer: () => void;
  onOpenLibrary: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MinimalDock: React.FC<MinimalDockProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isLoading,
  activeEnvironment,
  environmentIndex,
  totalEnvironments,
  isMuted,
  isFullscreen,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onPrevEnvironment,
  onNextEnvironment,
  onOpenSelector,
  onOpenMixer,
  onOpenLibrary,
  onToggleMute,
  onToggleFullscreen,
}) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(pct * duration);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl bg-[#181816]/80 border border-[#C6A46A]/30 backdrop-blur-xl shadow-2xl p-3 sm:p-3.5 text-[#E9D8B5] flex flex-col gap-2">
        {/* Hairline Scrub Bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="group relative w-full h-1.5 rounded-full bg-white/10 hover:h-2 transition-all cursor-pointer overflow-hidden flex items-center"
          role="slider"
          aria-label="Seek timeline"
          aria-valuenow={currentTime}
        >
          <div
            className="h-full bg-[#C6A46A] group-hover:bg-[#E9D8B5] transition-all rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Unified Bottom Bar Controls */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Environment Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onPrevEnvironment}
              aria-label="Previous Environment"
              title="Previous Kerala scene"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSelector}
              title="Click to view all Kerala scenes"
              className="text-left px-2 py-1 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[#C6A46A]">
                  {environmentIndex + 1}/{totalEnvironments}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#E9D8B5] group-hover:text-[#C6A46A] transition-colors truncate max-w-[130px] sm:max-w-[200px]">
                  {activeEnvironment.name}
                </span>
              </div>
              <span className="font-malayalam text-[10px] text-[#E9D8B5]/50 block leading-tight truncate max-w-[130px] sm:max-w-[200px]">
                {activeEnvironment.malayalamName}
              </span>
            </button>

            <button
              onClick={onNextEnvironment}
              aria-label="Next Environment"
              title="Next Kerala scene"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Music Playback */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPrevTrack}
              aria-label="Previous Track"
              className="p-1.5 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C6A46A] hover:bg-[#d8b87e] text-[#181816] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onNextTrack}
              aria-label="Next Track"
              className="p-1.5 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Song Meta Display */}
            <div className="hidden md:flex flex-col min-w-0 max-w-[180px] pl-2 border-l border-white/10">
              <span className="text-xs font-medium text-[#E9D8B5] truncate leading-tight">
                {currentSong.title}
              </span>
              <span className="text-[11px] text-[#E9D8B5]/60 truncate font-light">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Sound Controls & Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isMuted ? 'text-[#A64A32] bg-[#A64A32]/20' : 'text-[#E9D8B5]/70 hover:text-[#E9D8B5] hover:bg-white/10'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenMixer}
              aria-label="Audio Mixer"
              title="Balance music & ambient sound"
              className="p-2 rounded-lg hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLibrary}
              aria-label="Song Library"
              title="Song Library"
              className="p-2 rounded-lg hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {typeof document !== 'undefined' && document.fullscreenEnabled && (
              <button
                onClick={onToggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="hidden sm:inline-flex p-2 rounded-lg hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
