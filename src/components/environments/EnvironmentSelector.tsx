import React, { useEffect, useRef } from 'react';
import { Environment } from '../../types/experience';
import { ENVIRONMENTS } from '../../data/environments';
import { X, Check, MapPin, Volume2 } from 'lucide-react';

interface EnvironmentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeEnvironment: Environment;
  onSelectEnvironment: (env: Environment) => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  isOpen,
  onClose,
  activeEnvironment,
  onSelectEnvironment,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = ENVIRONMENTS.findIndex((e) => e.id === activeEnvironment.id);
        const next = ENVIRONMENTS[(currentIndex + 1) % ENVIRONMENTS.length];
        onSelectEnvironment(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = ENVIRONMENTS.findIndex((e) => e.id === activeEnvironment.id);
        const prev = ENVIRONMENTS[(currentIndex - 1 + ENVIRONMENTS.length) % ENVIRONMENTS.length];
        onSelectEnvironment(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeEnvironment, onClose, onSelectEnvironment]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#1D2B24] border border-[#C6A46A]/30 shadow-2xl text-[#E9D8B5] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#C6A46A]" />
            <div>
              <h2 className="font-display text-lg font-semibold text-[#E9D8B5] leading-none">
                Kerala Environments
              </h2>
              <span className="font-malayalam text-xs text-[#C6A46A]">
                സ്ഥലങ്ങളും ചുറ്റുപാടുകളും തിരഞ്ഞെടുക്കുക
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            aria-label="Close environment selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Grid of 6 Environments */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENVIRONMENTS.map((env) => {
            const isCurrent = env.id === activeEnvironment.id;

            return (
              <button
                key={env.id}
                onClick={() => {
                  onSelectEnvironment(env);
                  onClose();
                }}
                className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col bg-[#181816]/70 hover:border-[#C6A46A] hover:shadow-lg hover:shadow-black/50 ${
                  isCurrent 
                    ? 'border-[#C6A46A] ring-2 ring-[#C6A46A]/50 scale-[1.01]' 
                    : 'border-white/10 hover:scale-[1.01]'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={env.thumbnail}
                    alt={env.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Active Badge */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#1D2B24] border border-[#C6A46A] text-[#C6A46A] text-[11px] font-medium flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Active</span>
                    </div>
                  )}

                  {/* Ambient indicator badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-[#E9D8B5]/90 flex items-center gap-1">
                    <Volume2 className="w-2.5 h-2.5 text-[#C6A46A]" />
                    <span className="capitalize">{env.soundscapeType.replace('-', ' ')} ambience</span>
                  </div>
                </div>

                {/* Environment Info */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="font-malayalam text-xs text-[#C6A46A] block font-medium">
                      {env.malayalamName}
                    </span>
                    <h3 className="font-medium text-sm text-[#E9D8B5] group-hover:text-white transition-colors">
                      {env.name}
                    </h3>
                    <p className="text-xs text-[#E9D8B5]/70 line-clamp-2 mt-1 font-light leading-relaxed">
                      {env.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/5">
                    {env.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[#E9D8B5]/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs text-[#E9D8B5]/60">
          <span>Current song continues uninterrupted while switching</span>
          <span className="hidden sm:inline">Use Arrow keys & Enter to navigate</span>
        </div>
      </div>
    </div>
  );
};
