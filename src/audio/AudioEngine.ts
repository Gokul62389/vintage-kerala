import { SoundscapeType, Song } from '../types/experience';
import { SpotifyPlayerManager } from './SpotifyPlayerManager';

type PlaybackStateListener = (state: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  isProceduralSong: boolean;
  isSpotifyActive: boolean;
  error: string | null;
}) => void;

export class AudioEngine {
  private static instance: AudioEngine;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  // Music Player state
  private musicAudio: HTMLAudioElement | null = null;
  private currentSong: Song | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private masterVol: number = 0.85;
  private musicVol: number = 0.75;
  private ambientVol: number = 0.35;
  private ambientEnabled: boolean = true;
  private listeners: Set<PlaybackStateListener> = new Set();

  // Spotify Playback integration
  private spotifyManager: SpotifyPlayerManager = SpotifyPlayerManager.getInstance();
  private isSpotifyActive: boolean = false;
  private spotifyCurrentTime: number = 0;
  private spotifyDuration: number = 240;

  // Procedural fallback music (when local mp3 is not yet dropped in)
  private isProceduralSongActive: boolean = false;
  private proceduralInterval: number | null = null;
  private proceduralCurrentTime: number = 0;
  private proceduralDuration: number = 195; // 3m 15s

  // Ambient sound state
  private currentSoundscape: SoundscapeType | null = null;
  private activeAmbientNodes: {
    stop: () => void;
    gain: GainNode;
  }[] = [];
  private ambientAudioElement: HTMLAudioElement | null = null;
  private foleyBufferCache: Map<string, AudioBuffer> = new Map();
  private foleyLoopStopFn: (() => void) | null = null;

