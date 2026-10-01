import React, { useRef, useState } from 'react';
import { Song } from '../../types/experience';
import { ListMusic, Search, X, ExternalLink } from 'lucide-react';
import { SPOTIFY_PLAYLIST_ID, SPOTIFY_PLAYLIST_NAME } from '../../data/songs';

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
      {/* 1. Slide-up Spotify Playlist Queue Tray (94 songs) */}
      {isQueueOpen && (
        <div className="
          w-full max-w-xl mb-3 rounded-2xl overflow-hidden
          bg-black/75 backdrop-blur-2xl backdrop-saturate-150
          border border-white/20
          shadow-[0_16px_50px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.2)]
          p-3 sm:p-4 text-white animate-in fade-in slide-in-from-bottom-2 duration-200 z-30
        ">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-xs shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold block leading-tight">
                  {SPOTIFY_PLAYLIST_NAME}
                </span>
                <span className="text-[10px] text-white/60">
                  {allSongs.length} Tracks in Playlist Queue
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on Spotify"
                className="text-white/60 hover:text-[#1DB954] transition p-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsQueueOpen(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 94 songs, singers (Yesudas, Chithra, Vidyasagar)..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1DB954]"
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
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
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
          bg-white/10 backdrop-blur-2xl backdrop-saturate-150
          border border-white/20
          shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
        ">
          {/* Spinning Vinyl Album Artwork */}
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0">
            <div 
              className={`h-full w-full overflow-hidden rounded-full shadow-lg ring-1 ring-white/20 transition-all ${
                isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
              }`}
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <img 
                src={currentSong.cover || '/assets/environments/tea-shop.jpg'} 
                alt={`${currentSong.title} artwork`}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Center vinyl spindle hole */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80 ring-2 ring-white/40" />
          </div>

          {/* Song Metadata & Scrub Bar */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs sm:text-sm font-semibold text-white drop-shadow-sm leading-tight">
                {currentSong.title}
              </p>
            </div>
            <p className="truncate text-[11px] sm:text-xs text-white/70 mt-0.5">
              {currentSong.artist}
            </p>

            <div className="mt-1.5">
              {/* Scrub line */}
              <div 
                ref={progressBarRef}
                onClick={handleSeek}
                className="group/bar relative h-2 w-full cursor-pointer" 
                role="slider" 
                aria-label="Seek timeline" 
                aria-valuemin={0} 
                aria-valuemax={100} 
                aria-valuenow={progressPercent}
              >
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                  <div 
                    className="h-full rounded-full bg-white/90 transition-all duration-100" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {/* Thumb hover circle */}
                <div 
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100 pointer-events-none" 
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Timestamp, Lo-Fi Badge, & Spotify Queue Quick Button */}
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
                
                <button
                  onClick={() => setIsQueueOpen(!isQueueOpen)}
                  title="View 94 tracks in your Spotify playlist"
                  className="flex items-center gap-1 text-[10px] text-[#1DB954] hover:underline font-sans cursor-pointer transition"
                >
                  <ListMusic className="w-3 h-3" />
                  <span className="hidden sm:inline">Spotify Queue ({currentIndex + 1}/{allSongs.length || 94})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Playlist Queue Toggle */}
            <button 
              type="button"
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              title="Browse 94 songs in your Spotify playlist"
              aria-label="Toggle playlist queue"
              className={`grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full transition cursor-pointer ${
                isQueueOpen ? 'bg-white/25 text-[#1DB954]' : 'text-white/60 hover:text-white hover:bg-white/15'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>

            {/* Previous Track */}
            <button 
              type="button" 
              onClick={onPrevTrack}
              aria-label="Previous track" 
              title="Previous song (or use left arrow)"
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

            {/* Next Track */}
            <button 
              type="button" 
              onClick={onNextTrack}
              aria-label="Next track" 
              title="Next song (or use right arrow)"
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
