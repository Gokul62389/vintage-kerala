import React, { useState, useEffect, useRef } from 'react';
import { Environment } from '../../types/experience';
import { EnvironmentHotspots } from './EnvironmentHotspots';

interface EnvironmentViewerProps {
  environment: Environment;
  isMotionEnabled: boolean;
  reducedMotion: boolean;
  onHotspotClick?: (title: string, desc: string) => void;
}

export const EnvironmentViewer: React.FC<EnvironmentViewerProps> = ({
  environment,
  isMotionEnabled,
  reducedMotion,
  onHotspotClick,
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
    }, 450);

    return () => clearTimeout(timer);
  }, [environment.id]);

  // Video playback management
  useEffect(() => {
    if (videoRef.current && environment.video && !videoError) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Fallback to static illustration if autoplay fails
        setVideoError(true);
      });
    }
  }, [environment.video, videoError]);

  const useMotion = isMotionEnabled && !reducedMotion;
  const motionClass = useMotion 
    ? (environment.camera.desktop === 'gentle-pan' ? 'animate-gentle-pan' : 'animate-subtle-drift') 
    : '';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#181816]">
      {/* Background Visual Layer */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          isTransitioning ? 'opacity-30 scale-[1.01]' : 'opacity-100'
        }`}
      >
        {/* Render Flow-generated MP4 Video if available and working */}
        {environment.video && !videoError ? (
          <div className="relative w-full h-full overflow-hidden">
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
              className={`w-full h-full object-cover object-center ${motionClass} transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Show static image while video streams */}
            {!isVideoLoaded && (
              <img
                src={environment.image}
                alt={environment.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
          </div>
        ) : (
          /* Render High-Resolution Hand-Painted Illustration */
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={environment.image}
              alt={environment.name}
              className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ${motionClass}`}
            />
          </div>
        )}
      </div>

      {/* Atmospheric Analog Vignette & Kerala Color Grading */}
      <div 
        className="absolute inset-0 pointer-events-none analog-vignette mix-blend-multiply opacity-80"
      />
      <div 
        className="absolute inset-0 pointer-events-none warm-dust-overlay opacity-30" 
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: environment.colorTheme.overlay,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Interactive Hotspots Layer */}
      {environment.hotspots && environment.hotspots.length > 0 && (
        <EnvironmentHotspots 
          hotspots={environment.hotspots}
          onSelect={onHotspotClick}
        />
      )}
    </div>
  );
};
