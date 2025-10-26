import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CurvedSectionTransition: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="absolute -top-20 left-0 right-0 w-full overflow-hidden pointer-events-none z-[7]">
      {/* Concave curved top for next section - mirrors hero glow */}
      <svg
        className={`curved-transition-svg absolute top-0 left-1/2 transform -translate-x-1/2 w-[200vw] h-[40vh] max-w-[2400px] sm:h-[35vh] md:h-[38vh] lg:h-[42vh] xl:h-[45vh]`}
        viewBox="0 0 2400 480"
        preserveAspectRatio="none"
        style={{
          filter: isDark
            ? 'blur(60px) brightness(0.8) contrast(1.1)'
            : 'blur(50px) brightness(0.7) contrast(1.1)',
        }}
      >
        <defs>
          <linearGradient id="concaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(59, 130, 246, 0.12)"} />
            <stop offset="35%" stopColor={isDark ? "rgba(167, 139, 250, 0.08)" : "rgba(96, 165, 250, 0.06)"} />
            <stop offset="65%" stopColor={isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(147, 197, 253, 0.02)"} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Concave curve that mirrors the hero's convex glow */}
        <path
          d="M0,480 C200,160 400,100 600,80 C800,60 1000,70 1200,85 C1400,100 1600,90 1800,100 C2000,110 2200,140 2400,180 L2400,480 L0,480 Z"
          fill="url(#concaveGradient)"
        />

        {/* Additional atmospheric layer for seamless integration */}
        <path
          d="M0,480 C300,200 600,140 900,120 C1200,100 1500,110 1800,130 C2100,150 2250,180 2400,220 L2400,480 L0,480 Z"
          fill={isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(255, 255, 255, 0.01)"}
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default CurvedSectionTransition;
