import React, { useState } from 'react';
import { ExternalLink, X, ChevronDown, ChevronUp, Sliders } from 'lucide-react';

interface SpotifyEmbedPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlaylistUrl?: string;
  foleyVolume: number;
  onFoleyVolumeChange: (vol: number) => void;
  sceneName: string;
}

export const SpotifyEmbedPlayer: React.FC<SpotifyEmbedPlayerProps> = ({
  isOpen,
  onClose,
  initialPlaylistUrl = 'https://open.spotify.com/playlist/2o6xkm1yZJ5t6z2wDOaYGF',
  foleyVolume,
  onFoleyVolumeChange,
  sceneName,
}) => {
  const [playlistUrl, setPlaylistUrl] = useState<string>(initialPlaylistUrl);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [showMixer, setShowMixer] = useState<boolean>(false);

  // Parse any Spotify URL into an embed link
  const getEmbedUrl = (url: string): string => {
    try {
      const match = url.match(/spotify\.com\/(playlist|album|track|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
    } catch {}
    // Fallback to the user's specific playlist
    return 'https://open.spotify.com/embed/playlist/2o6xkm1yZJ5t6z2wDOaYGF?utm_source=generator&theme=0';
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setPlaylistUrl(inputUrl.trim());
      setIsEditing(false);
      setInputUrl('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-3 sm:px-4 select-none pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="
        relative rounded-2xl overflow-hidden
        bg-black/60 backdrop-blur-2xl backdrop-saturate-150
        border border-white/20
        shadow-[0_16px_50px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25)]
        p-3 sm:p-4 text-white
      ">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            {/* Spotify Green Icon */}
            <div className="h-7 w-7 rounded-full bg-[#1DB954] flex items-center justify-center shadow-[0_0_10px_rgba(29,185,84,0.5)] shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">
                  Connected Spotify Playlist
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
              </div>
              <span className="text-[10px] text-white/60">
                Layered with {sceneName} Foley ambience
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Ambient Mixer Toggle */}
            <button
              onClick={() => setShowMixer(!showMixer)}
              title="Adjust Kerala Foley ambience volume"
              className={`p-1.5 rounded-full transition cursor-pointer ${
                showMixer ? 'bg-white/20 text-[#1DB954]' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Change Playlist button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              title="Change Spotify Playlist"
              className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition cursor-pointer font-medium"
            >
              {isEditing ? 'Cancel' : 'Change'}
            </button>

            {/* Compact / Expand Toggle */}
            <button
              onClick={() => setIsCompact(!isCompact)}
              title={isCompact ? 'Expand player' : 'Compact player'}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              {isCompact ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close Spotify player"
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Change Playlist Input Field */}
        {isEditing && (
          <form onSubmit={handleApplyUrl} className="mb-3 flex items-center gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste any Spotify playlist, album, or song URL..."
              className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#1DB954]"
            />
            <button
              type="submit"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Load
            </button>
          </form>
        )}

        {/* Ambient Foley Layer Volume Slider */}
        {showMixer && (
          <div className="mb-2.5 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
            <span className="text-white/80 shrink-0 flex items-center gap-1.5">
              <span>🌾</span>
              <span>Kerala Foley Layer:</span>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={foleyVolume}
              onChange={(e) => onFoleyVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
            <span className="font-mono text-[11px] text-[#1DB954] w-8 text-right">
              {Math.round(foleyVolume * 100)}%
            </span>
          </div>
        )}

        {/* Official Spotify Web Player Embed IFrame */}
        <div className="w-full rounded-xl overflow-hidden bg-black/40 shadow-inner">
          <iframe
            src={getEmbedUrl(playlistUrl)}
            width="100%"
            height={isCompact ? '80' : '152'}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full border-0 transition-all duration-300"
            title="Spotify Playlist Player"
          />
        </div>

        {/* Footer Link & Status */}
        <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-white/50">
          <span>Plays seamlessly alongside Higgsfield video & Foley</span>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#1DB954] hover:underline"
          >
            <span>Open in App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
