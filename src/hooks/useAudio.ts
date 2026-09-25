import { useState, useEffect, useCallback } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { SoundscapeType } from '../types/experience';
import { SAMPLE_SONGS } from '../data/songs';

export function useAudio() {
  const engine = AudioEngine.getInstance();

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(195);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcedural, setIsProcedural] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const [mixer, setMixer] = useState(engine.getMixerState());

  const currentSong = SAMPLE_SONGS[currentSongIndex];

  useEffect(() => {
    const unsubscribe = engine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
      setIsLoading(state.isLoading);
      setIsProcedural(state.isProceduralSong);
    });

    return () => {
      unsubscribe();
    };
  }, [engine]);

  // Track ended event
  useEffect(() => {
    const handleTrackEnded = () => {
      if (isRepeat) {
        engine.seek(0);
        engine.play();
      } else {
        handleNext();
      }
    };

    window.addEventListener('vintage-kerala:track-ended', handleTrackEnded);
    return () => {
      window.removeEventListener('vintage-kerala:track-ended', handleTrackEnded);
    };
  }, [isRepeat, isShuffle, currentSongIndex]);

  const playSong = useCallback((index: number) => {
    if (index >= 0 && index < SAMPLE_SONGS.length) {
      setCurrentSongIndex(index);
      engine.loadSong(SAMPLE_SONGS[index], true);
    }
  }, [engine]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      engine.pause();
    } else {
      if (!currentSong) {
        playSong(0);
      } else {
        await engine.play();
      }
    }
  }, [isPlaying, engine, currentSong, playSong]);

  const handleNext = useCallback(() => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * SAMPLE_SONGS.length);
      playSong(nextIndex);
    } else {
      const nextIndex = (currentSongIndex + 1) % SAMPLE_SONGS.length;
      playSong(nextIndex);
    }
  }, [currentSongIndex, isShuffle, playSong]);

  const handlePrev = useCallback(() => {
    if (currentTime > 4) {
      engine.seek(0);
    } else {
      const prevIndex = (currentSongIndex - 1 + SAMPLE_SONGS.length) % SAMPLE_SONGS.length;
      playSong(prevIndex);
    }
  }, [currentTime, currentSongIndex, engine, playSong]);

  const seek = useCallback((secs: number) => {
    engine.seek(secs);
  }, [engine]);

  const setEnvironmentSoundscape = useCallback((type: SoundscapeType, audioPath?: string) => {
    engine.setEnvironmentSoundscape(type, audioPath);
  }, [engine]);

  const setMasterVolume = useCallback((v: number) => {
    engine.setMasterVolume(v);
    setMixer(engine.getMixerState());
  }, [engine]);

  const setMusicVolume = useCallback((v: number) => {
    engine.setMusicVolume(v);
    setMixer(engine.getMixerState());
  }, [engine]);

  const setAmbientVolume = useCallback((v: number) => {
    engine.setAmbientVolume(v);
    setMixer(engine.getMixerState());
  }, [engine]);

  const toggleMute = useCallback(() => {
    engine.toggleMute();
    setMixer(engine.getMixerState());
  }, [engine]);

  const toggleAmbient = useCallback(() => {
    engine.toggleAmbient();
    setMixer(engine.getMixerState());
  }, [engine]);

  return {
    currentSong,
    currentSongIndex,
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
  };
}
