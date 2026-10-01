import React from 'react';
import { Environment } from '../../types/experience';
import { ENVIRONMENTS } from '../../data/environments';

interface HomePageModeSwitcherProps {
  activeEnvironment: Environment;
  onSelectEnvironment: (environment: Environment) => void;
}

// Icons / Badges for quick visual recognition
const SCENE_ICONS: Record<string, string> = {
  'tea-shop': '☕',
  'rainy-home': '🌧️',
  'ksrtc-window': '🚌',
  'village-food-shop': '🍲',
  'kerala-ferry': '🛶',
  'village-bus-stop': '🚏',
};

export const HomePageModeSwitcher: React.FC<HomePageModeSwitcherProps> = ({
  activeEnvironment,
  onSelectEnvironment,
}) => {
  return (
    <nav 
      aria-label="Kerala Environments Mode Selector"
      className="w-full flex justify-center px-3 sm:px-6 mb-3 sm:mb-4 select-none pointer-events-auto z-20"
    >
      <div className="
        flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full
        bg-black/40 backdrop-blur-2xl backdrop-saturate-150
        border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]
        max-w-full overflow-x-auto no-scrollbar scroll-smooth
      ">
        {ENVIRONMENTS.map((env, index) => {
          const isActive = env.id === activeEnvironment.id;
          const icon = SCENE_ICONS[env.id] || '🌴';

          return (
            <button
              key={env.id}
              onClick={() => onSelectEnvironment(env)}
              title={`${env.name} — ${env.malayalamName} (Press ${index + 1})`}
              aria-pressed={isActive}
              className={`
                group relative flex items-center gap-2 sm:gap-2.5 rounded-full
                px-3 py-1.5 sm:px-3.5 sm:py-2
                text-xs sm:text-sm font-medium transition-all duration-300
                shrink-0 cursor-pointer
                ${
                  isActive
                    ? 'bg-white/25 text-white shadow-md border border-white/40 ring-1 ring-white/25 scale-[1.02]'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                }
              `}
            >
              {/* Micro-Thumbnail Image with Active Ring */}
              <div className="relative h-6 w-6 sm:h-7 sm:w-7 rounded-full overflow-hidden shrink-0 border border-white/30 shadow-xs">
                <img
                  src={env.thumbnail}
                  alt={env.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {isActive && (
                  <span className="absolute inset-0 bg-[#C8382D]/20 mix-blend-color" />
                )}
              </div>

              {/* Text Label: English + Malayalam */}
              <div className="flex flex-col items-start leading-tight text-left">
                <span className="flex items-center gap-1 font-semibold text-white tracking-tight">
                  <span className="hidden md:inline text-[11px] opacity-80">{icon}</span>
                  <span className="truncate max-w-[85px] sm:max-w-[120px] md:max-w-[140px]">
                    {env.name.split('(')[0].trim()}
                  </span>
                </span>
                <span className="hidden lg:inline text-[10px] text-[#E9D8B5]/80 font-malayalam truncate max-w-[130px]">
                  {env.malayalamName}
                </span>
              </div>

              {/* Keyboard Shortcut badge (1-6) */}
              <span className={`
                hidden xl:inline-flex items-center justify-center
                h-4 w-4 rounded-full font-mono text-[9px] font-bold ml-0.5
                ${isActive ? 'bg-white/30 text-white' : 'bg-white/10 text-white/50 group-hover:text-white/80'}
              `}>
                {index + 1}
              </span>

              {/* Pulsing Green/Active Indicator dot */}
              {isActive && (
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
