import React, { useState, useEffect, useCallback } from 'react';
import { ENVIRONMENTS } from '../../data/environments';
import { useAudio } from '../../hooks/useAudio';
import { EnvironmentViewer } from '../environments/EnvironmentViewer';
import { HomePageModeSwitcher } from '../environments/HomePageModeSwitcher';
import { SaloonHeader } from './SaloonHeader';
import { SaloonPlayer } from '../audio/SaloonPlayer';
import { SAMPLE_SONGS } from '../../data/songs';

export const MainExperience: React.FC = () => {
  const [activeEnvIndex, setActiveEnvIndex] = useState<number>(0);

  const activeEnvironment = ENVIRONMENTS[activeEnvIndex];

  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    togglePlay,
    handleNext,
    handlePrev,
    seek,
    playSong,
    setEnvironmentSoundscape,
    toggleMute,
    toggleLofi,
    mixer,
  } = useAudio();

  // Environment switching
  const handlePrevEnvironment = useCallback(() => {
    setActiveEnvIndex((prev) => (prev - 1 + ENVIRONMENTS.length) % ENVIRONMENTS.length);
  }, []);

  const handleNextEnvironment = useCallback(() => {
    setActiveEnvIndex((prev) => (prev + 1) % ENVIRONMENTS.length);
  }, []);

  // Sync ambient soundscape when environment changes (seamless crossfade)
  useEffect(() => {
    setEnvironmentSoundscape(activeEnvironment.soundscapeType, activeEnvironment.ambientAudio);
  }, [activeEnvironment, setEnvironmentSoundscape]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        handleNextEnvironment();
      } else if (e.key === 'ArrowLeft') {
        handlePrevEnvironment();
      } else if (e.key >= '1' && e.key <= '6') {
        const targetIdx = parseInt(e.key, 10) - 1;
        if (targetIdx < ENVIRONMENTS.length) {
          setActiveEnvIndex(targetIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, handleNextEnvironment, handlePrevEnvironment]);

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden select-none">
      {/* 1. Full-screen Edge-to-Edge Background Art / Flow Video */}
      <EnvironmentViewer environment={activeEnvironment} />

      {/* 2. Saloon.wtf Exact Top Bar: Live Clock, Online Badge, Spotify, YT Music, Scene Selector */}
      <SaloonHeader
        activeEnvironment={activeEnvironment}
        environmentIndex={activeEnvIndex}
        totalEnvironments={ENVIRONMENTS.length}
        onNextEnvironment={handleNextEnvironment}
      />

      {/* 3. Subtle Edge Chevrons to switch Kerala scenes */}
      <button
        onClick={handlePrevEnvironment}
        aria-label="Previous scene"
        title="Previous Kerala scene (Left Arrow)"
        className="fixed left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-black/40 backdrop-blur-xs transition-all active:scale-95 cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <button
        onClick={handleNextEnvironment}
        aria-label="Next scene"
        title="Next Kerala scene (Right Arrow)"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-black/40 backdrop-blur-xs transition-all active:scale-95 cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Center Spacer to balance layout */}
      <div className="flex-1" />

      {/* 5. Bottom Section: Homepage Mode Switcher + Saloon Player Dock */}
      <div className="w-full flex flex-col items-center">
        {/* On-Page Kerala Environment Mode Switcher */}
        <HomePageModeSwitcher
          activeEnvironment={activeEnvironment}
          onSelectEnvironment={(env) => {
            const idx = ENVIRONMENTS.findIndex((e) => e.id === env.id);
            if (idx !== -1) setActiveEnvIndex(idx);
          }}
        />

        {/* Saloon.wtf Exact Centered Bottom Player */}
        <SaloonPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isLoading={isLoading}
          onTogglePlay={togglePlay}
          onNextTrack={handleNext}
          onPrevTrack={handlePrev}
          onSeek={seek}
          allSongs={SAMPLE_SONGS}
          currentIndex={currentSongIndex}
          onSelectTrack={playSong}
          isLofiEnabled={mixer.lofiEnabled}
          onToggleLofi={toggleLofi}
        />
      </div>
    </main>
  );
};
