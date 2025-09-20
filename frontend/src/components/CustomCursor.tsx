// src/components/CustomCursor.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // Make sure this path is correct

const SpotlightCursor = () => {
  const { isDark } = useTheme();
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // UPDATED: The light mode color is now more opaque for better visibility.
  const spotlightColor = isDark
    ? 'rgba(29, 78, 216, 0.15)' // Blue glow for dark mode
    : 'rgba(41, 89, 222, 0.1)';    // A slightly stronger dark shadow for light mode

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] transition-colors duration-300"
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
      }}
    />
  );
};

export default SpotlightCursor;