import React, { useState } from 'react';
import { Hotspot } from '../../types/experience';
import { Sparkles, X } from 'lucide-react';

interface EnvironmentHotspotsProps {
  hotspots: Hotspot[];
  onSelect?: (title: string, desc: string) => void;
}

export const EnvironmentHotspots: React.FC<EnvironmentHotspotsProps> = ({
  hotspots,
  onSelect,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {hotspots.map((spot) => {
        const isActive = activeHotspotId === spot.id;

        return (
          <div
            key={spot.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
            }}
          >
            {/* Hotspot Target Indicator */}
            <button
              onClick={() => {
                const nextState = isActive ? null : spot.id;
                setActiveHotspotId(nextState);
                if (nextState && onSelect) {
                  onSelect(spot.title, spot.description);
                }
              }}
              aria-label={`Inspect ${spot.title}`}
              aria-expanded={isActive}
              className="group relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C6A46A]"
            >
              {/* Pulsing Kerala brass wave */}
              <span className="absolute w-full h-full rounded-full bg-[#C6A46A]/25 animate-ping opacity-60 pointer-events-none" />
              
              {/* Outer circle */}
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#181816]/80 border border-[#C6A46A]/80 shadow-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-125">
                <span className="w-2 h-2 rounded-full bg-[#E9D8B5]" />
              </span>
            </button>

            {/* Interactive Tooltip Card */}
            {isActive && (
              <div 
                className="absolute z-30 w-64 sm:w-72 bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 rounded-xl bg-[#1D2B24]/95 text-[#E9D8B5] border border-[#C6A46A]/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    {spot.malayalamTitle && (
                      <span className="font-malayalam text-xs text-[#C6A46A] block font-medium">
                        {spot.malayalamTitle}
                      </span>
                    )}
                    <h4 className="font-medium text-sm text-[#E9D8B5] leading-tight">
                      {spot.title}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(null);
                    }}
                    className="text-[#E9D8B5]/60 hover:text-[#E9D8B5] p-0.5 rounded-full"
                    aria-label="Close hotspot information"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#E9D8B5]/80 leading-relaxed font-light mb-2">
                  {spot.description}
                </p>

                {spot.ambientHighlight && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#C6A46A] pt-2 border-t border-white/10 font-normal">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{spot.ambientHighlight}</span>
                  </div>
                )}

                {/* Arrow Pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-[#1D2B24] border-r border-b border-[#C6A46A]/40 transform rotate-45" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
