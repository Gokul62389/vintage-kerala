import React from 'react';
import { Headphones, Sparkles, Volume2 } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181816]/95 backdrop-blur-md px-6 text-[#E9D8B5] transition-opacity duration-700">
      {/* Background textured gradient */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#C6A46A 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative max-w-lg w-full text-center flex flex-col items-center">
        {/* Traditional Brass Nilavilakku Icon */}
        <div className="w-16 h-16 mb-6 rounded-full border border-[#C6A46A]/40 p-2.5 bg-[#1D2B24]/80 shadow-lg shadow-[#1D2B24]/50 flex items-center justify-center">
          <img 
            src="/assets/icons/kerala-lamp.svg" 
            alt="Kerala Nilavilakku" 
            className="w-full h-full object-contain filter drop-shadow"
          />
        </div>

        {/* Malayalam Header */}
        <p className="font-malayalam text-lg text-[#C6A46A] tracking-wider mb-2 font-medium">
          നാട്ടു ഓർമ്മകളും സംഗീതവും
        </p>

        {/* Project Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-wide text-[#E9D8B5] mb-3">
          VINTAGE KERALA
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-[#E9D8B5]/80 font-light max-w-md mx-auto mb-8 leading-relaxed">
          Songs from places we remember. Step into living Kerala illustrations, monsoon rains, and timeless Malayalam melodies.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1D2B24] hover:bg-[#253930] text-[#E9D8B5] border border-[#C6A46A]/60 shadow-xl shadow-black/40 hover:shadow-[#C6A46A]/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-medium text-base tracking-wide"
        >
          <Sparkles className="w-4 h-4 text-[#C6A46A] transition-transform group-hover:rotate-12" />
          <span>Enter the Memory</span>
        </button>

        {/* Audio notice badge */}
        <div className="mt-8 flex items-center gap-4 text-xs text-[#E9D8B5]/60 bg-black/40 px-4 py-2 rounded-full border border-white/5">
          <span className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#C6A46A]" />
            Best experienced with headphones
          </span>
          <span className="w-1 h-1 rounded-full bg-[#E9D8B5]/40" />
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#C6A46A]" />
            Spatial soundscapes
          </span>
        </div>
      </div>
    </div>
  );
};
