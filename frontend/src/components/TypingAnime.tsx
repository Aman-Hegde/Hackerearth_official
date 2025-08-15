import React, { useState, useEffect } from "react";

export const TypingAnime: React.FC<{ text: string; className?: string; speed?: number }> = ({
  text,
  className = "",
  speed = 80,
}) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
};