  private constructor() {
    // Listen to Spotify EmbedController playback updates
    this.spotifyManager.subscribe((update) => {
      if (this.isSpotifyActive) {
        this.isPlaying = !update.isPaused;
        this.spotifyCurrentTime = update.position / 1000;
        if (update.duration > 0) {
          this.spotifyDuration = update.duration / 1000;
        }
        this.notifyState({ isLoading: update.isBuffering });
      }
    });
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public async initContext(): Promise<void> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Ambient bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientEnabled ? this.ambientVol : 0, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public subscribe(listener: PlaybackStateListener): () => void {
    this.listeners.add(listener);
    this.notifyState();
    return () => this.listeners.delete(listener);
  }

  private notifyState(extra?: { isLoading?: boolean; error?: string | null }): void {
    let time = 0;
    let dur = this.currentSong?.duration || 240;

    if (this.isSpotifyActive) {
      time = this.spotifyCurrentTime;
      dur = this.spotifyDuration > 0 ? this.spotifyDuration : (this.currentSong?.duration || 240);
    } else if (this.isProceduralSongActive) {
      time = this.proceduralCurrentTime;
      dur = this.proceduralDuration;
    } else {
      time = this.musicAudio?.currentTime || 0;
      dur = this.musicAudio?.duration || (this.currentSong?.duration || 240);
    }

    const payload = {
      isPlaying: this.isPlaying,
      currentTime: Number.isFinite(time) ? time : 0,
      duration: Number.isFinite(dur) && dur > 0 ? dur : 240,
      isLoading: extra?.isLoading ?? false,
      isProceduralSong: this.isProceduralSongActive,
      isSpotifyActive: this.isSpotifyActive,
      error: extra?.error ?? null,
    };

    this.listeners.forEach((l) => l(payload));
  }

  // --- MUSIC PLAYBACK ---

  public async loadSong(song: Song, autoPlay = true): Promise<void> {
    await this.initContext();
    this.currentSong = song;
    this.stopProceduralSong();

    // Priority 1: If the track has a Spotify URI and EmbedController is ready or connecting,
    // route playback through Spotify Player Manager so the song plays in its FULL ENTIRETY!
    if (song.spotifyUri) {
      this.isSpotifyActive = true;
      this.spotifyCurrentTime = 0;
      this.spotifyDuration = song.duration || 240;

      // Stop any local HTML5 preview audio
      if (this.musicAudio) {
        this.musicAudio.pause();
        this.musicAudio.src = '';
        this.musicAudio = null;
      }

      this.notifyState({ isLoading: autoPlay, error: null });
      this.spotifyManager.loadTrack(song.spotifyUri, autoPlay);

      // If Spotify controller isn't mounted yet or user wants preview audio fallback,
      // load audio element as secondary parallel source
      return;
    }

    this.isSpotifyActive = false;

    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.src = '';
      this.musicAudio.load();
      this.musicAudio = null;
    }

    this.notifyState({ isLoading: true, error: null });

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = song.audio;
    this.musicAudio = audio;

    // Attach to Web Audio if possible or direct volume control
    audio.volume = this.isMuted ? 0 : this.masterVol * this.musicVol;

    let hasLoaded = false;

    audio.addEventListener('loadedmetadata', () => {
      hasLoaded = true;
      this.notifyState({ isLoading: false });
      if (autoPlay) {
        this.play();
      }
    });

    audio.addEventListener('timeupdate', () => {
      this.notifyState();
    });

    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyState();
      // Auto trigger next track event if registered
      window.dispatchEvent(new CustomEvent('vintage-kerala:track-ended'));
    });

    audio.addEventListener('error', () => {
      if (!hasLoaded) {
        // If file doesn't exist on disk yet, gracefully activate procedural nostalgic acoustic melody
        console.warn(`Local audio "${song.audio}" not found on disk. Activating procedural nostalgic acoustic sample.`);
        this.startProceduralSong(autoPlay);
      }
    });

    // Timeout check in case network hangs or file is completely 404
    setTimeout(() => {
      if (!hasLoaded && this.musicAudio === audio && !this.isProceduralSongActive && !this.isSpotifyActive) {
        this.startProceduralSong(autoPlay);
      }
    }, 1200);
  }

  public async play(): Promise<void> {
    await this.initContext();

    if (this.isSpotifyActive) {
      this.isPlaying = true;
      this.spotifyManager.play();
      this.notifyState();
      return;
    }

    if (this.isProceduralSongActive) {
      this.isPlaying = true;
      this.notifyState();
      return;
    }

    if (this.musicAudio) {
      try {
        await this.musicAudio.play();
        this.isPlaying = true;
        this.notifyState();
      } catch (err) {
        console.warn('Playback gesture required or source failed:', err);
        // Fallback to procedural sample
        this.startProceduralSong(true);
      }
    } else if (this.currentSong) {
      this.startProceduralSong(true);
    }
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.isSpotifyActive) {
      this.spotifyManager.pause();
    }
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    this.notifyState();
  }

  public seek(seconds: number): void {
    if (this.isSpotifyActive) {
      this.spotifyCurrentTime = seconds;
      this.spotifyManager.seek(seconds);
      this.notifyState();
      return;
    }

    if (this.isProceduralSongActive) {
      this.proceduralCurrentTime = Math.max(0, Math.min(seconds, this.proceduralDuration));
      this.notifyState();
      return;
    }

    if (this.musicAudio && Number.isFinite(this.musicAudio.duration)) {
      this.musicAudio.currentTime = Math.max(0, Math.min(seconds, this.musicAudio.duration));
      this.notifyState();
    }
  }

  // --- PROCEDURAL ACOUSTIC NOSTALGIA SYNTHESIZER ---
  // Renders a beautiful vintage acoustic pentatonic melody (Mohanam / Bhupali raga)
  // so the user hears authentic Malayalam classical music immediately!
  private startProceduralSong(playImmediately = true): void {
    this.isProceduralSongActive = true;
    this.isPlaying = playImmediately;
    this.notifyState({ isLoading: false });

    if (this.proceduralInterval) {
      clearInterval(this.proceduralInterval);
    }

    // Melodic notes in Mohanam / vintage Malayalam film scale (Hz)
    // C4, D4, E4, G4, A4, C5, D5
    const ragaNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 440.00, 392.00, 329.63];
    let noteIndex = 0;

    this.proceduralInterval = window.setInterval(() => {
      if (!this.isPlaying) return;

      this.proceduralCurrentTime += 0.5;
      if (this.proceduralCurrentTime >= this.proceduralDuration) {
        this.proceduralCurrentTime = 0;
        window.dispatchEvent(new CustomEvent('vintage-kerala:track-ended'));
      }

      // Trigger soft acoustic plucks every ~0.5s or 1.0s
      if (Math.random() > 0.15 && this.ctx && this.musicGain) {
        const freq = ragaNotes[noteIndex % ragaNotes.length];
        noteIndex++;
        this.triggerAcousticPluck(freq);
      }

      this.notifyState();
    }, 500);
  }

  private stopProceduralSong(): void {
    this.isProceduralSongActive = false;
    if (this.proceduralInterval) {
      clearInterval(this.proceduralInterval);
      this.proceduralInterval = null;
    }
    this.proceduralCurrentTime = 0;
  }

  private triggerAcousticPluck(freq: number): void {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm vintage wood / acoustic tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

      const effectiveVolume = (this.isMuted ? 0 : this.masterVol * this.musicVol) * 0.18;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(effectiveVolume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch {
      // AudioContext closed or inactive
    }
  }

  // --- AMBIENT SOUNDSCAPE CONTROLLER & CROSSFADER ---

  public async setEnvironmentSoundscape(type: SoundscapeType, externalAudioPath?: string): Promise<void> {
    await this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    if (this.currentSoundscape === type) return;
    this.currentSoundscape = type;

    // Smoothly fade out existing ambient sound over 1.2 seconds
    const now = this.ctx.currentTime;
    const oldNodes = [...this.activeAmbientNodes];
    this.activeAmbientNodes = [];

    oldNodes.forEach(({ gain, stop }) => {
      try {
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => stop(), 1300);
      } catch {
        stop();
      }
    });

    if (this.foleyLoopStopFn) {
      this.foleyLoopStopFn();
      this.foleyLoopStopFn = null;
    }

    if (this.ambientAudioElement) {
      const el = this.ambientAudioElement;
      this.ambientAudioElement = null;
      el.pause();
      el.src = '';
    }

    const sceneGain = this.ctx.createGain();
    sceneGain.gain.setValueAtTime(0.0001, now);
    sceneGain.gain.linearRampToValueAtTime(1.0, now + 1.2);
    sceneGain.connect(this.ambientGain);

    if (externalAudioPath) {
      this.playSeamlessFoleyLoop(externalAudioPath, sceneGain).then((stopFn) => {
        this.foleyLoopStopFn = stopFn;
        this.activeAmbientNodes.push({ gain: sceneGain, stop: stopFn });
      }).catch(() => {
        this.synthesizeSoundscape(type);
      });
    } else {
      this.synthesizeSoundscape(type);
    }
  }

  // Dual-Deck Web Audio Buffer Crossfade Looper for 100% gapless, seamless playback
  private async playSeamlessFoleyLoop(audioPath: string, parentGain: GainNode): Promise<() => void> {
    if (!this.ctx) return () => {};

    let buffer = this.foleyBufferCache.get(audioPath);
    if (!buffer) {
      try {
        const response = await fetch(audioPath);
        const arrayBuffer = await response.arrayBuffer();
        buffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.foleyBufferCache.set(audioPath, buffer);
      } catch {
        // Fallback to simple HTML audio if Web Audio fetch/decode fails
        const fallbackAudio = new Audio(audioPath);
        fallbackAudio.loop = true;
        fallbackAudio.volume = this.isMuted || !this.ambientEnabled ? 0 : this.masterVol * this.ambientVol;
        fallbackAudio.play().catch(() => {});
        this.ambientAudioElement = fallbackAudio;
        return () => {
          fallbackAudio.pause();
          fallbackAudio.src = '';
        };
      }
    }

    if (!buffer || buffer.duration <= 2) return () => {};

    let isRunning = true;
    let nextTimer: number | null = null;
    const activeSources: { source: AudioBufferSourceNode; gain: GainNode }[] = [];

    // Equal-power crossfade of 2.2 seconds between consecutive loops
    const crossfadeTime = Math.min(2.5, buffer.duration * 0.15);
    const loopInterval = (buffer.duration - crossfadeTime) * 1000;

    const scheduleNode = () => {
      if (!isRunning || !this.ctx) return;

      const now = this.ctx.currentTime;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const nodeGain = this.ctx.createGain();
      // Fade-in over crossfadeTime
      nodeGain.gain.setValueAtTime(0.0001, now);
      nodeGain.gain.linearRampToValueAtTime(1.0, now + crossfadeTime);
      // Fade-out at buffer end
      const fadeOutStart = now + buffer.duration - crossfadeTime;
      nodeGain.gain.setValueAtTime(1.0, fadeOutStart);
      nodeGain.gain.linearRampToValueAtTime(0.0001, now + buffer.duration);

      source.connect(nodeGain);
      nodeGain.connect(parentGain);

      source.start(now);
      source.stop(now + buffer.duration);

      const entry = { source, gain: nodeGain };
      activeSources.push(entry);

      source.onended = () => {
        const idx = activeSources.indexOf(entry);
        if (idx !== -1) activeSources.splice(idx, 1);
      };

      nextTimer = window.setTimeout(scheduleNode, loopInterval);
    };

    scheduleNode();

    return () => {
      isRunning = false;
      if (nextTimer !== null) clearTimeout(nextTimer);
      if (this.ctx) {
        const now = this.ctx.currentTime;
        activeSources.forEach(({ source, gain }) => {
          try {
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
            setTimeout(() => {
              try { source.stop(); } catch {}
            }, 500);
          } catch {
            try { source.stop(); } catch {}
          }
        });
      }
    };
  }

  // High-fidelity procedural Kerala ambient generator
  private synthesizeSoundscape(type: SoundscapeType): void {
    if (!this.ctx || !this.ambientGain) return;

    const now = this.ctx.currentTime;
    const sceneGain = this.ctx.createGain();
    sceneGain.gain.setValueAtTime(0.0001, now);
    sceneGain.gain.linearRampToValueAtTime(1.0, now + 1.5);
    sceneGain.connect(this.ambientGain);

    const cleanupFns: (() => void)[] = [];

    if (type === 'rain') {
      // Kerala Monsoon: Rain noise bed + distant thunder rumble
      const rainNoise = this.createNoiseBufferNode(true);
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.value = 1000;
      rainFilter.Q.value = 0.8;

      const rainGain = this.ctx.createGain();
      rainGain.gain.value = 0.35;

      rainNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(sceneGain);
      rainNoise.start();

      // Intermittent soft thunder rumble
      const thunderInterval = window.setInterval(() => {
        if (!this.ctx || this.currentSoundscape !== 'rain') return;
        this.triggerThunder(sceneGain);
      }, 14000);

      cleanupFns.push(() => {
        clearInterval(thunderInterval);
        try { rainNoise.stop(); } catch {}
      });

    } else if (type === 'tea-shop') {
      // Roadside tea shop (Thattukada / Chayakada): 
      // 1. Boiling kettle steam hiss
      const steamNoise = this.createNoiseBufferNode(false);
      const steamFilter = this.ctx.createBiquadFilter();
      steamFilter.type = 'highpass';
      steamFilter.frequency.value = 3200;

      const steamGain = this.ctx.createGain();
      steamGain.gain.value = 0.08;

      steamNoise.connect(steamFilter);
      steamFilter.connect(steamGain);
      steamGain.connect(sceneGain);
      steamNoise.start();

      // 2. Cast iron kadai hot coconut oil crackle & gentle sizzle bed
      const oilCrackle = this.createNoiseBufferNode(true);
      const oilFilter = this.ctx.createBiquadFilter();
      oilFilter.type = 'bandpass';
      oilFilter.frequency.value = 1800;
      oilFilter.Q.value = 1.6;

      const oilGain = this.ctx.createGain();
      oilGain.gain.value = 0.07;

      oilCrackle.connect(oilFilter);
      oilFilter.connect(oilGain);
      oilGain.connect(sceneGain);
      oilCrackle.start();

      // 3. Periodic Tea Pouring Sound (Metre Chai frothing cascade from glass to glass)
      const teaPourInterval = window.setInterval(() => {
        if (!this.ctx || this.currentSoundscape !== 'tea-shop') return;
        this.triggerTeaPour(sceneGain);
      }, 9500);

      // 4. Spoon stirring movement inside glass tumbler (Ref: YouTube Tf88zcmywBU)
      const spoonStirInterval = window.setInterval(() => {
        if (!this.ctx || this.currentSoundscape !== 'tea-shop') return;
        this.triggerSpoonStir(sceneGain);
      }, 7200);

      // 5. Periodic Tumbler Glass Clinking
      const clinkInterval = window.setInterval(() => {
        if (!this.ctx || this.currentSoundscape !== 'tea-shop') return;
        this.triggerGlassClink(sceneGain);
      }, 5500);

      // 6. Periodic Vintage Bicycle Bell Ringing ("trin-trin" passing outside the shop)
      const cycleBellInterval = window.setInterval(() => {
        if (!this.ctx || this.currentSoundscape !== 'tea-shop') return;
        this.triggerCycleBell(sceneGain);
      }, 18000);

      cleanupFns.push(() => {
        clearInterval(teaPourInterval);
        clearInterval(spoonStirInterval);
        clearInterval(clinkInterval);
        clearInterval(cycleBellInterval);
        try { steamNoise.stop(); } catch {}
        try { oilCrackle.stop(); } catch {}
      });

    } else if (type === 'bus') {
      // Vintage KSRTC: Low Ashok Leyland diesel engine rumble + road hum
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const busGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.value = 42; // Low diesel vibration
      osc2.type = 'sine';
      osc2.frequency.value = 84;

      const lpf = this.ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 160;

      busGain.gain.value = 0.14;

      osc1.connect(lpf);
      osc2.connect(lpf);
      lpf.connect(busGain);
      busGain.connect(sceneGain);

      osc1.start();
      osc2.start();

      cleanupFns.push(() => {
        try { osc1.stop(); osc2.stop(); } catch {}
      });

    } else if (type === 'ferry') {
      // Backwater Ferry: Water lapping waves against wooden boat
      const waterNoise = this.createNoiseBufferNode(true);
      const waterFilter = this.ctx.createBiquadFilter();
      waterFilter.type = 'lowpass';
      waterFilter.frequency.value = 500;

      // LFO for rhythmic backwater swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.25; // 4 second gentle swell cycle
      lfoGain.gain.value = 0.12;

      const waveGain = this.ctx.createGain();
      waveGain.gain.value = 0.16;

      lfo.connect(waveGain.gain);
      waterNoise.connect(waterFilter);
      waterFilter.connect(waveGain);
      waveGain.connect(sceneGain);

      waterNoise.start();
      lfo.start();

      cleanupFns.push(() => {
        try { waterNoise.stop(); lfo.stop(); } catch {}
      });

    } else if (type === 'village-food') {
      // Village Restaurant: Sizzling cooking + evening village cricket pulses
      const sizzle = this.createNoiseBufferNode(false);
      const sizzleFilter = this.ctx.createBiquadFilter();
      sizzleFilter.type = 'bandpass';
      sizzleFilter.frequency.value = 2400;
      sizzleFilter.Q.value = 1.2;

      const sGain = this.ctx.createGain();
      sGain.gain.value = 0.09;

      sizzle.connect(sizzleFilter);
      sizzleFilter.connect(sGain);
      sGain.connect(sceneGain);
      sizzle.start();

      // Cricket pulse
      const cricketOsc = this.ctx.createOscillator();
      cricketOsc.type = 'sine';
      cricketOsc.frequency.value = 4600;
      const cGain = this.ctx.createGain();
      cGain.gain.value = 0.02;

      cricketOsc.connect(cGain);
      cGain.connect(sceneGain);
      cricketOsc.start();

      cleanupFns.push(() => {
        try { sizzle.stop(); cricketOsc.stop(); } catch {}
      });

    } else {
      // Crowded transit: Gentle low rumble
      const noise = this.createNoiseBufferNode(true);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      const g = this.ctx.createGain();
      g.gain.value = 0.12;
      noise.connect(filter);
      filter.connect(g);
      g.connect(sceneGain);
      noise.start();
      cleanupFns.push(() => { try { noise.stop(); } catch {} });
    }

    this.activeAmbientNodes.push({
      gain: sceneGain,
      stop: () => {
        cleanupFns.forEach((fn) => fn());
        try { sceneGain.disconnect(); } catch {}
      }
    });
  }

  // --- AUDIO SYNTHESIS UTILITIES ---

  private createNoiseBufferNode(pink = false): AudioBufferSourceNode {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (pink) {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    return whiteNoise;
  }

  private triggerThunder(destination: GainNode): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 2.8);

    filter.type = 'lowpass';
    filter.frequency.value = 120;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 3.5);
  }

  private triggerGlassClink(destination: GainNode): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2850, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Realistic tea pouring / metre tea frothing cascade from height
  private triggerTeaPour(destination: GainNode): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const noise = this.createNoiseBufferNode(true);
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Liquid pouring filter sweep from high splash to resonant glass filling
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.8);
    filter.frequency.linearRampToValueAtTime(700, now + 1.8);
    filter.Q.value = 2.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start(now);
    noise.stop(now + 2.1);
  }

  // Exact live spoon stirring & metallic rim clicks (from YouTube reference Tf88zcmywBU)
  private triggerSpoonStir(destination: GainNode): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A sequence of rapid 4-6 rhythmic steel spoon taps against the glass tumbler rim
    const taps = [0, 0.14, 0.28, 0.42, 0.58];
    taps.forEach((offset, idx) => {
      if (!this.ctx) return;
      const tapTime = now + offset;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      // Slightly modulating resonance representing spoon stirring swirl
      const pitch = 2300 + (idx % 2 === 0 ? 120 : -80);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, tapTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.85, tapTime + 0.08);

      g.gain.setValueAtTime(0.001, tapTime);
      g.gain.exponentialRampToValueAtTime(0.07, tapTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, tapTime + 0.09);

      osc.connect(g);
      g.connect(destination);

      osc.start(tapTime);
      osc.stop(tapTime + 0.1);
    });
  }

  // Authentic vintage Indian road bicycle bell double ring ("trin-trin")
  private triggerCycleBell(destination: GainNode): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const ring = (time: number) => {
      if (!this.ctx) return;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2250, time);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2480, time);

      g.gain.setValueAtTime(0.001, time);
      g.gain.exponentialRampToValueAtTime(0.09, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

      osc1.connect(g);
      osc2.connect(g);
      g.connect(destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.3);
      osc2.stop(time + 0.3);
    };

    ring(now);
    ring(now + 0.13); // second chime of "trin-trin"
  }

  // --- VOLUME & MIXER CONTROLS ---

  public setMasterVolume(val: number): void {
    this.masterVol = Math.max(0, Math.min(1, val));
    this.applyVolumes();
  }

  public setMusicVolume(val: number): void {
    this.musicVol = Math.max(0, Math.min(1, val));
    this.applyVolumes();
  }

  public setAmbientVolume(val: number): void {
    this.ambientVol = Math.max(0, Math.min(1, val));
    this.applyVolumes();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.applyVolumes();
    return this.isMuted;
  }

  public toggleAmbient(): boolean {
    this.ambientEnabled = !this.ambientEnabled;
    this.applyVolumes();
    return this.ambientEnabled;
  }

  private applyVolumes(): void {
    if (this.ctx && this.masterGain && this.musicGain && this.ambientGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVol, now, 0.05);
      this.musicGain.gain.setTargetAtTime(this.musicVol, now, 0.05);
      this.ambientGain.gain.setTargetAtTime(this.ambientEnabled ? this.ambientVol : 0, now, 0.05);
    }

    if (this.musicAudio) {
      this.musicAudio.volume = this.isMuted ? 0 : this.masterVol * this.musicVol;
    }

    if (this.ambientAudioElement) {
      this.ambientAudioElement.volume = this.isMuted || !this.ambientEnabled ? 0 : this.masterVol * this.ambientVol;
    }
  }

  public getMixerState() {
    return {
      masterVolume: this.masterVol,
      musicVolume: this.musicVol,
      ambientVolume: this.ambientVol,
      isMuted: this.isMuted,
      ambientEnabled: this.ambientEnabled,
    };
  }
}
