export type SoundscapeType = 
  | 'rain' 
  | 'tea-shop' 
  | 'bus' 
  | 'crowded-transit' 
  | 'village-food' 
  | 'ferry';

export interface Hotspot {
  id: string;
  title: string;
  malayalamTitle?: string;
  description: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  ambientHighlight?: string;
}

export interface Environment {
  id: string;
  name: string;
  malayalamName: string;
  description: string;
  malayalamDescription?: string;
  image: string;
  video?: string;
  thumbnail: string;
  ambientAudio?: string;
  defaultAmbientVolume: number;
  soundscapeType: SoundscapeType;
  camera: {
    desktop: 'subtle-drift' | 'gentle-pan' | 'static';
    mobile: 'subtle-drift' | 'static';
  };
  colorTheme: {
    accent: string;
    overlay: string;
  };
  tags: string[];
  hotspots?: Hotspot[];
}

export interface Song {
  id: string;
  title: string;
  malayalamTitle?: string;
  artist: string;
  movie?: string;
  year?: number;
  audio: string;
  cover?: string;
  tags: string[];
  recommendedEnvironments: string[];
  spotifyUri?: string;
  duration?: number;
}

export interface AudioMixerState {
  musicVolume: number;      // 0.0 - 1.0
  ambientVolume: number;    // 0.0 - 1.0
  masterVolume: number;     // 0.0 - 1.0
  isMuted: boolean;
  ambientEnabled: boolean;
}
