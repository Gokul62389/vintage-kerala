import React, { useState } from 'react';
import { Song, Environment } from '../../types/experience';
import { SAMPLE_SONGS } from '../../data/songs';
import { 
  X, 
  Search, 
  Play, 
  Volume2, 
  Music2, 
  Disc, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

interface SongLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  isPlaying: boolean;
  activeEnvironment: Environment;
  onSelectSong: (index: number) => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  activeEnvironment,
  onSelectSong,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter songs based on search and optional tag
  const filteredSongs = SAMPLE_SONGS.filter((song) => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.malayalamTitle && song.malayalamTitle.includes(searchQuery)) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.movie && song.movie.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag ? song.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(SAMPLE_SONGS.flatMap((s) => s.tags)));

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#1D2B24] border border-[#C6A46A]/40 shadow-2xl text-[#E9D8B5] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <Music2 className="w-5 h-5 text-[#C6A46A]" />
            <div>
              <h2 className="font-display font-semibold text-lg text-[#E9D8B5] leading-none">
                Malayalam Song Library
              </h2>
              <span className="font-malayalam text-xs text-[#C6A46A]">
                പാട്ടുകളുടെ ശേഖരം
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            aria-label="Close library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-black/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#E9D8B5]/40" />
            <input
              type="text"
              placeholder="Search by song, movie, or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-[#E9D8B5] placeholder-[#E9D8B5]/40 focus:outline-none focus:border-[#C6A46A]"
            />
          </div>

          {/* Quick Tag Filters */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                selectedTag === null 
                  ? 'bg-[#C6A46A] text-[#1D2B24] font-medium' 
                  : 'bg-white/5 text-[#E9D8B5]/70 hover:bg-white/10'
              }`}
            >
              All Songs
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs capitalize px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  selectedTag === tag 
                    ? 'bg-[#C6A46A] text-[#1D2B24] font-medium' 
                    : 'bg-white/5 text-[#E9D8B5]/70 hover:bg-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Song List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 flex-1">
          {filteredSongs.map((song) => {
            const originalIndex = SAMPLE_SONGS.findIndex((s) => s.id === song.id);
            const isCurrent = song.id === currentSong.id;
            const isRecommendedForScene = song.recommendedEnvironments.includes(activeEnvironment.id);

            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(originalIndex);
                }}
                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#181816] border-[#C6A46A] ring-1 ring-[#C6A46A]/50'
                    : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-black/30'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Disc / Play Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isCurrent ? 'bg-[#C6A46A] text-[#1D2B24]' : 'bg-white/5 text-[#E9D8B5]/60 group-hover:text-[#E9D8B5]'
                  }`}>
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>

                  {/* Song Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-[#E9D8B5] group-hover:text-white truncate">
                        {song.title}
                      </h4>
                      {isRecommendedForScene && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#C6A46A] bg-[#C6A46A]/10 border border-[#C6A46A]/30 px-1.5 py-0.2 rounded-full shrink-0">
                          <MapPin className="w-2.5 h-2.5" />
                          Recommended for this scene
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#E9D8B5]/60 truncate font-light mt-0.5">
                      {song.movie ? `${song.movie} • ` : ''}{song.artist}
                    </p>
                  </div>
                </div>

                {/* Tags & Year */}
                <div className="hidden sm:flex items-center gap-3 shrink-0 ml-4">
                  {song.year && (
                    <span className="text-xs text-[#E9D8B5]/50 font-mono">
                      {song.year}
                    </span>
                  )}
                  <Disc className="w-4 h-4 text-white/20 group-hover:text-[#C6A46A] transition-colors" />
                </div>
              </div>
            );
          })}

          {filteredSongs.length === 0 && (
            <div className="text-center py-12 text-[#E9D8B5]/60">
              No matching songs found in library.
            </div>
          )}
        </div>

        {/* Footer instructions */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-[#E9D8B5]/60">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A46A]" />
            <span>Drop your Malayalam songs in <code className="text-[#C6A46A]">public/assets/audio/songs/</code></span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
