import React, { useRef } from 'react';
import { Song } from '../../types/experience';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Disc3, 
  Sliders, 
  ListMusic 
} from 'lucide-react';

interface MusicPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  isProcedural: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onOpenMixer: () => void;
  onOpenLibrary: () => void;
}

function formatTime(secs: number): string {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isLoading,
  isProcedural,
  isShuffle,
  isRepeat,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onOpenMixer,
  onOpenLibrary,
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
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-[#1D2B24]/90 border border-[#C6A46A]/40 shadow-2xl backdrop-blur-md p-3.5 sm:p-4 text-[#E9D8B5] transition-all">
      {/* Top Bar: Song metadata & Mode indicators */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Cassette Spool / Vinyl Disc Icon */}
          <div className="relative w-10 h-10 rounded-lg bg-black/40 border border-[#C6A46A]/30 flex items-center justify-center shrink-0 overflow-hidden">
            <Disc3 
              className={`w-6 h-6 text-[#C6A46A] ${isPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s' }}
            />
          </div>

          {/* Song Title & Movie Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {currentSong.malayalamTitle && (
                <span className="font-malayalam text-xs text-[#C6A46A] truncate">
                  {currentSong.malayalamTitle}
                </span>
              )}
              {isProcedural && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#C6A46A]/20 text-[#C6A46A] border border-[#C6A46A]/40 shrink-0 font-medium">
                  Procedural Melodic Sample
                </span>
              )}
            </div>
            <h3 className="font-medium text-sm sm:text-base text-[#E9D8B5] truncate leading-tight">
              {currentSong.title}
            </h3>
            <p className="text-xs text-[#E9D8B5]/70 truncate font-light">
              {currentSong.movie ? `${currentSong.movie} • ` : ''}{currentSong.artist}
            </p>
          </div>
        </div>

        {/* Action Buttons: Song Library & Audio Mixer Drawer triggers */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenMixer}
            aria-label="Open Audio Mixer"
            title="Audio Mixer (Music vs Kerala Ambience)"
            className="p-2 rounded-lg hover:bg-white/10 text-[#E9D8B5]/80 hover:text-[#C6A46A] transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenLibrary}
            aria-label="Open Song Library"
            title="Song Library"
            className="p-2 rounded-lg hover:bg-white/10 text-[#E9D8B5]/80 hover:text-[#C6A46A] transition-colors cursor-pointer"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubbable Timeline Progress Bar */}
      <div className="space-y-1 my-2">
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="group relative w-full h-2 rounded-full bg-black/40 cursor-pointer overflow-hidden flex items-center"
          role="slider"
          aria-label="Audio timeline seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
        >
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-[#C6A46A]/80 to-[#E9D8B5] rounded-full transition-all duration-100 group-hover:brightness-110"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex justify-between text-[11px] text-[#E9D8B5]/60 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Primary Player Controls */}
      <div className="flex items-center justify-between pt-1">
        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          aria-label="Toggle Shuffle"
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isShuffle ? 'text-[#C6A46A] bg-white/10' : 'text-[#E9D8B5]/50 hover:text-[#E9D8B5]'
          }`}
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Prev, Play/Pause, Next */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            aria-label="Previous Track"
            className="p-2 rounded-full text-[#E9D8B5]/80 hover:text-[#E9D8B5] hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 rounded-full bg-[#C6A46A] hover:bg-[#d8b87e] text-[#1D2B24] flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            aria-label="Next Track"
            className="p-2 rounded-full text-[#E9D8B5]/80 hover:text-[#E9D8B5] hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Repeat */}
        <button
          onClick={onToggleRepeat}
          aria-label="Toggle Repeat"
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isRepeat ? 'text-[#C6A46A] bg-white/10' : 'text-[#E9D8B5]/50 hover:text-[#E9D8B5]'
          }`}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
