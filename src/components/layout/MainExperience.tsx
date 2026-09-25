import React, { useState, useEffect, useCallback } from 'react';
import { Environment } from '../../types/experience';
import { ENVIRONMENTS } from '../../data/environments';
import { useAudio } from '../../hooks/useAudio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EnvironmentViewer } from '../environments/EnvironmentViewer';
import { EnvironmentSelector } from '../environments/EnvironmentSelector';
import { ResponsiveControls } from './ResponsiveControls';
import { MusicPlayer } from '../audio/MusicPlayer';
import { AudioMixer } from '../audio/AudioMixer';
import { SongLibrary } from '../library/SongLibrary';
import { Info } from 'lucide-react';

export const MainExperience: React.FC = () => {
  const [activeEnvironment, setActiveEnvironment] = useState<Environment>(ENVIRONMENTS[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [isMixerOpen, setIsMixerOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isMotionEnabled, setIsMotionEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reducedMotion = useReducedMotion();

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    isProcedural,
    isShuffle,
    isRepeat,
    mixer,
    togglePlay,
    handleNext,
    handlePrev,
    seek,
    playSong,
    setIsShuffle,
    setIsRepeat,
    setEnvironmentSoundscape,
    setMasterVolume,
    setMusicVolume,
    setAmbientVolume,
    toggleMute,
    toggleAmbient,
  } = useAudio();

  // Show a temporary toast message
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  // Sync ambient soundscape when environment changes (seamless crossfade)
  useEffect(() => {
    setEnvironmentSoundscape(activeEnvironment.soundscapeType, activeEnvironment.ambientAudio);
  }, [activeEnvironment, setEnvironmentSoundscape]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLibraryOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsSelectorOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSelectorOpen(false);
        setIsMixerOpen(false);
        setIsLibraryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#181816]">
      {/* 1. Immersive Full-Screen Visual Canvas */}
      <EnvironmentViewer
        environment={activeEnvironment}
        isMotionEnabled={isMotionEnabled}
        reducedMotion={reducedMotion}
        onHotspotClick={(title, desc) => {
          triggerToast(`${title}: ${desc}`);
        }}
      />

      {/* 2. Top Bar & Floating Controls */}
      <ResponsiveControls
        activeEnvironment={activeEnvironment}
        isMixerOpen={isMixerOpen}
        isLibraryOpen={isLibraryOpen}
        isSelectorOpen={isSelectorOpen}
        isMotionEnabled={isMotionEnabled}
        isMuted={mixer.isMuted}
        isFullscreen={isFullscreen}
        onToggleSelector={() => setIsSelectorOpen(true)}
        onToggleMixer={() => setIsMixerOpen(true)}
        onToggleLibrary={() => setIsLibraryOpen(true)}
        onToggleMotion={() => setIsMotionEnabled((prev) => !prev)}
        onToggleMute={toggleMute}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 3. Bottom Docked Floating Player */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none flex flex-col items-center">
        {/* Toast Notification Bar */}
        {toastMessage && (
          <div className="mb-3 px-4 py-2 rounded-full bg-[#1D2B24]/95 text-[#E9D8B5] border border-[#C6A46A]/50 text-xs shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-center gap-2 max-w-md text-center">
            <Info className="w-4 h-4 text-[#C6A46A] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-xl pointer-events-auto">
          <MusicPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            isLoading={isLoading}
            isProcedural={isProcedural}
            isShuffle={isShuffle}
            isRepeat={isRepeat}
            onTogglePlay={togglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            onSeek={seek}
            onToggleShuffle={() => setIsShuffle((prev) => !prev)}
            onToggleRepeat={() => setIsRepeat((prev) => !prev)}
            onOpenMixer={() => setIsMixerOpen(true)}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        </div>

        {/* Quick hint bar */}
        <div className="mt-2 hidden sm:flex items-center gap-3 text-[11px] text-[#E9D8B5]/40 select-none">
          <span>Space: Play/Pause</span>
          <span>•</span>
          <span>E: Scenes</span>
          <span>•</span>
          <span>L: Library</span>
          <span>•</span>
          <span>M: Mute</span>
        </div>
      </div>

      {/* 4. Overlays & Drawers */}
      <EnvironmentSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        activeEnvironment={activeEnvironment}
        onSelectEnvironment={(env) => {
          setActiveEnvironment(env);
          triggerToast(`Entered ${env.name}`);
        }}
      />

      <AudioMixer
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        mixerState={mixer}
        activeSoundscape={activeEnvironment.soundscapeType}
        onSetMasterVolume={setMasterVolume}
        onSetMusicVolume={setMusicVolume}
        onSetAmbientVolume={setAmbientVolume}
        onToggleMute={toggleMute}
        onToggleAmbient={toggleAmbient}
      />

      <SongLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        activeEnvironment={activeEnvironment}
        onSelectSong={(idx) => {
          playSong(idx);
          setIsLibraryOpen(false);
        }}
      />
    </main>
  );
};
