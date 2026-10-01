// Spotify IFrame Controller singleton manager
// Handles loading songs into Spotify Embed Controller for full uninterrupted playback

export interface SpotifyPlaybackUpdate {
  position: number; // milliseconds
  duration: number; // milliseconds
  isPaused: boolean;
  isBuffering: boolean;
}

type PlaybackCallback = (update: SpotifyPlaybackUpdate) => void;

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIFrameAPI?: any;
  }
}

export class SpotifyPlayerManager {
  private static instance: SpotifyPlayerManager;
  private controller: any = null;
  private isReady: boolean = false;
  private listeners: Set<PlaybackCallback> = new Set();
  private containerElement: HTMLElement | null = null;
  private pendingUri: string | null = null;
  private pendingPlay: boolean = false;

  private constructor() {
    this.initApi();
  }

  public static getInstance(): SpotifyPlayerManager {
    if (!SpotifyPlayerManager.instance) {
      SpotifyPlayerManager.instance = new SpotifyPlayerManager();
    }
    return SpotifyPlayerManager.instance;
  }

  public mount(element: HTMLElement, initialUri: string = 'spotify:track:4yFIiVAmKnkE8FbNBELVdg'): void {
    this.containerElement = element;
    if (window.SpotifyIFrameAPI) {
      this.createController(element, initialUri);
    } else {
      this.pendingUri = initialUri;
    }
  }

  private initApi(): void {
    if (typeof window === 'undefined') return;

    // Check if script is already present
    if (window.SpotifyIFrameAPI) {
      if (this.containerElement && this.pendingUri) {
        this.createController(this.containerElement, this.pendingUri);
      }
      return;
    }

    const previousReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      window.SpotifyIFrameAPI = IFrameAPI;
      if (previousReady) {
        try { previousReady(IFrameAPI); } catch {}
      }

      if (this.containerElement && (this.pendingUri || true)) {
        this.createController(this.containerElement, this.pendingUri || 'spotify:track:4yFIiVAmKnkE8FbNBELVdg');
      }
    };
  }

  private createController(element: HTMLElement, uri: string): void {
    if (!window.SpotifyIFrameAPI) return;

    try {
      window.SpotifyIFrameAPI.createController(
        element,
        {
          uri,
          width: '100%',
          height: '100%',
        },
        (EmbedController: any) => {
          this.controller = EmbedController;
          this.isReady = true;

          // Subscribe to playback updates
          EmbedController.addListener('playback_update', (e: any) => {
            if (e && e.data) {
              this.notifyListeners(e.data);
            }
          });

          if (this.pendingPlay) {
            this.pendingPlay = false;
            try {
              EmbedController.play();
            } catch {}
          }
        }
      );
    } catch (err) {
      console.warn('Failed to initialize Spotify EmbedController:', err);
    }
  }

  public loadTrack(spotifyUri: string, autoPlay: boolean = true): void {
    this.pendingUri = spotifyUri;
    if (this.controller && this.isReady) {
      try {
        this.controller.loadUri(spotifyUri);
        if (autoPlay) {
          setTimeout(() => {
            try { this.controller.play(); } catch {}
          }, 350);
        }
      } catch (err) {
        console.warn('Spotify loadUri failed:', err);
      }
    } else {
      this.pendingPlay = autoPlay;
    }
  }

  public play(): void {
    if (this.controller && this.isReady) {
      try {
        this.controller.play();
      } catch (err) {
        console.warn('Spotify play failed:', err);
      }
    } else {
      this.pendingPlay = true;
    }
  }

  public pause(): void {
    if (this.controller && this.isReady) {
      try {
        this.controller.pause();
      } catch (err) {
        console.warn('Spotify pause failed:', err);
      }
    }
  }

  public togglePlay(): void {
    if (this.controller && this.isReady) {
      try {
        this.controller.togglePlay();
      } catch (err) {
        console.warn('Spotify togglePlay failed:', err);
      }
    }
  }

  public seek(seconds: number): void {
    if (this.controller && this.isReady) {
      try {
        this.controller.seek(Math.floor(seconds));
      } catch (err) {
        console.warn('Spotify seek failed:', err);
      }
    }
  }

  public subscribe(cb: PlaybackCallback): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners(data: SpotifyPlaybackUpdate): void {
    this.listeners.forEach((cb) => {
      try { cb(data); } catch {}
    });
  }

  public getReadyState(): boolean {
    return this.isReady && this.controller !== null;
  }
}
