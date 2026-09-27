import React from 'react';

export interface CavotLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

export const CavotLogo: React.FC<CavotLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
  onClick,
  theme,
}) => {
  const dimensions = {
    sm: { icon: 28, font: 'text-base font-extrabold tracking-tight', gap: 'gap-2.5' },
    md: { icon: 36, font: 'text-xl font-extrabold tracking-tight', gap: 'gap-3' },
    lg: { icon: 52, font: 'text-3xl font-extrabold tracking-tight', gap: 'gap-3.5' },
    hero: { icon: 88, font: 'text-5xl sm:text-6xl md:text-7xl font-black tracking-tight', gap: 'gap-4' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${dimensions.gap} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Cavot"
    >
      {/* 
        CAVOT C LETTERMARK EMBLEM:
        - Bold, distinctive, modern technology-company lettermark
        - Dynamic dual-arc geometry with precision bevel cutouts and vibrant technological energy
        - High-contrast dual gradient:
          • Crisp Electric Indigo & Vivid Cyan core with subtle emerald/amber accents
          • Premium drop-shadow and inner depth for iconic recognition at any scale
        - Pure C lettermark: no animal shapes, no snake head, no generic font
      */}
      <div className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 active:scale-95">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cavot-c-mark drop-shadow-md"
        >
          <defs>
            {/* Primary C Gradient */}
            <linearGradient id="cavotGradPrimary" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="45%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Upper Apex Arc Gradient */}
            <linearGradient id="cavotGradAccent" x1="30" y1="10" x2="90" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            {/* Lower Dynamic Terminal Gradient */}
            <linearGradient id="cavotGradLower" x1="20" y1="60" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="cavotGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Main Sculpted C-Lettermark Architecture */}
          {/* Main Continuous Body */}
          <path
            d="M72 16.5 C60 10 46 8.5 35 11 C18 15 6 30 6 50 C6 70 18 85 35 89 C48 92 62 88 74 81.5 C77 79.5 76.5 75 73 74 L63.5 70 C61.5 69.2 59.5 70 58 71 C49 76.5 39 76 32 72.5 C22 67.5 18 58 18 50 C18 42 22 32.5 32 27.5 C40 23.5 50 23.5 58 28.5 C60 29.8 62.5 29.5 64 28 L72.5 20 C75 17.5 74 15 72 16.5 Z"
            fill="url(#cavotGradPrimary)"
          />

          {/* Upper Swept Fin / Bevel Wing of the C */}
          <path
            d="M58 13.5 C68 15.5 77 20 83 26 C85.5 28.5 84.5 32 81 33.5 L69 38.5 C66.5 39.5 64 38 63 35.5 C60.5 29.5 54 24.5 46 22 L51 14.5 C53.5 13.8 56 13.2 58 13.5 Z"
            fill="url(#cavotGradAccent)"
          />

          {/* Lower Dynamic Acceleration Terminal */}
          <path
            d="M62 64 C64 61.5 67 61 69.5 62 L81.5 67 C85 68.5 86 72 83.5 74.5 C76 82 66 87 54 89 L51 81 C55 80 59 78 62 75 Z"
            fill="url(#cavotGradLower)"
          />

          {/* Precision Geometric Core Aperture Spark (Distinctive Tech Cut) */}
          <circle cx="50" cy="50" r="4.5" fill="#3B82F6" opacity="0.8" />
        </svg>
      </div>

      {showWordmark && (
        <span
          className={`font-sans tracking-tight font-extrabold text-slate-900 dark:text-white transition-colors ${dimensions.font}`}
        >
          <span className="text-blue-600 dark:text-blue-400">C</span>avot
        </span>
      )}
    </div>
  );
};
