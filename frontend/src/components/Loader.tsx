import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LoaderProps {
  className?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ className = "", size = 54 }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`loader ${className}`}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className={`bar${i + 1}`}
          style={{
            background: isDark
              ? `linear-gradient(45deg, #8B5CF6, #A855F7, #C084FC, #DDD6FE)`
              : `linear-gradient(45deg, #7C3AED, #8B5CF6, #A855F7, #C084FC)`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
