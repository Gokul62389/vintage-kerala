import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Wind, 
  X, 
  Sliders, 
  Sparkles 
} from 'lucide-react';
import { AudioMixerState, SoundscapeType } from '../../types/experience';

interface AudioMixerProps {
  isOpen: boolean;
  onClose: () => void;
  mixerState: AudioMixerState;
  activeSoundscape: SoundscapeType;
  onSetMasterVolume: (val: number) => void;
  onSetMusicVolume: (val: number) => void;
  onSetAmbientVolume: (val: number) => void;
  onToggleMute: () => void;
  onToggleAmbient: () => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({
  isOpen,
  onClose,
  mixerState,
  activeSoundscape,
  onSetMasterVolume,
  onSetMusicVolume,
  onSetAmbientVolume,
  onToggleMute,
  onToggleAmbient,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-[#1D2B24] border border-[#C6A46A]/40 shadow-2xl p-5 text-[#E9D8B5] backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#C6A46A]" />
            <div>
              <h3 className="font-display font-medium text-base text-[#E9D8B5] leading-none">
                Kerala Atmosphere Mixer
              </h3>
              <span className="font-malayalam text-xs text-[#C6A46A]">
                സംഗീതവും പ്രകൃതി ശബ്ദങ്ങളും ക്രമീകരിക്കുക
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#E9D8B5]/70 hover:text-[#E9D8B5] transition-colors cursor-pointer"
            aria-label="Close mixer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Mute & Global Control */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-full cursor-pointer transition-colors ${
                mixerState.isMuted 
                  ? 'bg-[#A64A32] text-white' 
                  : 'bg-white/10 text-[#C6A46A] hover:bg-white/20'
              }`}
              aria-label={mixerState.isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {mixerState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div>
              <span className="text-xs font-medium block">
                {mixerState.isMuted ? 'Audio Muted' : 'Master Output'}
              </span>
              <span className="text-[11px] text-[#E9D8B5]/60">
                {Math.round(mixerState.masterVolume * 100)}% volume
              </span>
            </div>
          </div>

          <div className="w-32">
            <label htmlFor="master-volume-slider" className="sr-only">Master Volume</label>
            <input
              id="master-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mixerState.masterVolume}
              onChange={(e) => onSetMasterVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Dual Channel Faders */}
        <div className="space-y-4">
          {/* Channel 1: Malayalam Song */}
          <div className="p-3.5 rounded-xl bg-[#181816]/70 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#C6A46A]" />
                <span className="text-sm font-medium">Main Malayalam Song</span>
              </div>
              <span className="text-xs font-mono text-[#E9D8B5]/70">
                {Math.round(mixerState.musicVolume * 100)}%
              </span>
            </div>
            <div>
              <label htmlFor="music-volume-slider" className="sr-only">Music Volume</label>
              <input
                id="music-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mixerState.musicVolume}
                onChange={(e) => onSetMusicVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <p className="text-[11px] text-[#E9D8B5]/50 font-light">
              Primary music playback layer. Continues playing across all scenes.
            </p>
          </div>

          {/* Channel 2: Environment Ambience */}
          <div className="p-3.5 rounded-xl bg-[#181816]/70 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#C6A46A]" />
                <span className="text-sm font-medium">
                  Scene Ambience ({activeSoundscape.replace('-', ' ')})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleAmbient}
                  className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    mixerState.ambientEnabled 
                      ? 'bg-[#6B7250]/60 text-[#E9D8B5] border border-[#6B7250]' 
                      : 'bg-white/5 text-[#E9D8B5]/40 border border-white/10'
                  }`}
                >
                  {mixerState.ambientEnabled ? 'Enabled' : 'Muted'}
                </button>
                <span className="text-xs font-mono text-[#E9D8B5]/70">
                  {mixerState.ambientEnabled ? Math.round(mixerState.ambientVolume * 100) : 0}%
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="ambient-volume-slider" className="sr-only">Ambient Volume</label>
              <input
                id="ambient-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                disabled={!mixerState.ambientEnabled}
                value={mixerState.ambientVolume}
                onChange={(e) => onSetAmbientVolume(parseFloat(e.target.value))}
                className={`w-full ${!mixerState.ambientEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C6A46A]">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Crossfades automatically with gain ramps when you switch environments</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-xs text-[#E9D8B5]/60">
          Drop your own <code className="text-[#C6A46A]">.mp3</code> files in <span className="text-white/80">public/assets/audio/</span>
        </div>
      </div>
    </div>
  );
};
