import React, { useState, useEffect, useRef } from 'react';
import { Environment } from '../../types/experience';

interface EnvironmentViewerProps {
  environment: Environment;
}

export const EnvironmentViewer: React.FC<EnvironmentViewerProps> = ({
  environment,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Smooth cross-fade between environments
  useEffect(() => {
    setIsTransitioning(true);
    setIsVideoLoaded(false);
    setVideoError(false);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [environment.id]);

  // Video playback management if .mp4 is available
  useEffect(() => {
    if (videoRef.current && environment.video && !videoError) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
  }, [environment.video, videoError]);

  return (
    <div className="hero-bg fixed inset-0 -z-10 bg-black overflow-hidden select-none">
      {/* Background Visual Layer with Subtle 28s Cinematic Breathing Drift */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Render MP4 Loop if provided and functional */}
        {environment.video && !videoError ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={environment.video}
              poster={environment.image}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!isVideoLoaded && (
              <img
                src={environment.image}
                alt={environment.name}
                className="absolute inset-0 w-full h-full object-cover object-center animate-subtle-drift"
              />
            )}
          </div>
        ) : (
          /* High-Resolution Hand-Painted Gouache Masterpiece with organic subtle drift */
          <div className="relative w-full h-full">
            <img
              src={environment.image}
              alt={environment.name}
              className="w-full h-full object-cover object-center animate-subtle-drift"
            />
          </div>
        )}
      </div>

      {/* Saloon.wtf Exact Subtle Atmospheric Gradients for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
    </div>
  );
};
