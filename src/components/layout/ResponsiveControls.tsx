import React from 'react';
import { Environment } from '../../types/experience';
import { 
  Compass, 
  Sliders, 
  ListMusic, 
  Maximize, 
  Minimize, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface ResponsiveControlsProps {
  activeEnvironment: Environment;
  isMixerOpen: boolean;
  isLibraryOpen: boolean;
  isSelectorOpen: boolean;
  isMotionEnabled: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onToggleSelector: () => void;
  onToggleMixer: () => void;
  onToggleLibrary: () => void;
  onToggleMotion: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  activeEnvironment,
  isMotionEnabled,
  isMuted,
  isFullscreen,
  onToggleSelector,
  onToggleMixer,
  onToggleLibrary,
  onToggleMotion,
  onToggleMute,
  onToggleFullscreen,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6 pointer-events-none">
      {/* Brand & Active Scene Selector Button */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <button
          onClick={onToggleSelector}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#1D2B24]/85 border border-[#C6A46A]/50 text-[#E9D8B5] backdrop-blur-md shadow-lg shadow-black/30 hover:bg-[#253930] hover:border-[#C6A46A] transition-all cursor-pointer"
          title="Switch Kerala Environment"
          aria-label="Open environment selector"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-[#C6A46A]/60">
            <img 
              src="/assets/icons/kerala-lamp.svg" 
              alt="Lamp icon" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <span className="font-display text-xs sm:text-sm font-semibold tracking-wide text-[#E9D8B5] block leading-tight">
              {activeEnvironment.name}
            </span>
            <span className="font-malayalam text-[10px] text-[#C6A46A] block leading-none">
              {activeEnvironment.malayalamName}
            </span>
          </div>
          <Compass className="w-4 h-4 text-[#C6A46A] ml-1 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* Floating Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Toggle Cinematic Drift Motion */}
        <button
          onClick={onToggleMotion}
          title={isMotionEnabled ? 'Pause Camera Motion' : 'Resume Camera Motion'}
          aria-label={isMotionEnabled ? 'Pause Camera Motion' : 'Resume Camera Motion'}
          className={`p-2.5 rounded-full border backdrop-blur-md shadow-md transition-all cursor-pointer ${
            isMotionEnabled 
              ? 'bg-[#1D2B24]/80 border-[#C6A46A]/40 text-[#C6A46A] hover:bg-[#253930]' 
              : 'bg-black/60 border-white/10 text-[#E9D8B5]/50 hover:text-[#E9D8B5]'
          }`}
        >
          {isMotionEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className={`p-2.5 rounded-full border backdrop-blur-md shadow-md transition-all cursor-pointer ${
            isMuted 
              ? 'bg-[#A64A32]/90 border-[#A64A32] text-white hover:bg-[#b85238]' 
              : 'bg-[#1D2B24]/80 border-[#C6A46A]/40 text-[#E9D8B5] hover:bg-[#253930]'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Mixer Toggle */}
        <button
          onClick={onToggleMixer}
          title="Atmospheric Sound Mixer"
          aria-label="Open atmospheric audio mixer"
          className="p-2.5 rounded-full bg-[#1D2B24]/80 border border-[#C6A46A]/40 text-[#E9D8B5] hover:bg-[#253930] hover:text-[#C6A46A] backdrop-blur-md shadow-md transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Song Library Toggle */}
        <button
          onClick={onToggleLibrary}
          title="Malayalam Song Library"
          aria-label="Open song library"
          className="p-2.5 rounded-full bg-[#1D2B24]/80 border border-[#C6A46A]/40 text-[#E9D8B5] hover:bg-[#253930] hover:text-[#C6A46A] backdrop-blur-md shadow-md transition-all cursor-pointer"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        {typeof document !== 'undefined' && document.fullscreenEnabled && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="hidden sm:flex p-2.5 rounded-full bg-[#1D2B24]/80 border border-[#C6A46A]/40 text-[#E9D8B5] hover:bg-[#253930] hover:text-[#C6A46A] backdrop-blur-md shadow-md transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        )}
      </div>
    </header>
  );
};
