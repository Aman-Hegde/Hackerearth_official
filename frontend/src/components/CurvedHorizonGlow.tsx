import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CurvedHorizonGlow: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Main curved horizon glow - subtle and natural */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[200vw] h-[50vh] max-w-[2000px] sm:w-[180vw] sm:h-[45vh] md:w-[160vw] md:h-[50vh] lg:w-[140vw] lg:h-[55vh] xl:w-[120vw] xl:h-[60vh]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 200% 80% at 50% 100%, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.08) 35%, rgba(196, 181, 253, 0.04) 50%, transparent 75%)'
            : 'radial-gradient(ellipse 200% 80% at 50% 100%, rgba(59, 130, 246, 0.12) 0%, rgba(96, 165, 250, 0.06) 40%, rgba(147, 197, 253, 0.03) 55%, transparent 75%)',
          filter: isDark
            ? 'blur(80px) brightness(1.1) contrast(1.05)'
            : 'blur(70px) brightness(1.05) contrast(1.05)',
          maskImage: isDark
            ? 'radial-gradient(ellipse 200% 80% at 50% 100%, black 0%, black 40%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.2) 50%, transparent 60%, transparent 100%)'
            : 'radial-gradient(ellipse 200% 80% at 50% 100%, black 0%, black 35%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.3) 45%, transparent 55%, transparent 100%)',
          WebkitMaskImage: isDark
            ? 'radial-gradient(ellipse 200% 80% at 50% 100%, black 0%, black 40%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.2) 50%, transparent 60%, transparent 100%)'
            : 'radial-gradient(ellipse 200% 80% at 50% 100%, black 0%, black 35%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.3) 45%, transparent 55%, transparent 100%)',
          animation: isDark
            ? 'curved-horizon-pulse 15s ease-in-out infinite'
            : 'curved-horizon-pulse 12s ease-in-out infinite',
        }}
      />

      {/* Atmospheric brightening layer - very subtle */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[160vw] h-[60vh] sm:w-[140vw] sm:h-[55vh] md:w-[130vw] md:h-[60vh] lg:w-[120vw] lg:h-[65vh]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 180% 60% at 50% 100%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.008) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 180% 60% at 50% 100%, rgba(255, 255, 255, 0.015) 0%, rgba(255, 255, 255, 0.006) 45%, transparent 75%)',
        }}
      />
    </div>
  );
};

export default CurvedHorizonGlow;
