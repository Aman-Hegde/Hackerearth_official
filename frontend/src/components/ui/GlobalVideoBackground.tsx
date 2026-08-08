import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const GlobalVideoBackground = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="global-video-background" aria-hidden="true">
      {!shouldReduceMotion && (
        <video
          className={`global-video-background__video${isPlaying ? ' global-video-background__video--playing' : ''}`}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/dreamscape-bg-poster.jpg"
          tabIndex={-1}
          onPlaying={() => setIsPlaying(true)}
        >
          <source src="/media/dreamscape-bg.mp4" type="video/mp4" />
        </video>
      )}
      <div className="global-video-background__overlay" />
    </div>
  );
};

export default GlobalVideoBackground;
